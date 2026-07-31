# AUTH-001 — Authentication Stabilization

## Status

Em implementação — política simplificada de portfólio aprovada; configuração
remota e Google OAuth pendentes.

## Objetivo

Garantir que cadastro, confirmação de e-mail, login por senha e Google OAuth
tenham estados corretos, mensagens claras e comportamento verificável no
ambiente local e no ambiente publicado.

## Problema

O cadastro por e-mail retorna sucesso, mas a interface informa que o usuário já
pode entrar sem verificar se uma sessão foi criada. Como o Supabase exige
confirmação de e-mail, a tentativa seguinte pode retornar `Invalid login
credentials`.

Google está habilitado no Supabase, mas o fluxo gerenciado pela Lovable não
completa o login em `localhost`.

## Evidências

1. Em `src/routes/auth.tsx`, o resultado de `signUp()` ignora `data.user` e
   `data.session`.
2. Após qualquer cadastro sem erro, a aplicação mostra `Conta criada. Você já
pode entrar.`.
3. A configuração pública do Supabase apresenta:

```text
email: true
google: true
disable_signup: false
mailer_autoconfirm: false
```

4. O fluxo Google usa `@lovable.dev/cloud-auth-js`, com callback montado a
   partir de `window.location.origin`.

## Impacto

- usuário interpreta um cadastro pendente como conta pronta;
- erro técnico em inglês não explica a confirmação necessária;
- repetição de cadastro e tentativas de login geram frustração;
- demonstração do produto fica bloqueada;
- não há evidência de que OAuth funciona nos ambientes suportados.

## Decisões

### D1 — Interpretar o resultado do cadastro

- Se `signUp()` devolver uma sessão, autenticar e redirecionar.
- Se devolver usuário sem sessão, mostrar estado de confirmação pendente.
- Não afirmar que o usuário já pode entrar sem evidência de uma sessão.

### D2 — Tornar a confirmação acionável

- Exibir o endereço para o qual a confirmação foi solicitada;
- oferecer reenvio do e-mail;
- permitir voltar ao formulário de login;
- evitar revelar se uma conta existe além do comportamento padrão do Supabase.

### D3 — Tratar erros por intenção

A interface deve mapear erros conhecidos para mensagens úteis em português e
manter um fallback seguro para erros não reconhecidos.

### D4 — Validar OAuth por ambiente

O erro real do fluxo Google deve ser capturado antes de trocar a integração.
Callbacks autorizados no Supabase/Lovable devem incluir os ambientes
documentados. Se o OAuth gerenciado não suportar localhost, essa limitação deve
ser explícita e o login por e-mail deve permanecer utilizável localmente.

### D5 — Manter redirecionamento seguro

Somente caminhos relativos da mesma origem podem ser usados como destino após
login.

### D6 — Política temporária de portfólio

Enquanto o projeto for usado somente para entrega e portfólio, a confirmação de
e-mail ficará desabilitada no Supabase. O cadastro deve criar uma sessão
imediatamente. A interface não terá confirmação nem reenvio.

Esta decisão não se aplica automaticamente a um futuro uso produtivo. Antes de
produção, a política deve ser reavaliada.

### D7 — Ocultar Google até configurar o provedor

O OAuth gerenciado da Lovable retorna 404 localmente. O OAuth direto do
Supabase foi consultado e retornou `Unsupported provider: missing OAuth secret`.
Sem Client ID e Client Secret válidos, o botão será ocultado para não oferecer
um fluxo sabidamente quebrado.

Google será reativado em uma tarefa separada, depois da configuração externa e
de um teste ponta a ponta.

## Fora de escopo

- redefinição de senha;
- autenticação multifator;
- novos provedores OAuth;
- mudança de provedor de autenticação;
- reformulação visual completa da página;
- mudanças gerais de RLS.

## Arquivos previstos

- `src/routes/auth.tsx`;
- possível módulo novo em `src/lib/auth/` para mensagens e estados;
- testes do módulo e/ou da rota de autenticação;
- `.gitignore`;
- `.env.example`;
- `README.md`;
- `docs/testing.md`;
- `docs/sessions/2026-07-29-auth-stabilization.md`;
- possível configuração externa de URLs autorizadas no Supabase/Lovable.

## Critérios de aceite

### Cadastro

- [x] Cadastro com sessão redireciona para o destino seguro.
- [x] Cadastro sem sessão informa que a confirmação de e-mail é necessária.
- [x] A tela não diz “você já pode entrar” quando não existe sessão.
- [x] Usuário pode reenviar a confirmação sem recadastrar a conta.
- [x] Botões não permanecem bloqueados depois de erro.

### Login por senha

- [ ] Credenciais válidas e conta confirmada iniciam sessão em teste manual real.
- [x] Credenciais inválidas produzem mensagem clara em português.
- [x] Conta não confirmada recebe orientação de confirmação quando o backend
      permitir distinguir esse estado com segurança.
- [x] Redirecionamento não aceita URL externa.

### Google OAuth

- [x] Fluxo quebrado não é oferecido ao usuário.
- [x] Bloqueio externo está documentado.
- [ ] Client ID e Client Secret são configurados.
- [ ] Ambiente publicado completa o fluxo e restaura a sessão.

### Segurança e qualidade

- [x] `.env` está ignorado.
- [x] `.env.example` não contém segredos.
- [ ] Segredos não aparecem no bundle do cliente nem nos logs.
- [x] Testes automatizados cobrem os estados principais.
- [x] Typecheck passa.
- [x] Build passa.
- [x] Resultado do lint nos arquivos alterados não piora.

## Cenários de teste

### AUTH-E01 — Cadastro aguardando confirmação

**Dado** um e-mail novo e confirmação obrigatória  
**Quando** o usuário cria a conta  
**Então** vê a instrução para confirmar o e-mail e não é redirecionado como
autenticado.

### AUTH-E02 — Cadastro com sessão

**Dado** um ambiente com confirmação automática  
**Quando** o cadastro retorna uma sessão  
**Então** o usuário é redirecionado ao destino seguro.

### AUTH-E03 — Login confirmado

**Dado** um usuário confirmado  
**Quando** informa credenciais válidas  
**Então** uma sessão é criada e a área autenticada abre.

### AUTH-E04 — Credenciais inválidas

**Dado** e-mail ou senha inválidos  
**Quando** tenta entrar  
**Então** recebe mensagem em português sem detalhes sensíveis.

### AUTH-E05 — Reenvio

**Dado** um cadastro pendente  
**Quando** solicita reenvio  
**Então** o Supabase recebe `resend({ type: "signup" })` e a interface confirma
a solicitação sem expor existência da conta.

### AUTH-E06 — Redirecionamento externo

**Dado** `next=https://example.com` ou `next=//example.com`  
**Quando** o fluxo termina  
**Então** o destino usado é `/app`.

### AUTH-E07 — Google OAuth

**Dado** um ambiente com callback autorizado  
**Quando** o usuário escolhe Google  
**Então** conclui o provedor, restaura a sessão e retorna ao destino seguro.

## Estratégia de implementação

1. Proteger os arquivos de ambiente;
2. extrair interpretação e tradução de estados para funções testáveis;
3. ajustar cadastro e login sem redesenhar a página;
4. adicionar estado de confirmação e reenvio;
5. capturar o erro concreto do Google OAuth;
6. configurar ou documentar callbacks por ambiente;
7. executar testes, typecheck, lint focado e build;
8. registrar resultados e limitações.

## Critério de pronto

AUTH-001 estará pronta quando todos os critérios aplicáveis estiverem
verificados, as limitações externas estiverem documentadas e houver evidência
de pelo menos um login real confirmado, além dos testes automatizados.
