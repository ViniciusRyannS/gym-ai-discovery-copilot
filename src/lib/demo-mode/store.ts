import { getDemoSession } from "./auth.ts";
import { assessDiscoveryInput } from "../discovery-input.ts";
import {
  buildDemoArtifacts,
  buildDemoUnderstanding,
  type DemoArtifact,
  type DemoArtifactKind,
  type DemoUnderstanding,
} from "./deliverables.ts";
import { getDemoCoverage, getDemoTurn } from "./replies.ts";

const STORE_PREFIX = "gymai.demo.data.v1";
const EXAMPLE_CONVERSATION_TITLE = "[EXEMPLO] Retrabalho na produção";

export type DemoPortfolioItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  aliases: string[];
  is_active: boolean;
};

export type DemoConversation = {
  id: string;
  title: string;
  service_type: string;
  briefing: string;
  created_at: string;
};

export type DemoMessage = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

export type DemoConversationDetail = {
  conversation: DemoConversation;
  messages: DemoMessage[];
  state: {
    coverage_by_category: Record<string, number>;
    primary_category: string;
  };
  understandings: DemoUnderstanding[];
  artifacts: DemoArtifact[];
};

type DemoStore = {
  portfolio: DemoPortfolioItem[];
  conversations: DemoConversationDetail[];
};

const initialPortfolio: DemoPortfolioItem[] = [
  {
    id: "cloud",
    category: "Cloud",
    name: "Migração Cloud AWS",
    description: "Assessment, landing zone, migração e modernização de workloads.",
    aliases: ["aws", "migração"],
    is_active: true,
  },
  {
    id: "data",
    category: "Dados",
    name: "Plataforma de Dados",
    description: "Arquitetura analítica, pipelines, governança e observabilidade.",
    aliases: ["lakehouse", "bi"],
    is_active: true,
  },
  {
    id: "ai",
    category: "IA",
    name: "Assistente com IA Generativa",
    description: "Descoberta, RAG, integrações e guardrails para assistentes corporativos.",
    aliases: ["rag", "chatbot"],
    is_active: true,
  },
  {
    id: "security",
    category: "Segurança",
    name: "Assessment de Segurança",
    description: "Diagnóstico de riscos, controles, conformidade e plano de evolução.",
    aliases: ["lgpd", "assessment"],
    is_active: true,
  },
  {
    id: "devops",
    category: "Engenharia",
    name: "Modernização DevOps",
    description: "CI/CD, plataforma de engenharia, SRE e automação operacional.",
    aliases: ["devops", "sre"],
    is_active: true,
  },
];

function id() {
  return crypto.randomUUID();
}

function storageKey() {
  const session = getDemoSession();
  if (!session) throw new Error("Sessão de demonstração não encontrada.");
  return `${STORE_PREFIX}.${session.email}`;
}

function load(): DemoStore {
  const key = storageKey();
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored) as DemoStore;
      parsed.conversations = parsed.conversations.map((detail) => ({
        ...detail,
        understandings: detail.understandings ?? [],
        artifacts: detail.artifacts ?? [],
      }));
      return parsed;
    }
  } catch {
    // The fresh store below keeps the demo usable if stored data is malformed.
  }
  const fresh: DemoStore = { portfolio: initialPortfolio, conversations: [] };
  localStorage.setItem(key, JSON.stringify(fresh));
  return fresh;
}

function save(store: DemoStore) {
  localStorage.setItem(storageKey(), JSON.stringify(store));
}

export function listDemoPortfolio() {
  return load().portfolio;
}

export function addDemoPortfolioItem(input: Omit<DemoPortfolioItem, "id">) {
  const store = load();
  const item: DemoPortfolioItem = { ...input, id: id() };
  store.portfolio.push(item);
  save(store);
  return item;
}

export function toggleDemoPortfolioItem(itemId: string, isActive: boolean) {
  const store = load();
  const item = store.portfolio.find((candidate) => candidate.id === itemId);
  if (!item) throw new Error("Serviço demonstrativo não encontrado.");
  item.is_active = isActive;
  save(store);
  return item;
}

export function deleteDemoPortfolioItem(itemId: string) {
  const store = load();
  store.portfolio = store.portfolio.filter((item) => item.id !== itemId);
  save(store);
}

export function listDemoConversations() {
  return load()
    .conversations.map((item) => item.conversation)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function createDemoConversation(input: {
  service_type: string;
  briefing: string;
  title: string;
}) {
  const store = load();
  const conversation: DemoConversation = {
    id: id(),
    ...input,
    created_at: new Date().toISOString(),
  };
  store.conversations.push({
    conversation,
    messages: [],
    state: {
      coverage_by_category: getDemoCoverage(0),
      primary_category: "contexto_negocio",
    },
    understandings: [],
    artifacts: [],
  });
  save(store);
  return conversation;
}

export function openCompleteDemoConversation() {
  const store = load();
  const existing = store.conversations.find(
    (item) => item.conversation.title === EXAMPLE_CONVERSATION_TITLE,
  );
  if (existing) return existing.conversation;

  const createdAt = Date.now();
  const conversation: DemoConversation = {
    id: id(),
    title: EXAMPLE_CONVERSATION_TITLE,
    service_type: "Modernização de processos e automação",
    briefing:
      "O cliente relata retrabalho no apontamento de produção, atrasos nas entregas e pouca clareza sobre onde os erros começam.",
    created_at: new Date(createdAt).toISOString(),
  };
  const turns: Array<Pick<DemoMessage, "role" | "content">> = [
    {
      role: "user",
      content:
        "O cliente está com muito retrabalho no fechamento das ordens de produção. Isso está atrasando entregas e ninguém sabe exatamente onde o erro começa.",
    },
    {
      role: "assistant",
      content:
        "**Contexto de negócio:** qual resultado mensurável precisa justificar este projeto para o decisor?\n\nEsta é uma conversa demonstrativa. Nenhuma informação é enviada para serviços externos.",
    },
    {
      role: "user",
      content:
        "A diretoria quer reduzir o retrabalho em pelo menos 40% e recuperar dois dias no prazo médio de entrega até o fim do próximo trimestre.",
    },
    {
      role: "assistant",
      content:
        "**Ambiente atual:** onde os apontamentos são registrados hoje e quais sistemas ou integrações participam do processo?",
    },
    {
      role: "user",
      content:
        "Os operadores anotam em planilhas por turno. Depois um analista digita tudo novamente no ERP Totvs, que envia dados ao sistema de qualidade.",
    },
    {
      role: "assistant",
      content:
        "**Escopo técnico:** o que precisa estar obrigatoriamente na primeira entrega e o que pode ficar para uma fase posterior?",
    },
    {
      role: "user",
      content:
        "Na primeira entrega precisamos capturar o apontamento uma única vez, validar campos obrigatórios e integrar com o ERP. Previsão de demanda pode ficar para depois.",
    },
    {
      role: "assistant",
      content:
        "**Operação:** quais SLAs, janelas de manutenção e responsabilidades de suporte devem ser considerados?",
    },
    {
      role: "user",
      content:
        "A fábrica opera em três turnos e só pode parar aos domingos entre 2h e 5h. TI atende o ERP e Engenharia de Processos será dona das regras.",
    },
    {
      role: "assistant",
      content:
        "**Segurança e conformidade:** existem dados pessoais, requisitos de auditoria ou controles obrigatórios?",
    },
    {
      role: "user",
      content:
        "Precisamos registrar operador, horário e alterações para auditoria ISO 9001. Não haverá dado sensível além da matrícula corporativa.",
    },
    {
      role: "assistant",
      content:
        "**Volumetria:** quantos apontamentos são feitos, quais são os picos e qual crescimento é esperado?",
    },
    {
      role: "user",
      content:
        "São cerca de 1.800 apontamentos por dia, com pico de 250 no fechamento de cada turno. A nova linha deve aumentar o volume em 30% no próximo ano.",
    },
    {
      role: "assistant",
      content:
        "**Criticidade:** qual é o impacto financeiro ou operacional quando o processo fica indisponível ou contém erros?",
    },
    {
      role: "user",
      content:
        "Uma hora sem apontamento não para as máquinas, mas gera fila manual. Erros descobertos no dia seguinte podem atrasar um lote inteiro e custar até R$ 80 mil em hora extra e frete emergencial.",
    },
    {
      role: "assistant",
      content: "**Governança:** quem patrocina, aprova e valida tecnicamente a iniciativa?",
    },
    {
      role: "user",
      content:
        "O diretor industrial patrocina, o gerente de TI aprova a arquitetura e os supervisores de produção validam o fluxo em um piloto na Linha 2.",
    },
    {
      role: "assistant",
      content:
        "**Premissas e exclusões:** quais dependências são assumidas e o que está explicitamente fora do escopo inicial?",
    },
    {
      role: "user",
      content:
        "Vamos reutilizar tablets industriais e as APIs homologadas do Totvs. Trocar o ERP, prever demanda e automatizar manutenção ficam fora do MVP.",
    },
    {
      role: "assistant",
      content:
        "**Riscos e validações:** o que precisa ser comprovado antes de fechar solução, prazo e investimento?",
    },
    {
      role: "user",
      content:
        "Precisamos testar o Wi-Fi no chão de fábrica, confirmar limites da API do ERP e executar um piloto de duas semanas sem eliminar a planilha de contingência.",
    },
    {
      role: "assistant",
      content:
        "**Discovery consolidado:** o problema deixou de ser apenas ‘retrabalho’. Agora há meta, processo atual, integrações, escopo do MVP, restrições operacionais, auditoria, volume, impacto, responsáveis e validações.\n\nA hipótese de solução é capturar o apontamento uma única vez nos tablets, validar dados na origem e integrar com o Totvs, começando por um piloto reversível na Linha 2. Abra **Entendimento** e **Artefatos** para ver como este contexto foi transformado em entregáveis revisáveis.",
    },
  ];
  const messages: DemoMessage[] = turns.map((turn, index) => ({
    id: id(),
    ...turn,
    created_at: new Date(createdAt + index + 1).toISOString(),
  }));
  const coverage = getDemoCoverage(10);
  const context = { conversation, messages, coverage };
  const detail: DemoConversationDetail = {
    conversation,
    messages,
    state: {
      coverage_by_category: coverage,
      primary_category: "riscos_validacoes",
    },
    understandings: [buildDemoUnderstanding(context, 1)],
    artifacts: buildDemoArtifacts(context, ["prd", "adr", "spec", "user_story"]),
  };

  store.conversations.unshift(detail);
  save(store);
  return conversation;
}

export function getDemoConversation(conversationId: string) {
  const detail = load().conversations.find((item) => item.conversation.id === conversationId);
  if (!detail) throw new Error("Discovery demonstrativo não encontrado.");
  return detail;
}

export function sendDemoMessage(conversationId: string, content: string) {
  const store = load();
  const detail = store.conversations.find((item) => item.conversation.id === conversationId);
  if (!detail) throw new Error("Discovery demonstrativo não encontrado.");
  const informativeMessages = detail.messages.filter(
    (message) =>
      message.role === "user" && assessDiscoveryInput(message.content).kind === "informative",
  ).length;
  const turn = getDemoTurn(content, informativeMessages, detail.conversation.service_type);
  const timestamp = Date.now();
  detail.messages.push(
    {
      id: id(),
      role: "user",
      content,
      created_at: new Date(timestamp).toISOString(),
    },
    {
      id: id(),
      role: "assistant",
      content: turn.reply,
      created_at: new Date(timestamp + 1).toISOString(),
    },
  );
  if (turn.advancesCoverage) {
    detail.state.coverage_by_category = getDemoCoverage(informativeMessages + 1);
  }
  save(store);
  return detail;
}

export function deleteDemoConversation(conversationId: string) {
  const store = load();
  store.conversations = store.conversations.filter(
    (item) => item.conversation.id !== conversationId,
  );
  save(store);
}

export function generateDemoUnderstanding(conversationId: string) {
  const store = load();
  const detail = store.conversations.find((item) => item.conversation.id === conversationId);
  if (!detail) throw new Error("Discovery demonstrativo não encontrado.");
  const understanding = buildDemoUnderstanding(
    {
      conversation: detail.conversation,
      messages: detail.messages,
      coverage: detail.state.coverage_by_category,
    },
    detail.understandings.length + 1,
  );
  detail.understandings.unshift(understanding);
  save(store);
  return understanding;
}

export function generateDemoArtifacts(conversationId: string, kinds: DemoArtifactKind[]) {
  const store = load();
  const detail = store.conversations.find((item) => item.conversation.id === conversationId);
  if (!detail) throw new Error("Discovery demonstrativo não encontrado.");
  const artifacts = buildDemoArtifacts(
    {
      conversation: detail.conversation,
      messages: detail.messages,
      coverage: detail.state.coverage_by_category,
    },
    kinds,
  );
  detail.artifacts = [...artifacts, ...detail.artifacts];
  save(store);
  return artifacts;
}
