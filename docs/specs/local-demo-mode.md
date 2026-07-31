# DEMO-001 — Local Demo Mode

## Status

Primeira entrega implementada — validação manual no navegador pendente.

## Objetivo

Permitir que avaliadores abram e naveguem pelo Gym.AI localmente sem conta
Supabase, confirmação de e-mail, Google OAuth ou credenciais externas.

## Problema

O projeto remoto exige configuração de autenticação à qual o mantenedor da
cópia não tem acesso. Um bypass somente na página de login não funciona porque
as telas seguintes dependem de token Supabase, banco remoto e RLS.

## Evidências

- Docker não está instalado, impedindo Supabase local neste momento;
- a chave pública não pode alterar `Confirm email`;
- Google está sem OAuth secret;
- página inicial chama portfólio, conversations e jornadas demo no backend;
- chat, Prompt Studio e painéis de artefatos também usam server functions
  protegidas.

## Impacto

Sem um modo local completo, a demonstração fica bloqueada antes de apresentar o
valor do produto.

## Decisão

Criar um modo de demonstração explicitamente separado da autenticação real:

- contas fictícias e sessão ficam somente no navegador;
- senha fictícia nunca é enviada para serviços externos;
- quando armazenada, a senha será representada por hash via Web Crypto;
- dados do modo demo usam `localStorage` e são isolados por e-mail fictício;
- a interface exibe indicador persistente `MODO DEMO`;
- nenhum dado demo será apresentado como dado real do Supabase;
- logout encerra apenas a sessão local;
- o modo remoto continuará disponível para futura configuração.

## Escopo da primeira entrega

1. Cadastro fictício;
2. login fictício;
3. logout;
4. proteção local das rotas;
5. portfólio inicial com cinco serviços;
6. listagem e criação de discovery;
7. chat demonstrativo com respostas determinísticas;
8. persistência após atualizar a página;
9. limpeza dos dados locais.

## Fora de escopo inicial

- chamadas reais de IA;
- sincronização entre navegadores;
- RLS;
- recuperação de senha;
- Google OAuth;
- MCP;
- colaboração;
- segurança adequada para produção;
- geração real de artefatos.

## Arquivos previstos

- `src/lib/demo-mode/auth.ts`;
- `src/lib/demo-mode/store.ts`;
- `src/lib/demo-mode/replies.ts`;
- `src/routes/auth.tsx`;
- `src/routes/_authenticated/route.tsx`;
- `src/components/AppShell.tsx`;
- `src/routes/_authenticated/app.tsx`;
- `src/routes/_authenticated/c.$conversationId.tsx`;
- componentes que precisarem indicar recursos indisponíveis;
- testes unitários;
- documentação e roteiro de demonstração.

## Critérios de aceite

### Autenticação fictícia

- [x] Usuário cria conta fictícia sem rede.
- [x] Senha não é salva em texto puro.
- [x] Usuário entra novamente após logout.
- [x] Sessão sobrevive à atualização da página.
- [x] E-mail não cadastrado ou senha incorreta produzem mensagem clara.
- [x] Rotas protegidas redirecionam quando não existe sessão demo.

### Experiência

- [x] Interface identifica claramente `MODO DEMO`.
- [x] Página inicial carrega sem chamadas autenticadas ao Supabase.
- [x] Cinco serviços aparecem no portfólio inicial.
- [x] Usuário cria e abre um discovery local.
- [x] Chat aceita mensagens e gera resposta simulada identificada.
- [x] Dados persistem após atualização.
- [x] Logout retorna para autenticação.

### Qualidade

- [x] Testes unitários passam.
- [x] Typecheck passa.
- [x] Lint focado passa.
- [x] Build passa.
- [x] Nenhum segredo é adicionado.

## Testes necessários

- hash e verificação de senha;
- cadastro duplicado;
- login correto e incorreto;
- criação, leitura e exclusão de sessão;
- seed idempotente de portfólio;
- criação e leitura de discovery;
- persistência de mensagens;
- isolamento entre duas contas fictícias;
- fallback quando `localStorage` está indisponível.

## Critério de pronto

A primeira entrega estará pronta quando for possível abrir o navegador anônimo,
criar uma conta fictícia, iniciar um discovery, enviar mensagens simuladas,
atualizar a página sem perder dados e sair, sem qualquer chamada obrigatória ao
Supabase.
