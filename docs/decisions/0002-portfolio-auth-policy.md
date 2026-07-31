# ADR-0002 — Simplificar autenticação no estágio de portfólio

## Status

Aceita para implementação.

## Contexto

O Gym.AI está em fase de entrega e portfólio, sem uso produtivo real. A entrega
de e-mails do Supabase não está funcionando e a confirmação bloqueia o acesso
ao restante do produto. O Google OAuth gerenciado pela Lovable retorna 404 em
localhost.

## Decisão

- Desabilitar `Confirm email` na configuração remota do Supabase;
- após o cadastro, exigir que o Supabase devolva uma sessão e abrir o app;
- remover da interface o estado de confirmação e o reenvio;
- ocultar temporariamente Google até o provedor ter credenciais válidas;
- manter mensagens seguras caso a configuração remota não corresponda à
  política definida.

## Consequências

- o fluxo fica adequado para demonstração e avaliação;
- contas novas entram imediatamente;
- a segurança é menor do que a recomendada para produção;
- antes de uso real, confirmação de e-mail, recuperação de senha, rate limiting
  e políticas de acesso devem ser reavaliados;
- a alteração de `Confirm email` precisa ser realizada no dashboard remoto e
  não pode ser feita com a chave pública do frontend.
- Google exige Client ID e Client Secret externos; o teste do endpoint retornou
  `Unsupported provider: missing OAuth secret`.
