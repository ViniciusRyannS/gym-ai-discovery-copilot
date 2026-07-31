export type DiscoveryInputAssessment =
  { kind: "informative" } | { kind: "greeting" } | { kind: "noise" };

const GREETINGS = new Set([
  "oi",
  "ola",
  "olá",
  "opa",
  "e ai",
  "e aí",
  "bom dia",
  "boa tarde",
  "boa noite",
  "hello",
  "hi",
]);

const NOISE_TERMS = new Set([
  "a",
  "aa",
  "aaa",
  "aaaa",
  "teste",
  "test",
  "testando",
  "te4ste",
  "asdf",
  "qwerty",
  "xxx",
]);

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR").replace(/\s+/g, " ");
}

export function assessDiscoveryInput(content: string): DiscoveryInputAssessment {
  const normalized = normalize(content);
  if (GREETINGS.has(normalized)) return { kind: "greeting" };
  if (!normalized || NOISE_TERMS.has(normalized)) return { kind: "noise" };
  if (!/[\p{L}\p{N}]/u.test(normalized)) return { kind: "noise" };

  const compact = normalized.replace(/[^\p{L}\p{N}]/gu, "");
  if (/^([\p{L}\p{N}])\1{2,}$/u.test(compact)) return { kind: "noise" };
  if (/^[\p{L}]$/u.test(compact)) return { kind: "noise" };

  return { kind: "informative" };
}

export function getInputRecoveryReply(kind: "greeting" | "noise", serviceType: string) {
  if (kind === "greeting") {
    return `Olá! Vamos estruturar o discovery de **${serviceType}**. Para começar, descreva em uma frase o problema de negócio, o resultado esperado ou o motivo que tornou este projeto necessário.`;
  }
  return `Não consegui extrair informação suficiente dessa resposta — e não vou assumir um fato que você não informou. Sobre **${serviceType}**, descreva em uma frase o problema atual, o resultado esperado ou um exemplo concreto de retrabalho, risco ou impacto.`;
}

export function isGroundedEvidence(content: string, evidence: string) {
  const normalizedContent = normalize(content);
  const normalizedEvidence = normalize(evidence).replace(/^["“”']|["“”']$/g, "");
  return normalizedEvidence.length >= 2 && normalizedContent.includes(normalizedEvidence);
}
