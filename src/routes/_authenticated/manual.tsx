import { createFileRoute } from "@tanstack/react-router";
import { MarkdownView } from "@/components/MarkdownView";

export const Route = createFileRoute("/_authenticated/manual")({
  head: () => ({
    meta: [
      { title: "Manual — Gym.AI" },
      { name: "description", content: "Manual do sistema Gym.AI: funcionalidades, limitações, próximos passos e integrantes do grupo Gym.IA." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Manual,
});

const CONTENT = `# Manual do Gym.AI

> Copiloto conversacional de discovery técnico-comercial para pré-vendas.
> Entregue pelo grupo **Gym.IA**.

---

## 1. Descrição do sistema

O **Gym.AI** é um copiloto que conduz o pré-vendas por um discovery estruturado em **10 categorias fixas** (contexto de negócio, ambiente atual, escopo técnico, operação, segurança, volumetria, criticidade, governança, premissas e riscos). A cada turno do chat, um pipeline multi-agente (classifier → interpreter → question_generator → validator) extrai fatos da resposta do cliente, atualiza a **cobertura por categoria** em tempo real e sugere a próxima pergunta mais relevante. Ao final, o sistema produz um **Entendimento Executivo versionado** e artefatos prontos (PRD, ADR, Spec técnica, User Stories) em Markdown, exportáveis com um clique.

O objetivo é padronizar a qualidade do discovery, reduzir tempo de sênior por proposta e eliminar retrabalho no fechamento comercial.

## 2. Principais funcionalidades

- **Novo discovery guiado** — formulário com serviço, título e briefing. Anexo de arquivos \`.txt\` / \`.md\` para colar contexto pronto.
- **Chat multi-agente** — orquestrador em TypeScript rodando via Lovable AI Gateway (Gemini 2.5 Flash + Pro), com histórico persistido e RLS por usuário.
- **Cockpit de Cobertura** — radar SVG animado das 10 categorias, com anel de progresso global e deltas por turno.
- **Entendimento Executivo versionado** — sumário, diagnóstico, informações faltantes, riscos, premissas, próximos passos e nível de complexidade. Cada geração cria uma nova versão.
- **Artefatos automáticos** — PRD, ADR, Spec e User Stories em Markdown, versionados por conversa, com preview e download.
- **Portfólio de serviços** — catálogo por usuário com categoria, descrição, apelidos e switch ativo/inativo. Usado como referência pelo motor.
- **Prompt Studio** — editor do system prompt com histórico de versões, ativação com um clique e importação de \`.txt\` / \`.md\`.
- **Command Palette (⌘K / Ctrl+K)** — navegação e busca de discoveries em qualquer tela.
- **Jornadas de demonstração** — botão que popula 4 discoveries realistas (Migração Cloud, RAG, Zero Trust, Data Platform) com mensagens, fatos e artefatos completos.
- **Autenticação** — email/senha e Google (Lovable Managed OAuth), com bootstrap automático de portfólio inicial no signup.
- **Agent integrations (MCP)** — servidor MCP OAuth 2.1 (\`/mcp\`) para que assistentes externos como ChatGPT, Claude ou Codex operem sob a identidade do usuário Gym.IA respeitando a mesma RLS.

## 3. O que ainda não está funcionando

- **Streaming token-a-token** no chat: a resposta chega inteira (JSON estruturado). Um endpoint SSE está previsto mas não implementado.
- **RBAC / multi-tenant**: hoje cada usuário é um tenant implícito. Papéis (admin, revisor) e compartilhamento entre membros do mesmo tenant ainda não existem.
- **Base de conhecimento (@meta)**: as referências no prompt são fixas; não há indexação de documentos do cliente.
- **Exportação para .docx / .pdf**: só \`.md\` está disponível. PDF/Docx são próximos passos.
- **Anexos além de .txt / .md**: PDFs, planilhas e imagens ainda não são lidos pelo motor.
- **Testes automatizados end-to-end**: cobertura de testes é parcial; existem checagens de tipos e build, sem suíte de e2e.
- **Métricas de uso e auditoria**: não há dashboard interno de consumo por usuário/discovery.
- **Integrações CRM (HubSpot / Salesforce)**: previstas via server functions, ainda não conectadas.

## 4. Próximos passos e evoluções

1. **Streaming real** do chat com Server-Sent Events e cursor pulsante no cliente.
2. **Colaboração em tempo real** — dois pré-vendas na mesma conversa via Supabase Realtime.
3. **Base de conhecimento por tenant** com embeddings (\`pgvector\`) e referências \`@meta:doc\` no prompt.
4. **Exportação PDF / DOCX / PPTX** dos artefatos com branding do consultor.
5. **Modo revisor** — humano no loop com aprovação/rejeição de fatos antes de entrarem no estado.
6. **Templates de portfólio por indústria** (financeiro, varejo, saúde, indústria).
7. **Integração com CRM** (HubSpot / Salesforce) — sincronizar discoveries como oportunidades.
8. **App móvel PWA** com captura de áudio para transcrição em campo (Lovable AI STT).
9. **Métricas de qualidade** — score de cobertura mínima por serviço antes de liberar geração de artefatos.
10. **Marketplace de prompts** — comunidade Gym.IA compartilhando system prompts especializados.

## 5. Grupo e integrantes

**Grupo: Gym.IA**

- Vinicius Ryann
- Carlos Andrade
- Eduarda Coelho
- Fábio
- Kaiky Gomes

---

_Entregue como MVP funcional em Julho de 2026. Stack: TanStack Start · React 19 · Tailwind v4 · Lovable Cloud (Supabase + RLS) · Lovable AI Gateway (Gemini 2.5)._
`;

function Manual() {
  return (
    <div className="mx-auto w-full max-w-3xl overflow-y-auto px-6 py-10">
      <header className="mb-8">
        <div className="font-mono-tabular text-[10px] uppercase tracking-widest text-primary">
          Entrega / Sobre
        </div>
        <h1 className="font-display mt-1 text-4xl">Manual do Gym.AI</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Descrição, funcionalidades, limitações, próximos passos e créditos do grupo Gym.IA.
        </p>
      </header>
      <article className="glass rounded-2xl p-8">
        <MarkdownView content={CONTENT} />
      </article>
    </div>
  );
}