# ADR-0001 — Tratar confirmação de e-mail como estado explícito

## Status

Aceita para implementação.

## Contexto

O Supabase está configurado com `mailer_autoconfirm: false`. O cadastro pode
criar o usuário sem criar uma sessão, mas a interface atual trata todo cadastro
sem erro como conta pronta para login.

## Decisão

O frontend interpretará `data.session` retornado por `signUp()`:

- com sessão: login concluído e redirecionamento;
- sem sessão: estado explícito de confirmação pendente.

O usuário poderá solicitar reenvio da confirmação.

## Consequências

- mensagens ficam coerentes com a configuração real;
- o fluxo exige um estado adicional na página;
- testes devem cobrir ambientes com e sem confirmação automática;
- entrega de e-mail continua dependente da configuração externa do Supabase.
