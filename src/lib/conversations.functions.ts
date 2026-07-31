import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateText, NoObjectGeneratedError, Output, type ModelMessage } from "ai";
import { createGateway, CHAT_MODEL, REASONING_MODEL } from "@/lib/ai-gateway.server";
import {
  DEFAULT_SYSTEM_PROMPT,
  DISCOVERY_CATEGORIES,
  EMPTY_COVERAGE,
} from "@/lib/discovery-defaults";
import {
  assessDiscoveryInput,
  getInputRecoveryReply,
  isGroundedEvidence,
} from "@/lib/discovery-input";

// ---------- Conversations ----------

export const listConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("conversations")
      .select("id, title, service_type, briefing, created_at, updated_at")
      .eq("user_id", context.userId)
      .eq("is_deleted", false)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        service_type: z.string().min(1),
        briefing: z.string().min(1),
        title: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({ ...data, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await supabase.from("discovery_states").insert({
      conversation_id: conv.id,
      user_id: userId,
    });
    return conv;
  });

export const getConversation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: conv, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!conv) throw new Error("Conversa não encontrada");

    const [{ data: messages }, { data: state }] = await Promise.all([
      supabase.from("messages").select("*").eq("conversation_id", conv.id).order("created_at"),
      supabase.from("discovery_states").select("*").eq("conversation_id", conv.id).maybeSingle(),
    ]);
    return { conversation: conv, messages: messages ?? [], state };
  });

export const deleteConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("conversations")
      .update({ is_deleted: true })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- The Discovery Orchestrator ----------

const TurnSchema = z.object({
  reply: z
    .string()
    .describe("Resposta em português, ~3 parágrafos, com 1 pergunta clara ao final."),
  facts: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
        category: z.enum(DISCOVERY_CATEGORIES.map((c) => c.key) as [string, ...string[]]),
        evidence: z.string().describe("Trecho literal copiado da última mensagem do usuário."),
      }),
    )
    .default([])
    .describe("Novos fatos extraídos da última mensagem do usuário."),
  coverage_deltas: z
    .record(
      z.enum(DISCOVERY_CATEGORIES.map((c) => c.key) as [string, ...string[]]),
      z.number().min(0).max(1),
    )
    .default({})
    .describe("Deltas de cobertura por categoria (0..1) somados ao estado atual, clamped em 1."),
  primary_category: z.string().nullable().default(null),
  next_category: z.string().nullable().default(null),
});

function loadKey() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY ausente. Habilite Lovable AI no projeto.");
  return key;
}

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ conversation_id: z.string().uuid(), content: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const [
      { data: conv },
      { data: history },
      { data: state },
      { data: portfolio },
      { data: activePrompt },
    ] = await Promise.all([
      supabase
        .from("conversations")
        .select("*")
        .eq("id", data.conversation_id)
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", data.conversation_id)
        .order("created_at"),
      supabase
        .from("discovery_states")
        .select("*")
        .eq("conversation_id", data.conversation_id)
        .maybeSingle(),
      supabase
        .from("portfolio_items")
        .select("category, name, description")
        .eq("user_id", userId)
        .eq("is_active", true),
      supabase
        .from("prompts")
        .select("id, active_version_id")
        .eq("user_id", userId)
        .eq("is_active", true)
        .maybeSingle(),
    ]);
    if (!conv) throw new Error("Conversa não encontrada");

    let systemPrompt = DEFAULT_SYSTEM_PROMPT;
    if (activePrompt?.active_version_id) {
      const { data: v } = await supabase
        .from("prompt_versions")
        .select("content")
        .eq("id", activePrompt.active_version_id)
        .maybeSingle();
      if (v?.content) systemPrompt = v.content;
    }

    // Persist user turn now
    const { error: userMessageError } = await supabase.from("messages").insert({
      conversation_id: conv.id,
      user_id: userId,
      role: "user",
      content: data.content,
    });
    if (userMessageError) throw new Error(userMessageError.message);

    const currentCoverage =
      (state?.coverage_by_category as Record<string, number> | null) ?? EMPTY_COVERAGE;
    const currentFacts =
      (state?.facts as Array<{ key: string; value: string; category: string }> | null) ?? [];
    const inputAssessment = assessDiscoveryInput(data.content);

    if (inputAssessment.kind !== "informative") {
      const reply = getInputRecoveryReply(inputAssessment.kind, conv.service_type);
      const { data: assistantRow, error: assistantError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conv.id,
          user_id: userId,
          role: "assistant",
          content: reply,
        })
        .select()
        .single();
      if (assistantError) throw new Error(assistantError.message);

      return {
        assistant_message: assistantRow,
        coverage_by_category: currentCoverage,
        overall_coverage:
          Object.values(currentCoverage).reduce((a, b) => a + b, 0) / DISCOVERY_CATEGORIES.length,
        primary_category: state?.primary_category ?? null,
        next_category: state?.pending_category ?? null,
      };
    }

    const contextPreamble = `# CONTEXTO DO DISCOVERY

**Serviço proposto:** ${conv.service_type}
**Briefing inicial:** ${conv.briefing}

**Portfólio ativo do consultor:**
${(portfolio ?? []).map((p) => `- [${p.category}] ${p.name}: ${p.description}`).join("\n") || "- (vazio)"}

**Cobertura atual por categoria (0..1):**
${Object.entries(currentCoverage)
  .map(([k, v]) => `- ${k}: ${v.toFixed(2)}`)
  .join("\n")}

**Fatos já capturados:**
${currentFacts.length ? currentFacts.map((f) => `- [${f.category}] ${f.key}: ${f.value}`).join("\n") : "- (nenhum)"}

Responda ao usuário e retorne também a estimativa de novos fatos e deltas de cobertura.`;

    const gateway = createGateway(loadKey());
    const model = gateway(CHAT_MODEL);

    let parsed: z.infer<typeof TurnSchema>;
    try {
      const modelMessages: ModelMessage[] = (history ?? [])
        .filter(
          (message) =>
            message.role === "user" || message.role === "assistant" || message.role === "system",
        )
        .map((message) => ({
          role: message.role as "user" | "assistant" | "system",
          content: message.content,
        }));
      modelMessages.push({ role: "user", content: data.content });

      const { output } = await generateText({
        model,
        output: Output.object({ schema: TurnSchema }),
        system: `${systemPrompt}\n\n${contextPreamble}`,
        messages: modelMessages,
      });
      parsed = output as z.infer<typeof TurnSchema>;
    } catch (err) {
      if (NoObjectGeneratedError.isInstance(err)) {
        parsed = {
          reply:
            err.text ??
            "Desculpe, tive um problema para estruturar a resposta. Pode repetir a última informação?",
          facts: [],
          coverage_deltas: {},
          primary_category: null,
          next_category: null,
        };
      } else {
        throw err;
      }
    }

    // Merge state
    const groundedFacts = (parsed.facts ?? []).filter((fact) =>
      isGroundedEvidence(data.content, fact.evidence),
    );
    const groundedCategories = new Set(groundedFacts.map((fact) => fact.category));
    const nextCoverage = { ...currentCoverage };
    for (const [k, delta] of Object.entries(parsed.coverage_deltas ?? {})) {
      if (!groundedCategories.has(k)) continue;
      nextCoverage[k] = Math.min(1, Math.max(0, (nextCoverage[k] ?? 0) + Number(delta || 0)));
    }
    const nextFacts = currentFacts.concat(groundedFacts);

    const [{ data: assistantRow }] = await Promise.all([
      supabase
        .from("messages")
        .insert({
          conversation_id: conv.id,
          user_id: userId,
          role: "assistant",
          content: parsed.reply,
        })
        .select()
        .single(),
      state
        ? supabase
            .from("discovery_states")
            .update({
              coverage_by_category: nextCoverage,
              facts: nextFacts,
              primary_category: parsed.primary_category ?? state.primary_category,
              pending_category: parsed.next_category ?? state.pending_category,
              updated_at: new Date().toISOString(),
            })
            .eq("conversation_id", conv.id)
        : supabase.from("discovery_states").insert({
            conversation_id: conv.id,
            user_id: userId,
            coverage_by_category: nextCoverage,
            facts: nextFacts,
            primary_category: parsed.primary_category,
            pending_category: parsed.next_category,
          }),
      supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conv.id),
    ]);

    return {
      assistant_message: assistantRow,
      coverage_by_category: nextCoverage,
      overall_coverage:
        Object.values(nextCoverage).reduce((a, b) => a + b, 0) / DISCOVERY_CATEGORIES.length,
      primary_category: parsed.primary_category,
      next_category: parsed.next_category,
    };
  });

// ---------- Executive Understanding ----------

const UnderstandingSchema = z.object({
  summary: z.string(),
  diagnosis: z.string(),
  missing_information: z.array(z.string()),
  risks: z.array(z.string()),
  assumptions: z.array(z.string()),
  next_steps: z.array(z.string()),
  complexity: z.enum(["baixa", "media", "alta"]),
});

export const generateUnderstanding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ conversation_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: conv }, { data: messages }, { data: state }] = await Promise.all([
      supabase
        .from("conversations")
        .select("*")
        .eq("id", data.conversation_id)
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", data.conversation_id)
        .order("created_at"),
      supabase
        .from("discovery_states")
        .select("*")
        .eq("conversation_id", data.conversation_id)
        .maybeSingle(),
    ]);
    if (!conv) throw new Error("Conversa não encontrada");

    const gateway = createGateway(loadKey());
    const facts =
      (state?.facts as Array<{ key: string; value: string; category: string }> | null) ?? [];
    const transcript = (messages ?? []).map((m) => `**${m.role}**: ${m.content}`).join("\n\n");

    const { output } = await generateText({
      model: gateway(REASONING_MODEL),
      output: Output.object({ schema: UnderstandingSchema }),
      prompt: `Você é um pré-vendas sênior. Gere um **Entendimento Executivo** curto, objetivo e acionável para o discovery abaixo.

**Serviço:** ${conv.service_type}
**Briefing:** ${conv.briefing}

**Fatos capturados:**
${facts.map((f) => `- [${f.category}] ${f.key}: ${f.value}`).join("\n") || "(nenhum)"}

**Transcrição:**
${transcript}

Retorne:
- summary: 2-3 frases do cenário do cliente.
- diagnosis: análise honesta do que está claro e do que preocupa.
- missing_information: 3-6 itens do que ainda falta.
- risks: 3-6 riscos priorizados.
- assumptions: premissas que estamos assumindo se aprovarmos hoje.
- next_steps: 3-5 próximos passos concretos.
- complexity: baixa | media | alta.`,
    });

    const { count } = await supabase
      .from("executive_understandings")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", conv.id);

    const { data: saved, error } = await supabase
      .from("executive_understandings")
      .insert({
        conversation_id: conv.id,
        user_id: userId,
        version: (count ?? 0) + 1,
        ...(output as z.infer<typeof UnderstandingSchema>),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return saved;
  });

export const listUnderstandings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ conversation_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("executive_understandings")
      .select("*")
      .eq("conversation_id", data.conversation_id)
      .eq("user_id", context.userId)
      .order("version", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

// ---------- Artifacts ----------

const KINDS = ["prd", "adr", "spec", "user_story"] as const;

const ARTIFACT_HINTS: Record<(typeof KINDS)[number], string> = {
  prd: "Product Requirements Document estilo Lean PRD (Contexto, Objetivos, Não-Objetivos, Público, Requisitos Funcionais, Não-Funcionais, Métricas, Riscos).",
  adr: "Architecture Decision Record (Contexto, Decisão, Alternativas, Consequências).",
  spec: "Especificação técnica curta (Arquitetura proposta, Componentes, Fluxos, Contratos de API, Modelo de dados, Segurança, Operação).",
  user_story:
    "Um conjunto de 5-8 user stories no formato 'Como <persona> quero <ação> para <valor>' com critérios de aceite em bullets.",
};

export const generateArtifacts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        conversation_id: z.string().uuid(),
        kinds: z.array(z.enum(KINDS)).min(1),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: conv }, { data: state }, { data: last }] = await Promise.all([
      supabase
        .from("conversations")
        .select("*")
        .eq("id", data.conversation_id)
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("discovery_states")
        .select("facts")
        .eq("conversation_id", data.conversation_id)
        .maybeSingle(),
      supabase
        .from("executive_understandings")
        .select("*")
        .eq("conversation_id", data.conversation_id)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    if (!conv) throw new Error("Conversa não encontrada");

    const gateway = createGateway(loadKey());
    const facts =
      (state?.facts as Array<{ key: string; value: string; category: string }> | null) ?? [];

    const factsBlock =
      facts.map((f) => `- [${f.category}] ${f.key}: ${f.value}`).join("\n") || "(nenhum)";
    const understandingBlock = last
      ? `**Sumário:** ${last.summary}\n**Diagnóstico:** ${last.diagnosis}\n**Riscos:** ${(last.risks || []).join("; ")}`
      : "(sem entendimento executivo)";

    const results = [];
    for (const kind of data.kinds) {
      const { text } = await generateText({
        model: gateway(REASONING_MODEL),
        prompt: `Gere um artefato do tipo **${kind}** em **Markdown puro** para o discovery abaixo. ${ARTIFACT_HINTS[kind]}

Não inclua metadados externos, só o Markdown. Título H1 na primeira linha.

**Serviço:** ${conv.service_type}
**Briefing:** ${conv.briefing}

**Fatos:**
${factsBlock}

**Entendimento Executivo:**
${understandingBlock}`,
      });

      const title = text.match(/^#\s+(.+)$/m)?.[1] ?? `${kind.toUpperCase()} — ${conv.title}`;
      const { data: saved, error } = await supabase
        .from("artifacts")
        .insert({ conversation_id: conv.id, user_id: userId, kind, title, content: text })
        .select()
        .single();
      if (error) throw new Error(error.message);
      results.push(saved);
    }
    return results;
  });

export const listArtifacts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ conversation_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("artifacts")
      .select("*")
      .eq("conversation_id", data.conversation_id)
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
