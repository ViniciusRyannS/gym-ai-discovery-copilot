# ADR-0003 — Modo Demo local sem backend externo

## Status

Aceita para implementação.

## Contexto

A cópia do projeto não possui acesso administrativo ao Supabase remoto, Google
OAuth está incompleto e Docker não está instalado para executar Supabase local.

## Decisão

Adicionar uma execução local explícita, baseada em armazenamento do navegador,
para demonstrar o fluxo essencial. O modo demo não fingirá ser autenticação
segura nem persistência real.

## Consequências

- o portfólio pode ser avaliado sem contas externas;
- parte da camada de dados precisará de um adaptador local;
- IA, RLS e MCP não serão validados por esse modo;
- a interface deve diferenciar saídas simuladas;
- o backend Supabase permanece como arquitetura-alvo para uma publicação real.
