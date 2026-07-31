# Sessão — Entregáveis locais para portfólio

## Objetivo

Completar a jornada principal do Gym.AI no modo local para que recrutadores
possam testar o produto sem Lovable, Supabase ou chaves de IA.

## Estratégia

- geração determinística e auditável;
- reutilização dos dados já persistidos no navegador;
- separação visual entre saída simulada e saída conectada;
- preservação do aviso humano no loop.

## Critério de pronto

Discovery local deve gerar Entendimento Executivo e PRD, ADR, Spec e User
Stories, persistindo os resultados após atualização.

## Alterações

- gerador local de Entendimento Executivo com versões;
- geradores de PRD, ADR, Spec e User Stories em Markdown;
- painéis locais acessíveis pelos botões originais do chat;
- conteúdo derivado do briefing, respostas e cobertura;
- persistência por conta fictícia no navegador;
- avisos de simulação determinística e revisão humana;
- ruído e saudações não avançam a cobertura no chat local.

## Evidências

```text
npm run typecheck
Passou

npm test
23 testes, 23 passaram, 0 falharam

npm exec eslint -- <arquivos DEMO-003>
Passou

npm run build
Passou
```

## Próxima ação

Preparar uma publicação independente para que o avaliador acesse o modo local
por URL, sem instalar o projeto ou configurar Supabase.
