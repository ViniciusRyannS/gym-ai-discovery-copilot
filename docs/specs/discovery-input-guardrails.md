# Spec — Guardrails de entrada e fatos fundamentados

## Problema

O orquestrador remoto aceita qualquer string não vazia. Testes manuais mostraram
que entradas como `a`, `aaa` e `te4ste` podem ser tratadas como respostas
válidas; em um caso, o modelo afirmou ter compreendido “retrabalho” sem essa
informação existir na mensagem.

## Evidência

- o input de `sendMessage` usa apenas `z.string().min(1)`;
- resposta `a` produziu a afirmação “Compreendido o problema de retrabalho”;
- fatos e deltas de cobertura são produzidos pela mesma chamada que escreve a
  resposta;
- fatos são concatenados sem exigir evidência da mensagem.

## Impacto

Informação inventada pode contaminar fatos, cobertura, Entendimento Executivo e
artefatos, reduzindo a confiança no produto.

## Decisão

1. Classificar localmente saudações e ruído inequívoco antes de chamar a IA.
2. Responder de forma orientativa sem alterar fatos ou cobertura nesses casos.
3. Não bloquear respostas curtas potencialmente válidas, como `CFO`, `AWS`,
   `sim` ou um número.
4. Exigir que cada fato gerado contenha um trecho de evidência copiado da última
   mensagem.
5. Descartar fatos cuja evidência não exista na mensagem.
6. Aplicar deltas de cobertura somente a categorias com fatos fundamentados
   naquele turno.
7. Manter a mensagem e a resposta de recuperação no histórico.

## Arquivos envolvidos

- `src/lib/discovery-input.ts`
- `src/lib/discovery-input.test.ts`
- `src/lib/conversations.functions.ts`
- `src/lib/discovery-defaults.ts`
- `docs/release-checklist.md`
- `docs/task-board.md`
- `docs/testing.md`

## Critérios de aceite

- `oi`, `olá` e equivalentes recebem orientação sem chamada de IA;
- `a`, `aaa`, `teste`, `te4ste`, símbolos ou texto repetitivo recebem pedido de
  reformulação;
- entradas curtas plausíveis continuam no fluxo normal;
- turnos insuficientes não criam fatos ou cobertura;
- fatos sem evidência literal são descartados;
- cobertura só muda em categorias com fatos fundamentados;
- testes unitários, typecheck, lint focado e build passam.
