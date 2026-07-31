# Spec — Atualização do manual do sistema

## Problema

O manual existente contém funcionalidades e arquitetura que não correspondem ao
estado atual, incluindo pipeline de cinco agentes, Google OAuth disponível e
artefatos versionados/exportáveis. Ele também não documenta o modo local.

## Evidência

- o fluxo remoto usa uma chamada estruturada, não cinco agentes independentes;
- Google OAuth permanece sem configuração validada;
- o modo local agora cobre login, portfólio, discovery, chat, entendimento e
  artefatos;
- a rota e a documentação podem divergir porque o conteúdo estava embutido no
  componente.

## Impacto

Uma apresentação baseada no manual pode transmitir capacidades inexistentes e
reduzir a credibilidade técnica do projeto.

## Decisão

- criar um manual Markdown canônico em `docs/manual-do-sistema.md`;
- renderizar o mesmo arquivo na rota `/manual`;
- separar claramente modo local e ambiente conectado;
- listar limitações reais;
- preservar créditos coletivos;
- declarar o produto como MVP funcional demonstrável, não como release
  produtiva.

## Critérios de aceite

- descrição do sistema;
- principais funcionalidades;
- seção do que ainda não funciona;
- próximos passos e evoluções;
- grupo e integrantes;
- aviso humano no loop;
- conteúdo único entre repositório e aplicação;
- typecheck, lint focado e build aprovados.
