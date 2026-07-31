# Testing

## Quality gate

| Verificação     | Estado inicial                    |
| --------------- | --------------------------------- |
| Install         | Passou                            |
| Dev server      | Passou                            |
| Lint            | Falhou: 733 erros e 6 avisos      |
| Typecheck       | Passou após correção dos redirects |
| Test            | 7 testes de autenticação passando |
| Build           | Passou                            |
| Login por senha | Falha de UX/estado de confirmação |
| Google OAuth    | Não validado localmente           |
| RLS isolation   | Não validado                      |
| MCP             | Não validado ponta a ponta        |

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
