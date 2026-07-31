# Sessão — Guardrails de entrada do discovery

## Objetivo

Impedir que saudações, ruído e mensagens de teste sejam convertidos em fatos,
cobertura ou afirmações inventadas no fluxo remoto.

## Implementação

- classificação determinística de saudações e ruído inequívoco;
- recuperação orientativa sem chamada ao gateway;
- preservação de respostas curtas plausíveis;
- campo obrigatório de evidência literal em cada fato gerado;
- descarte de fatos sem evidência na última mensagem;
- deltas de cobertura limitados às categorias com fatos fundamentados;
- verificação do erro ao persistir a mensagem do usuário;
- remoção do `any` usado no histórico enviado ao modelo.

## Evidências

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

O build mantém avisos preexistentes sobre `inputValidator`, tamanho de chunk e
configuração do Vite. Nenhum desses avisos foi introduzido por AI-001.

## Limitação

O guardrail determinístico cobre ruído inequívoco. Entradas linguisticamente
plausíveis, mas enganosas, ainda dependem do modelo. A evidência literal reduz
o risco de fatos inventados, mas não substitui validação humana nem testes
remotos ponta a ponta.

## Próxima ação

Implementar fallback do gateway e impedir persistência parcial do turno quando
a geração falhar.
