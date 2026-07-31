# Sessão — manual do sistema e avaliação do MVP

**Data:** 31 de julho de 2026
**Tarefa:** DOC-003

## Objetivo

Criar um manual único, coerente com o código atual, e avaliar com transparência
se o Gym.AI já pode ser apresentado como MVP funcional.

## Alterações

- criado `docs/manual-do-sistema.md`;
- a rota autenticada `/manual` passou a renderizar o mesmo documento;
- separados explicitamente o modo local demonstrativo e o ambiente conectado;
- registradas funcionalidades, limitações, próximos passos, grupo e integrantes;
- removidas alegações não comprovadas sobre cinco agentes independentes, OAuth
  Google e recursos remotos;
- adicionado o manual ao índice do `README.md`.

## Decisão

O estado atual pode ser descrito como **MVP funcional demonstrável**: a proposta
central pode ser percorrida localmente sem serviços externos. O produto ainda
não deve ser descrito como pronto para produção, pois publicação independente,
testes ponta a ponta, CI, segurança e integrações remotas continuam pendentes.

## Evidências

Verificações automatizadas executadas:

- `npm run typecheck`: aprovado;
- `npm test`: 23 testes aprovados;
- `npm exec -- eslint src/routes/_authenticated/manual.tsx`: aprovado;
- `npm run build`: aprovado.

O build manteve avisos preexistentes de APIs depreciadas, tamanho de bundle e
configuração do Vite. Eles não bloquearam a geração, mas continuam registrados
como dívida técnica.
