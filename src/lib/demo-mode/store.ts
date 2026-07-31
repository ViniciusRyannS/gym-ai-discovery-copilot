import { getDemoSession } from "./auth";
import { getDemoCoverage, getDemoReply } from "./replies";

const STORE_PREFIX = "gymai.demo.data.v1";

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
    if (stored) return JSON.parse(stored) as DemoStore;
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
  });
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
  const userMessages = detail.messages.filter((message) => message.role === "user").length;
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
      content: getDemoReply(userMessages),
      created_at: new Date(timestamp + 1).toISOString(),
    },
  );
  detail.state.coverage_by_category = getDemoCoverage(userMessages + 1);
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
