# Engineering Plan

## Objetivo da estabilização

Tornar o Gym.AI reproduzível, seguro, testado, documentado e adequado para
demonstração e portfólio, sem reconstruir o produto.

## Ordem de execução

1. Proteger segredos e documentar o ambiente;
2. Estabilizar autenticação;
3. Criar os primeiros testes e quality gates;
4. Tratar erros das funções e do gateway de IA;
5. Fortalecer schema e RLS;
6. Validar UX, acessibilidade, MCP e release.

## Regra de pronto

Uma tarefa só pode ser marcada como concluída quando sua especificação, mudança,
testes executados e resultados estiverem registrados.

## Tarefa ativa

`AUTH-001` — estabilização do cadastro e login.

Especificação: [specs/auth-stabilization.md](specs/auth-stabilization.md).
