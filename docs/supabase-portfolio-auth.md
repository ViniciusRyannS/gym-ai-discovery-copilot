# Supabase Auth Setup — Portfolio

Esta configuração é temporária e destinada somente à demonstração e ao
portfólio do Gym.AI.

## Desabilitar confirmação de e-mail

No dashboard do projeto Supabase:

1. Abra **Authentication**;
2. acesse **Providers**;
3. abra o provedor **Email**;
4. desabilite **Confirm email**;
5. salve.

Depois da mudança, remova o usuário de teste não confirmado em
**Authentication > Users** e crie a conta novamente pelo Gym.AI. Contas criadas
antes da mudança podem continuar não confirmadas.

## URLs locais

Em **Authentication > URL Configuration**, adicione às Redirect URLs:

```text
http://localhost:8080/**
```

Use somente uma instância do Vite. Se `8080` estiver ocupada, encerre o processo
anterior antes de iniciar novamente.

## Google OAuth

Google está temporariamente oculto. O endpoint remoto informou:

```text
Unsupported provider: missing OAuth secret
```

Para reativar, será necessário configurar no provedor Google do Supabase:

- Google OAuth Client ID;
- Google OAuth Client Secret;
- callback indicado pelo próprio dashboard do Supabase;
- URLs de redirecionamento do app.

Nenhum desses segredos deve ser colocado em variável `VITE_*` ou versionado.
