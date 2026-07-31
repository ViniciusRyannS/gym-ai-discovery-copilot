import { DISCOVERY_CATEGORIES } from "../discovery-defaults.ts";

import type { DemoConversation, DemoMessage } from "./store";

export type DemoUnderstanding = {
  id: string;
  version: number;
  summary: string;
  diagnosis: string;
  missing_information: string[];
  risks: string[];
  assumptions: string[];
  next_steps: string[];
  complexity: "baixa" | "media" | "alta";
  created_at: string;
  simulated: true;
};

export type DemoArtifactKind = "prd" | "adr" | "spec" | "user_story";

export type DemoArtifact = {
  id: string;
  kind: DemoArtifactKind;
  title: string;
  content: string;
  created_at: string;
  simulated: true;
};

type DeliverableContext = {
  conversation: DemoConversation;
  messages: DemoMessage[];
  coverage: Record<string, number>;
};

function id() {
  return crypto.randomUUID();
}

function userAnswers(messages: DemoMessage[]) {
  return messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.trim())
    .filter(Boolean);
}

function coveragePercent(coverage: Record<string, number>) {
  const values = DISCOVERY_CATEGORIES.map((category) => coverage[category.key] ?? 0);
  return Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 100);
}

function missingCategories(coverage: Record<string, number>) {
  return DISCOVERY_CATEGORIES.filter((category) => (coverage[category.key] ?? 0) < 0.6).map(
    (category) => category.label,
  );
}

function sourceBlock(context: DeliverableContext) {
  const answers = userAnswers(context.messages);
  return answers.length
    ? answers.map((answer) => `- ${answer}`).join("\n")
    : "- Nenhuma resposta adicional foi registrada.";
}

const REVIEW_NOTICE =
  "> **Demonstração local:** conteúdo gerado por template determinístico, sem IA. Revise e valide antes de qualquer uso com clientes.";

export function buildDemoUnderstanding(
  context: DeliverableContext,
  version = 1,
): DemoUnderstanding {
  const answers = userAnswers(context.messages);
  const missing = missingCategories(context.coverage);
  const overall = coveragePercent(context.coverage);
  const evidenceSummary = answers.length
    ? `Foram registradas ${answers.length} resposta(s) do usuário além do briefing.`
    : "Ainda não há respostas adicionais ao briefing.";

  return {
    id: id(),
    version,
    summary: `${context.conversation.title} é um discovery de ${context.conversation.service_type}. O briefing informado foi: “${context.conversation.briefing}”`,
    diagnosis: `A cobertura demonstrativa está em ${overall}%. ${evidenceSummary} O material é suficiente apenas para orientar a próxima conversa; não comprova viabilidade técnica ou comercial.`,
    missing_information: missing.length
      ? missing.map((category) => `Aprofundar ${category}.`)
      : ["Confirmar os fatos capturados com os responsáveis pelo projeto."],
    risks: [
      "Tomar decisões com dados ainda não confirmados.",
      "Transformar hipóteses do discovery em compromisso de proposta.",
      "Subestimar dependências técnicas, operacionais ou de governança.",
    ],
    assumptions: [
      `O serviço em avaliação permanece ${context.conversation.service_type}.`,
      "As respostas registradas representam a percepção atual do participante.",
      "Valores, prazos e requisitos ainda precisam de evidência independente.",
    ],
    next_steps: [
      "Validar o resumo com o responsável comercial e técnico.",
      `Priorizar as categorias com menor cobertura: ${missing.slice(0, 3).join(", ") || "nenhuma"}.`,
      "Registrar métricas de sucesso, responsáveis e critérios de aceite.",
      "Revisar riscos antes de estimar esforço ou investimento.",
    ],
    complexity: overall >= 75 ? "media" : "alta",
    created_at: new Date().toISOString(),
    simulated: true,
  };
}

function buildPrd(context: DeliverableContext) {
  return `# PRD — ${context.conversation.title}

${REVIEW_NOTICE}

## Contexto

**Serviço:** ${context.conversation.service_type}

${context.conversation.briefing}

## Problema a validar

O discovery ainda precisa transformar o briefing em um problema mensurável, com público afetado e impacto confirmado.

## Evidências registradas

${sourceBlock(context)}

## Objetivos

- Validar o problema e o resultado esperado.
- Definir métricas de sucesso e responsáveis.
- Delimitar MVP, dependências e não objetivos.

## Requisitos iniciais

- O escopo deve ser confirmado com stakeholders técnicos e de negócio.
- Requisitos não funcionais devem cobrir segurança, operação e capacidade.
- Cada requisito deve possuir critério de aceite verificável.

## Lacunas

${missingCategories(context.coverage)
  .map((category) => `- Aprofundar ${category}.`)
  .join("\n")}
`;
}

function buildAdr(context: DeliverableContext) {
  return `# ADR — Estratégia inicial para ${context.conversation.service_type}

${REVIEW_NOTICE}

## Status

Proposta para discussão.

## Contexto

${context.conversation.briefing}

## Decisão

Não selecionar uma arquitetura definitiva antes de validar requisitos, restrições e critérios de sucesso. A decisão inicial é conduzir um assessment incremental e registrar alternativas.

## Alternativas a avaliar

1. Evolução incremental do ambiente atual.
2. Implementação de uma nova solução em paralelo.
3. Abordagem híbrida com migração por etapas.

## Consequências

- Reduz risco de compromisso prematuro.
- Exige tempo de discovery e validação técnica.
- Mantém custos e cronograma como pendências até existir evidência suficiente.

## Evidências disponíveis

${sourceBlock(context)}
`;
}

function buildSpec(context: DeliverableContext) {
  return `# Spec — ${context.conversation.title}

${REVIEW_NOTICE}

## Visão

Especificação inicial para ${context.conversation.service_type}, criada a partir do briefing e das respostas disponíveis.

## Entradas confirmadas

${sourceBlock(context)}

## Componentes a detalhar

- experiência e fluxos do usuário;
- serviços e integrações;
- dados e contratos;
- autenticação e autorização;
- observabilidade, operação e suporte;
- capacidade, resiliência e recuperação.

## Critérios técnicos mínimos

- decisões rastreáveis por ADR;
- tratamento explícito de falhas;
- logs sem dados sensíveis;
- critérios de aceite automatizáveis;
- plano de implantação e rollback.

## Pendências

${missingCategories(context.coverage)
  .map((category) => `- ${category}`)
  .join("\n")}
`;
}

function buildStories(context: DeliverableContext) {
  return `# User Stories — ${context.conversation.title}

${REVIEW_NOTICE}

## US-01 — Validar o problema

Como responsável pelo discovery, quero confirmar o problema e seu impacto para evitar uma solução sem valor mensurável.

**Critérios de aceite**

- problema descrito com evidências;
- público afetado identificado;
- métrica atual registrada.

## US-02 — Delimitar o escopo

Como responsável técnico, quero separar MVP, evoluções e exclusões para produzir uma estimativa rastreável.

**Critérios de aceite**

- escopo e não escopo documentados;
- dependências identificadas;
- responsáveis definidos.

## US-03 — Validar riscos

Como decisor, quero conhecer riscos e hipóteses para aprovar próximos passos conscientemente.

**Critérios de aceite**

- riscos priorizados;
- hipóteses claramente marcadas;
- validações e responsáveis registrados.

## Base usada

${sourceBlock(context)}
`;
}

export function buildDemoArtifacts(
  context: DeliverableContext,
  kinds: DemoArtifactKind[],
): DemoArtifact[] {
  const builders: Record<DemoArtifactKind, () => string> = {
    prd: () => buildPrd(context),
    adr: () => buildAdr(context),
    spec: () => buildSpec(context),
    user_story: () => buildStories(context),
  };
  const labels: Record<DemoArtifactKind, string> = {
    prd: "PRD",
    adr: "ADR",
    spec: "Spec",
    user_story: "User Stories",
  };

  return [...new Set(kinds)].map((kind) => ({
    id: id(),
    kind,
    title: `${labels[kind]} — ${context.conversation.title}`,
    content: builders[kind](),
    created_at: new Date().toISOString(),
    simulated: true,
  }));
}
