import { DISCOVERY_CATEGORIES, EMPTY_COVERAGE } from "../discovery-defaults.ts";
import { assessDiscoveryInput, getInputRecoveryReply } from "../discovery-input.ts";

const prompts = [
  "**Contexto de negócio:** qual resultado mensurável precisa justificar este projeto para o decisor?",
  "**Ambiente atual:** quais sistemas e integrações não podem parar durante a mudança?",
  "**Escopo técnico:** o que precisa estar obrigatoriamente na primeira entrega e o que pode ficar para depois?",
  "**Operação:** quais SLAs, janelas de manutenção e responsabilidades de suporte existem hoje?",
  "**Segurança e conformidade:** há dados pessoais, requisitos LGPD, auditorias ou controles obrigatórios?",
  "**Volumetria:** quais são os volumes médios, picos e crescimento esperado para os próximos 12 meses?",
  "**Criticidade:** qual é o impacto financeiro ou operacional de uma hora de indisponibilidade?",
  "**Governança:** quem patrocina, aprova e valida tecnicamente esta iniciativa?",
  "**Premissas e exclusões:** quais dependências ou itens estão explicitamente fora do escopo?",
  "**Riscos e validações:** o que ainda precisa de POC, assessment ou confirmação antes da proposta?",
];

export function getDemoReply(messageCount: number) {
  const index = Math.min(messageCount, prompts.length - 1);
  return `${prompts[index]}\n\nVou registrar sua resposta como contexto demonstrativo. Neste modo, nenhuma informação é enviada para serviços externos.`;
}

export function getDemoTurn(content: string, informativeMessageCount: number, serviceType: string) {
  const assessment = assessDiscoveryInput(content);
  if (assessment.kind !== "informative") {
    return {
      advancesCoverage: false,
      reply: getInputRecoveryReply(assessment.kind, serviceType),
    };
  }
  return {
    advancesCoverage: true,
    reply: getDemoReply(informativeMessageCount),
  };
}

export function getDemoCoverage(messageCount: number) {
  const coverage = { ...EMPTY_COVERAGE };
  DISCOVERY_CATEGORIES.forEach((category, index) => {
    const distance = messageCount - index;
    coverage[category.key] =
      distance >= 2 ? 0.85 : distance === 1 ? 0.58 : distance === 0 ? 0.32 : 0.08;
  });
  return coverage;
}
