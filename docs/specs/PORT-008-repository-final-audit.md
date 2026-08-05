# PORT-008 — Auditoria final do repositório

## Problema

O repositório acumulou documentos de diferentes etapas, textos que descrevem
estados antigos e arquivos gerados que podem não participar do produto atual.
Isso dificulta a leitura por recrutadores e pode produzir afirmações
contraditórias.

## Objetivo

Preparar uma versão definitiva e verificável do repositório sem alterar o fluxo
remoto de IA, a demonstração publicada ou o histórico Git.

## Escopo

- inventariar arquivos versionados, dependências e referências;
- remover somente arquivos comprovadamente sem uso ou redundantes;
- atualizar documentos canônicos para o estado observado;
- preservar specs, decisões e sessões como histórico de engenharia;
- tornar README e navegação documental mais claros para portfólio;
- executar lint, typecheck, testes e build;
- validar a rota pública após a publicação.

## Fora de escopo

- reescrever a integração Supabase/Lovable;
- alterar prompts ou o comportamento da IA remota;
- declarar o ambiente conectado pronto para produção;
- reescrever histórico Git ou atribuir parceria institucional não confirmada.

## Critérios de aceite

- [x] nenhum arquivo removido possui referência ativa;
- [x] README descreve com clareza o que pode ser testado agora;
- [x] documentos canônicos não contradizem deploy, CI ou testes atuais;
- [x] FastAPI e OpenRouter não aparecem como arquitetura atual;
- [x] origem no Pulse Mais e desafio da Clear IT usam redação factual;
- [x] segredos e artefatos locais continuam fora do Git;
- [x] lint possui resultado honesto e reproduzível;
- [x] typecheck, testes e build passam;
- [x] CI e demonstração pública permanecem verdes.

## Rollback

Reverter a entrega por um novo commit. Não usar force push, rebase ou reescrita
de commits publicados.
