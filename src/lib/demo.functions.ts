import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEMO_JOURNEYS, DEMO_TITLE_PREFIX } from "./demo-seed";

export const seedDemoData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Remove qualquer demo antigo do usuário para permitir re-seed idempotente
    await supabase
      .from("conversations")
      .delete()
      .eq("user_id", userId)
      .like("title", `${DEMO_TITLE_PREFIX}%`);

    const now = Date.now();
    let createdConversations = 0;
    let createdMessages = 0;
    let createdUnderstandings = 0;
    let createdArtifacts = 0;

    for (let j = 0; j < DEMO_JOURNEYS.length; j++) {
      const journey = DEMO_JOURNEYS[j];
      // Timestamps: jornadas mais completas mais antigas para ficarem no final da lista
      const daysAgo = 2 + j * 2;
      const baseTs = now - daysAgo * 24 * 60 * 60 * 1000;
      const baseIso = new Date(baseTs).toISOString();

      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .insert({
          user_id: userId,
          service_type: journey.service_type,
          title: journey.title,
          briefing: journey.briefing,
          created_at: baseIso,
          updated_at: new Date(baseTs + journey.messages.length * 4 * 60_000).toISOString(),
        })
        .select()
        .single();
      if (convErr) throw new Error(convErr.message);
      createdConversations++;

      // Discovery state
      const { error: stateErr } = await supabase.from("discovery_states").insert({
        conversation_id: conv.id,
        user_id: userId,
        facts: journey.facts,
        coverage_by_category: journey.coverage,
        primary_category: journey.primary_category,
        updated_at: new Date(baseTs + journey.messages.length * 4 * 60_000).toISOString(),
      });
      if (stateErr) throw new Error(stateErr.message);

      // Messages — timestamps progressivos a cada 4 min
      if (journey.messages.length > 0) {
        const messageRows = journey.messages.map((m, i) => ({
          conversation_id: conv.id,
          user_id: userId,
          role: m.role,
          content: m.content,
          created_at: new Date(baseTs + i * 4 * 60_000).toISOString(),
        }));
        const { error: msgErr } = await supabase.from("messages").insert(messageRows);
        if (msgErr) throw new Error(msgErr.message);
        createdMessages += messageRows.length;
      }

      // Understandings versionadas
      for (let v = 0; v < journey.understandings.length; v++) {
        const u = journey.understandings[v];
        const { error: uErr } = await supabase.from("executive_understandings").insert({
          conversation_id: conv.id,
          user_id: userId,
          version: v + 1,
          summary: u.summary,
          diagnosis: u.diagnosis,
          missing_information: u.missing_information,
          risks: u.risks,
          assumptions: u.assumptions,
          next_steps: u.next_steps,
          complexity: u.complexity,
          created_at: new Date(baseTs + (journey.messages.length + v) * 5 * 60_000).toISOString(),
        });
        if (uErr) throw new Error(uErr.message);
        createdUnderstandings++;
      }

      // Artifacts
      if (journey.artifacts.length > 0) {
        const artifactRows = journey.artifacts.map((a, i) => ({
          conversation_id: conv.id,
          user_id: userId,
          kind: a.kind,
          title: a.title,
          content: a.content,
          created_at: new Date(baseTs + (journey.messages.length + 10 + i) * 60_000).toISOString(),
        }));
        const { error: aErr } = await supabase.from("artifacts").insert(artifactRows);
        if (aErr) throw new Error(aErr.message);
        createdArtifacts += artifactRows.length;
      }
    }

    return {
      ok: true,
      created: {
        conversations: createdConversations,
        messages: createdMessages,
        understandings: createdUnderstandings,
        artifacts: createdArtifacts,
      },
    };
  });

export const wipeDemoData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { error, count } = await supabase
      .from("conversations")
      .delete({ count: "exact" })
      .eq("user_id", userId)
      .like("title", `${DEMO_TITLE_PREFIX}%`);
    if (error) throw new Error(error.message);
    return { ok: true, deleted: count ?? 0 };
  });

export const hasDemoData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { count, error } = await context.supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId)
      .like("title", `${DEMO_TITLE_PREFIX}%`);
    if (error) throw new Error(error.message);
    return { has: (count ?? 0) > 0, count: count ?? 0 };
  });