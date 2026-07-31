# Spec — Entendimento e artefatos no modo local

## Problema

O modo local permite login, portfólio, discovery e chat, mas os botões
`Entendimento` e `Artefatos` apenas direcionam o usuário à rota pública. Isso
interrompe a principal jornada que recrutadores e avaliadores precisam testar
sem acesso ao Lovable/Supabase.

## Evidência

- o modo local oculta os painéis conectados;
- os botões exibem apenas um aviso apontando para `/demo`;
- Entendimentos e artefatos dependem de server functions autenticadas;
- o objetivo de portfólio exige uma experiência mínima executável sem
  credenciais externas.

## Impacto

O avaliador consegue conversar, mas não comprova a transformação do discovery
em uma saída executiva e documentos acionáveis.

## Decisão

Implementar geradores locais determinísticos e explicitamente identificados:

1. Entendimento Executivo derivado do briefing, mensagens e cobertura;
2. PRD, ADR, Spec e User Stories em Markdown;
3. persistência por conta fictícia no `localStorage`;
4. visualização nos mesmos pontos de entrada da experiência conectada;
5. aviso permanente de conteúdo simulado e necessidade de revisão humana;
6. nenhuma chamada de rede, Supabase ou IA no modo local.

Os geradores não alegarão raciocínio de IA real. Eles produzirão templates
coerentes com os dados disponíveis e marcarão lacunas como pendências.

## Arquivos envolvidos

- `src/lib/demo-mode/store.ts`
- `src/lib/demo-mode/deliverables.ts`
- `src/lib/demo-mode/deliverables.test.ts`
- `src/components/demo/LocalUnderstandingDrawer.tsx`
- `src/components/demo/LocalArtifactsPanel.tsx`
- `src/routes/_authenticated/c.$conversationId.tsx`
- documentação da sprint

## Critérios de aceite

- gerar e abrir Entendimento Executivo no discovery local;
- gerar os quatro tipos de artefato;
- conteúdo usar briefing e respostas reais do usuário local;
- lacunas permanecerem explícitas;
- conteúdo persistir após atualizar a página;
- painéis indicarem modo simulado e revisão humana;
- nenhuma chamada remota ser necessária;
- testes, typecheck, lint focado e build passarem.
