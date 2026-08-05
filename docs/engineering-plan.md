# Engineering Plan

## Objetivo da estabilização

Tornar o Gym.AI reproduzível, seguro, testado, documentado e adequado para
demonstração e portfólio, sem reconstruir o produto.

## Entregas concluídas

1. segredos protegidos e ambiente documentado;
2. autenticação demonstrativa local;
3. rota pública `/demo` publicada em HTTPS;
4. testes unitários, typecheck, lint e build;
5. CI no GitHub Actions;
6. manual, handoff técnico e guia para mentores.

## Regra de pronto

Uma tarefa só pode ser marcada como concluída quando sua especificação, mudança,
testes executados e resultados estiverem registrados.

## Prioridades atuais

1. concluir materiais visuais e publicação de portfólio;
2. fortalecer RLS e constraints do ambiente conectado;
3. implementar fallback e atomicidade do gateway remoto;
4. adicionar testes E2E das jornadas críticas;
5. validar acessibilidade, MCP e integrações remotas.

O modo demonstrativo publicado é o caminho recomendado para avaliação. O
ambiente conectado permanece uma arquitetura preservada, com validações
pendentes antes de qualquer alegação de produção.

Checklist consolidado: [release-checklist.md](release-checklist.md).
