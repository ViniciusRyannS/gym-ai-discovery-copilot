# Technical Context

## Stack

- TanStack Start e TanStack Router;
- React 19 e TypeScript;
- Vite;
- Tailwind CSS v4 e Radix UI;
- Supabase Auth, PostgreSQL e RLS;
- Lovable AI Gateway;
- MCP com OAuth.

## Arquitetura

- `src/routes`: rotas de interface e endpoints;
- `src/lib/*.functions.ts`: funções executadas no servidor;
- `src/integrations/supabase`: clientes e middleware de autenticação;
- `src/integrations/lovable`: autenticação OAuth gerenciada;
- `src/lib/mcp`: servidor e ferramentas MCP;
- `supabase/migrations`: schema, triggers e políticas RLS.

## Autenticação atual

- E-mail e senha usam Supabase Auth diretamente;
- Google usa `@lovable.dev/cloud-auth-js`;
- a sessão do navegador é anexada às server functions como Bearer token;
- rotas sob `_authenticated` validam o usuário atual.

## Restrições conhecidas

- O projeto usa um Supabase remoto e depende de rede;
- confirmação automática de e-mail está desabilitada;
- Google OAuth local ainda não foi validado;
- o plugin MCP 0.23.x exige um contorno para caminhos do Windows;
- existem testes unitários em Node, mas não uma suíte E2E permanente;
- a CI do GitHub valida instalação, tipos, testes e build em Node.js 22.
