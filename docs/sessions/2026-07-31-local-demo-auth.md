# Sessão — Login e dados locais para demonstração

## Problema

O login real depende de uma conta confirmada no Supabase. Aceitar credenciais
fictícias somente na tela de autenticação não resolve a apresentação, pois as
rotas internas chamam funções protegidas por token e RLS.

## Evidência

- `src/routes/auth.tsx` envia todas as credenciais para `signInWithPassword`;
- `src/routes/_authenticated/route.tsx` exige `supabase.auth.getUser()`;
- AppShell, início e conversa usam server functions protegidas;
- `teste@email.com` não é uma conta criada ou confirmada no Supabase.

## Impacto

O projeto pode ser apresentado apenas pela rota pública, mas o recrutador não
consegue navegar pela experiência completa de criação e condução de discovery.

## Decisão

Implementar a primeira entrega do modo local:

1. conta demonstrativa pré-carregada;
2. cadastro e login locais com senha representada por hash Web Crypto;
3. sessão persistente no navegador;
4. guardas de rota compatíveis com sessão demo;
5. portfólio e discoveries em `localStorage`;
6. resposta de chat determinística e cobertura progressiva;
7. indicador persistente de modo demo;
8. logout sem chamada obrigatória ao Supabase.

## Credenciais da conta inicial

```text
teste@email.com
teste123456
```

Os dados são fictícios e existem somente no navegador em que a conta for usada.

## Arquivos envolvidos

- `src/lib/demo-mode/auth.ts`
- `src/lib/demo-mode/store.ts`
- `src/lib/demo-mode/replies.ts`
- `src/routes/auth.tsx`
- `src/routes/_authenticated/route.tsx`
- `src/components/AppShell.tsx`
- `src/routes/_authenticated/app.tsx`
- `src/routes/_authenticated/c.$conversationId.tsx`

## Critérios de aceite da entrega

- credenciais iniciais entram sem Supabase;
- cadastro local cria uma sessão imediatamente;
- atualizar a página mantém a sessão;
- início carrega portfólio e discoveries sem chamada remota;
- criar discovery e enviar mensagens funcionam localmente;
- logout encerra a sessão local;
- interface identifica claramente o modo demo;
- typecheck, testes e build passam.

## Alterações realizadas

- autenticação local com conta pré-carregada e cadastro fictício;
- hash SHA-256 via Web Crypto antes de persistir a senha;
- sessão e dados isolados por e-mail em `localStorage`;
- guarda das rotas autenticadas compatível com sessão local;
- cinco serviços iniciais, CRUD de portfólio e criação de discovery;
- chat determinístico com cobertura progressiva;
- indicador `DEMO` no shell e aviso no início;
- Prompt Studio oculto no modo local;
- Entendimento e Artefatos direcionados à demonstração pública, pois a geração
  local completa permanece fora desta entrega.

## Evidências

- `npm run typecheck`: aprovado;
- `npm test`: 12 testes aprovados;
- ESLint focado nos arquivos modificados: aprovado;
- `npm run build`: aprovado;
- nenhuma credencial real ou segredo foi adicionado.

## Validação manual pendente

Abrir `/auth`, selecionar `Demonstração`, preencher a conta pronta, entrar,
criar um discovery, enviar uma mensagem, atualizar a página e sair.
