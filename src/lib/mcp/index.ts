import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listDiscoveries from "./tools/list-discoveries";
import getDiscovery from "./tools/get-discovery";
import createDiscovery from "./tools/create-discovery";
import listPortfolio from "./tools/list-portfolio";
import listUnderstandings from "./tools/list-understandings";
import listArtifacts from "./tools/list-artifacts";
import getActivePrompt from "./tools/get-active-prompt";

// The OAuth issuer MUST be the direct Supabase host — SUPABASE_URL is rewritten
// to the .lovable.cloud proxy on publish, which mcp-js rejects (RFC 8414 issuer
// mismatch). VITE_SUPABASE_PROJECT_ID is inlined by Vite at build time and is
// the only value that survives publish unchanged.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "gym-ai-mcp",
  title: "Gym.AI Discovery Copilot",
  version: "0.1.0",
  instructions:
    "Tools do Gym.AI, um copiloto de discovery técnico-comercial. " +
    "Use `list_portfolio` e `list_discoveries` para descobrir o contexto, " +
    "`get_discovery` para inspecionar um discovery específico (mensagens, cobertura, fatos), " +
    "`create_discovery` para iniciar um novo, e `list_understandings` / `list_artifacts` " +
    "para ler o Entendimento Executivo e artefatos (PRD, ADR, Spec, User Stories). " +
    "Todas as tools operam como o usuário autenticado, respeitando as políticas RLS do Gym.AI.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listDiscoveries,
    getDiscovery,
    createDiscovery,
    listPortfolio,
    listUnderstandings,
    listArtifacts,
    getActivePrompt,
  ],
});