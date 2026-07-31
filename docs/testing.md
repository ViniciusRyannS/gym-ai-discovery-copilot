# Testing

## Quality gate

| Verificação     | Estado inicial                     |
| --------------- | ---------------------------------- |
| Install         | Passou                             |
| Dev server      | Passou                             |
| Lint            | Falhou: 733 erros e 6 avisos       |
| Typecheck       | Passou após correção dos redirects |
| Test            | 7 testes de autenticação passando  |
| Build           | Passou                             |
| Login por senha | Falha de UX/estado de confirmação  |
| Google OAuth    | Não validado localmente            |
| RLS isolation   | Não validado                       |
| MCP             | Não validado ponta a ponta         |

## Evidência da autenticação

Configuração pública consultada no Supabase em 2026-07-29:

```text
email: true
google: true
disable_signup: false
mailer_autoconfirm: false
```

Nenhuma credencial ou segredo foi registrado.

## Testes previstos para AUTH-001

- cadastro que exige confirmação;
- cadastro que devolve sessão imediata;
- credenciais inválidas;
- e-mail não confirmado;
- reenvio de confirmação;
- redirecionamento seguro após login;
- erro e sucesso no Google OAuth;
- restauração e encerramento da sessão.

## Execução de 2026-07-29 — AUTH-001

```text
npm.cmd test
7 testes, 7 passaram, 0 falharam
```

```text
npm.cmd run typecheck
Passou
```

```text
npm.cmd exec eslint -- <arquivos alterados>
Passou
```

```text
npm.cmd run build
Passou
```

O lint global continua com dívida preexistente e não foi declarado como
resolvido.

## Execução de 2026-07-29 — política de portfólio

```text
test: 8 passaram, 0 falharam
typecheck: passou
lint focado: passou
build: passou
dev server: http://localhost:8080
```

OAuth direto do Supabase foi consultado sem expor credenciais:

```text
HTTP 400
Unsupported provider: missing OAuth secret
```

Decisão: ocultar Google até a configuração externa ser concluída.

## Execução de 2026-07-31 — AI-001

```text
npm run typecheck
Passou

npm test
18 testes, 18 passaram, 0 falharam

npm exec eslint -- <arquivos AI-001>
Passou

npm run build
Passou
```

Casos adicionados: saudações, ruído, mensagens de teste, respostas curtas
plausíveis, resposta de recuperação e validação de evidência literal.

## Execução de 2026-07-31 — DEMO-003

```text
npm run typecheck
Passou

npm test
23 testes, 23 passaram, 0 falharam

npm exec eslint -- <arquivos DEMO-003>
Passou

npm run build
Passou
```

Casos adicionados: Entendimento local, quatro tipos de artefato, aviso de
revisão, uso de evidências locais, deduplicação de tipos solicitados e
recuperação de ruído sem avanço de cobertura.

## Execução de 2026-07-31 — PORT-001

```text
npm run typecheck
Passou

npm test
23 testes, 23 passaram, 0 falharam

npm exec -- eslint src/routes/__root.tsx
Passou

npm run build sem .env
Passou; o arquivo local foi restaurado automaticamente
```

Smoke test do deployment com Playwright Core temporário e Microsoft Edge:

```text
GET /demo: 200
refresh/deep link /demo: 200
desktop 1366x768: jornada aprovada, sem overflow do documento
mobile 390x844: jornada aprovada, sem overflow do documento
login solicitado: não
requisições Supabase: 0
requisições Lovable AI Gateway: 0
retorno ao briefing inicial: aprovado
```

O Playwright Core foi usado somente como ferramenta temporária de validação e
não foi adicionado às dependências nesta tarefa.

## Execução de 2026-07-31 — DEMO-004

```text
npm ci
Passou após encerrar somente o servidor Vite que mantinha um binário bloqueado

npm run typecheck
Passou

npm test
25 testes, 25 passaram, 0 falharam

npm exec -- eslint <arquivos DEMO-004>
Passou

npm run build
Passou
```

Casos adicionados: criação da conversa completa, presença das dez categorias,
ordem de papéis, cobertura avançada, entendimento, quatro artefatos,
idempotência e continuidade da conversa.

Smoke do deployment:

```text
/auth: HTTP 200
/demo: HTTP 200
asset público contém “Abrir conversa exemplo”: sim
asset público contém o cenário de retrabalho: sim
asset público contém aviso sem envio externo: sim
```
