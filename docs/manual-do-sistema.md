# Manual do Sistema — Gym.AI

> Copiloto de discovery técnico-comercial para pré-vendas.
>
> **Status:** MVP funcional demonstrável, em estabilização para portfólio.

## 1. Descrição do sistema

O **Gym.AI** auxilia profissionais de pré-vendas a transformar briefings
incompletos em um discovery estruturado, rastreável e mais consistente.

O sistema organiza a conversa em dez categorias:

1. contexto de negócio;
2. ambiente atual;
3. escopo técnico;
4. operação e sustentação;
5. segurança e conformidade;
6. volumetria e capacidade;
7. criticidade;
8. governança;
9. premissas e exclusões;
10. riscos e validações.

Durante o discovery, o Gym.AI conduz perguntas, registra o histórico e apresenta
uma estimativa de cobertura. A partir do contexto disponível, pode consolidar
um Entendimento Executivo e produzir rascunhos de PRD, ADR, Spec e User Stories.

O produto funciona como apoio à decisão. Cobertura, diagnósticos e documentos
não substituem revisão técnica, comercial, jurídica ou de segurança.

### Modos disponíveis

**Modo de demonstração local**

- não exige Supabase, Lovable ou chave de IA;
- utiliza conta e dados fictícios armazenados no navegador;
- possui chat e cobertura determinísticos;
- gera Entendimento e artefatos por templates locais;
- é indicado para avaliação rápida e apresentação de portfólio.

**Ambiente conectado**

- utiliza Supabase para autenticação, banco e RLS;
- utiliza Lovable AI Gateway para geração por modelos Gemini;
- inclui Prompt Studio, persistência remota e endpoint MCP;
- ainda depende de configuração e validação externa antes de ser apresentado
  como ambiente produtivo.

## 2. Principais funcionalidades

### Demonstração pública

A rota `/demo` apresenta uma narrativa guiada sem login: briefing incompleto,
perguntas, evolução da cobertura, Entendimento Executivo e artefatos.

### Login e cadastro demonstrativos

Na opção **Demonstração**, o usuário pode entrar com uma conta fictícia pronta
ou criar uma nova conta local. Senhas são representadas por hash Web Crypto e
os dados permanecem no navegador.

Credenciais iniciais:

```text
E-mail: teste@email.com
Senha:  teste123456
```

### Portfólio de serviços

Catálogo de serviços usado como ponto de partida do discovery. No modo local,
permite listar, adicionar, ativar, desativar e remover serviços.

### Novo discovery

Formulário com serviço, título e briefing. Campos longos aceitam anexos `.txt`
e `.md`.

### Chat guiado

Conduz a conversa por categorias e mantém o histórico. Saudações e entradas
inequivocamente sem informação recebem orientação sem aumentar a cobertura.

No ambiente conectado, fatos extraídos precisam indicar evidência literal da
mensagem do usuário.

### Cockpit de Cobertura

Radar com as dez categorias e percentual consolidado. A cobertura é uma
estimativa de completude do levantamento, não uma garantia de qualidade.

### Entendimento Executivo

Consolida:

- síntese;
- diagnóstico;
- informações faltantes;
- riscos;
- premissas;
- próximos passos;
- complexidade.

No modo local, o conteúdo é produzido por template determinístico e versionado
no navegador.

### Artefatos

Gera rascunhos em Markdown:

- PRD;
- ADR;
- Spec técnica;
- User Stories.

No modo local, os artefatos usam briefing, respostas e cobertura disponíveis e
podem ser visualizados e copiados.

### Recursos do ambiente conectado

- autenticação Supabase;
- histórico remoto protegido por RLS;
- geração com Lovable AI Gateway;
- Prompt Studio com versões;
- jornadas demonstrativas persistidas;
- Command Palette;
- endpoint MCP com OAuth.

Esses recursos não são necessários para a demonstração local e possuem
validações pendentes descritas abaixo.

## 3. O que ainda não está funcionando ou validado

### Acesso público

- ainda não existe uma URL independente publicada para recrutadores;
- atualmente o projeto precisa ser executado localmente.

### Ambiente conectado

- login real confirmado não foi validado ponta a ponta nesta cópia;
- Google OAuth não possui configuração externa validada;
- geração remota após os novos guardrails ainda precisa de teste real;
- Entendimento e os quatro artefatos remotos precisam de nova validação;
- fallback e atomicidade quando o gateway falha ainda serão implementados;
- MCP não foi validado ponta a ponta.

### Segurança e banco

- RLS das tabelas filhas precisa validar também a propriedade da conversa;
- isolamento entre dois usuários reais ainda não possui teste automatizado;
- constraints de versões e tipos precisam ser fortalecidas;
- o uso de service role deve ser revisado antes de produção.

### Qualidade e engenharia

- não existe suíte automatizada end-to-end;
- o lint global possui dívida técnica preexistente;
- CI ainda não foi configurada;
- avisos de APIs depreciadas do TanStack Start permanecem no build;
- o pipeline remoto é uma chamada estruturada e não deve ser apresentado como
  cinco agentes independentes já validados.

### Funcionalidades de produto

- sem colaboração multiusuário ou papéis;
- sem integração com CRM;
- sem streaming token a token;
- sem upload de PDF, DOCX, planilhas, imagens ou áudio;
- sem exportação nativa para PDF, DOCX ou PPTX;
- sem dashboard de métricas de uso e qualidade;
- sem base de conhecimento do cliente com RAG.

## 4. Próximos passos e evoluções

### Prioridade imediata — apresentação

1. Publicar o modo local em uma URL independente.
2. Executar teste visual em desktop e mobile.
3. Adicionar screenshots e vídeo curto ao repositório.
4. Configurar CI para typecheck, testes e build.
5. Revisar README, autoria e segredos antes de tornar o repositório público.

### Estabilização técnica

1. Implementar fallback e atomicidade do gateway.
2. Fortalecer RLS e constraints do banco.
3. Validar login, mensagem, entendimento e artefatos no ambiente conectado.
4. Criar testes end-to-end das jornadas críticas.
5. Corrigir o baseline de lint e APIs depreciadas.
6. Validar o MCP com OAuth ponta a ponta.

### Evoluções de produto

1. revisão e aprovação humana de fatos;
2. colaboração por times e modo revisor;
3. templates por indústria e tipo de serviço;
4. exportação PDF, DOCX e PPTX com branding;
5. ingestão de documentos e base de conhecimento;
6. integrações com CRM;
7. streaming e transcrição de reuniões;
8. métricas de qualidade, tempo de discovery e conversão.

## 5. Grupo e integrantes

**Grupo: Gym.IA**

- Vinicius Ryann;
- Carlos Andrade;
- Eduarda Coelho;
- Fábio;
- Kaiky Gomes.

O MVP acadêmico foi desenvolvido coletivamente pelo grupo. A etapa pós-entrega
de estabilização, testes, documentação e preparação para portfólio é conduzida
por Vinicius Ryann, sem alterar os créditos da autoria original.

## 6. Conclusão

O Gym.AI pode ser apresentado como **MVP funcional demonstrável** porque já
permite percorrer localmente a jornada principal: entrar, configurar portfólio,
criar discovery, conversar, acompanhar cobertura, gerar entendimento e produzir
artefatos.

Ele ainda não deve ser apresentado como produto pronto para produção. Segurança
remota, integrações, disponibilidade, observabilidade e testes ponta a ponta
permanecem em estabilização.
