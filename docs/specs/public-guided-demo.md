# Spec — Demonstração pública guiada

## Problema

O Gym.AI possui jornadas de demonstração autenticadas, mas ainda não oferece uma rota pública que explique, sem configuração prévia, como um briefing incompleto se transforma em descoberta estruturada e artefatos.

## Evidência

- A rota `/` redireciona diretamente para `/app`.
- O modo demo existente depende de autenticação e persistência no Supabase.
- `docs/demo-script.md` exige usuário confirmado e dados previamente carregados.

## Impacto

Recrutadores, avaliadores e potenciais usuários não conseguem compreender rapidamente a proposta de valor sem criar conta. Isso enfraquece a apresentação do produto e aumenta o risco de uma demonstração ao vivo falhar por dependências externas.

## Decisão

Criar a rota pública `/demo` como narrativa interativa autocontida, usando dados simulados e nenhuma chamada externa. A experiência deve:

1. expor o problema de um briefing incompleto;
2. apresentar perguntas contextualizadas do Gym.AI;
3. tornar visível a evolução da cobertura nas 10 categorias;
4. apresentar um Entendimento Executivo;
5. mostrar PRD, ADR, Spec e User Stories como saídas;
6. preservar o aviso de revisão humana;
7. oferecer acesso à aplicação real sem exigir login para concluir a demo.

## Arquivos envolvidos

- `src/routes/demo.tsx`
- `docs/specs/public-guided-demo.md`
- `docs/demo-script.md`
- `docs/task-board.md`
- `docs/sessions/2026-07-30-public-demo.md`

## Critérios de aceite

- `/demo` é acessível sem sessão.
- A narrativa possui cinco etapas navegáveis e indicação clara de progresso.
- O briefing demonstra visualmente fatos presentes e lacunas.
- A cobertura contempla as 10 categorias e muda conforme a etapa.
- Entendimento Executivo e quatro tipos de artefato possuem preview legível.
- A página funciona em viewport móvel e desktop.
- A página identifica o conteúdo como demonstração simulada e mantém humano no loop.
- `lint`, `typecheck`, `test` e `build` não apresentam regressões causadas pela rota.

## Testes necessários

- Validar geração da rota pelo TanStack Router.
- Executar `npm run lint`.
- Executar `npm run typecheck`.
- Executar `npm test`.
- Executar `npm run build`.
- Inspecionar a renderização de `/demo` em desktop e mobile quando houver navegador disponível.
