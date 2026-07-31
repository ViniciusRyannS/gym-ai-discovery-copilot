# Sessão — Bootstrap do repositório GitHub

## Problema

O workspace local não possui metadados Git. Mudanças de estabilização não têm
histórico, backup remoto ou rastreabilidade.

## Evidência

- `git rev-parse --show-toplevel` retorna que a pasta não é um repositório;
- `README.md` não existia;
- o repositório remoto vazio foi criado por Vinicius Ryann.

## Impacto

Há risco de perda de alterações e não existe uma narrativa verificável da
evolução pós-entrega.

## Decisão

- criar um repositório Git local com branch `main`;
- usar o remote
  `https://github.com/ViniciusRyannS/gym-ai-discovery-copilot.git`;
- preservar autoria coletiva no README;
- documentar a continuidade pós-entrega;
- manter `.env` e artefatos de build fora do histórico;
- manter o repositório privado até concluir a revisão de publicação;
- não definir licença aberta sem decisão sobre direitos de distribuição.

## Critérios de aceite

- repositório inicializado;
- remote `origin` correto;
- nenhum `.env`, segredo, `node_modules` ou build rastreado;
- README e origem documentados;
- primeiro commit criado;
- push da branch `main` confirmado.

