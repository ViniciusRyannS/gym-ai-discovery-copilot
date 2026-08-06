# Gym.AI — Contexto completo para ChatGPT e outras IAs

> Documento de handoff para compreender, avaliar ou continuar o projeto sem
> depender do histórico completo das conversas anteriores.

## 1. Instruções para a IA leitora

Ao trabalhar com este projeto:

- não atribua o MVP exclusivamente a Vinicius Ryann;
- não apresente o modo determinístico como uma chamada real a um LLM;
- não diga que o ambiente conectado está pronto para produção;
- não invente resultados de testes, integrações ou segurança;
- não remova o aviso de revisão humana;
- preserve o histórico Git publicado, sem force push ou rebase destrutivo;
- use Spec-as-Code antes de alterações relevantes;
- diferencie fatos validados, hipóteses e próximos passos.

## 2. Resumo executivo

O **Gym.AI** é um copiloto de discovery técnico-comercial para pré-vendas. Seu
objetivo é ajudar profissionais a transformar briefings incompletos em um
levantamento estruturado, com perguntas relevantes, indicação visual de
cobertura, Entendimento Executivo e rascunhos de documentos.

O problema central é que solicitações comerciais frequentemente chegam com
pouco contexto. Quando perguntas importantes são esquecidas, o time técnico
precisa voltar ao cliente, a proposta atrasa e o risco de estimar uma solução
inadequada aumenta.

O Gym.AI não substitui consultores, arquitetos ou especialistas. Ele organiza o
processo e produz material para revisão humana.

## 3. Origem e autoria

O projeto nasceu como trabalho final do programa Pulse Mais e foi desenvolvido
coletivamente pelo grupo **Gym.IA**:

- Vinicius Ryann;
- Carlos Andrade;
- Eduarda Coelho;
- Fábio;
- Kaiky Gomes.

O MVP usado na apresentação foi reconstruído no Lovable a partir das
especificações criadas pelo grupo.

Após a entrega acadêmica, Vinicius Ryann preservou uma cópia e conduziu uma fase
pós-MVP de estabilização para portfólio. Essa fase inclui auditoria, organização
do repositório, proteção de variáveis, documentação, login demonstrativo local,
rota pública, guardrails, testes, publicação e melhorias da experiência de
demonstração.

Essa distinção deve permanecer explícita: autoria original coletiva e
continuidade pós-entrega conduzida por Vinicius.

## 4. Problema de produto

Em pré-vendas técnico-comerciais, um briefing pode dizer apenas:

> “O cliente está com retrabalho na produção e quer automatizar o processo.”

Isso não responde questões essenciais:

- qual resultado precisa ser alcançado;
- como o processo funciona atualmente;
- quais sistemas precisam ser integrados;
- o que pertence ao escopo inicial;
- quais volumes e picos existem;
- quanto custa uma indisponibilidade;
- quais controles de segurança são obrigatórios;
- quem aprova a solução;
- quais premissas ainda precisam ser validadas.

Sem essas respostas, uma solução pode parecer convincente e ainda assim estar
baseada em suposições frágeis.

## 5. Proposta de solução

O Gym.AI conduz o discovery em dez categorias:

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

Ao longo da conversa, o sistema registra respostas e mostra uma estimativa de
cobertura. Depois, o contexto pode ser transformado em:

- **Entendimento Executivo:** síntese, diagnóstico, riscos, premissas, lacunas e
  próximos passos;
- **PRD:** visão do problema, objetivos, requisitos e critérios;
- **ADR:** registro de uma decisão arquitetural e seus trade-offs;
- **Spec:** detalhamento técnico inicial;
- **User Stories:** necessidades organizadas como itens de backlog.

Todos esses materiais são rascunhos e exigem revisão profissional.

## 6. Exemplo completo de uso

### Entrada inicial

> “O cliente está com muito retrabalho no fechamento das ordens de produção.
> Isso está atrasando entregas e ninguém sabe onde o erro começa.”

### Evolução conduzida pelo Gym.AI

O sistema pergunta, por exemplo:

- qual meta mensurável justifica o projeto;
- onde os dados são registrados atualmente;
- quais integrações participam do processo;
- o que precisa entrar no MVP;
- quando a fábrica pode parar;
- quais evidências de auditoria são exigidas;
- quantos apontamentos ocorrem por dia;
- quanto custa um erro ou atraso;
- quem patrocina e valida o piloto;
- o que precisa ser testado antes da proposta.

No cenário demonstrativo, descobre-se que:

- a meta é reduzir o retrabalho em 40%;
- operadores usam planilhas e um analista redigita dados no Totvs;
- a fábrica opera em três turnos;
- existem aproximadamente 1.800 apontamentos diários;
- um erro pode gerar até R$ 80 mil em hora extra e frete emergencial;
- o piloto deve ocorrer na Linha 2;
- Wi-Fi e limites da API do ERP ainda precisam ser validados.

### Hipótese resultante

Capturar o apontamento uma única vez em tablets, validar dados na origem,
integrar com o Totvs e começar por um piloto reversível, mantendo uma planilha
de contingência durante a validação.

O valor do Gym.AI não é “adivinhar” essa solução. É revelar as informações que
permitem construir e revisar a hipótese com responsabilidade.

## 7. Modos de funcionamento

### Demo pública

- rota `/demo`;
- não exige login;
- usa conteúdo fictício e determinístico;
- não chama Supabase nem gateway de IA;
- não envia respostas a serviços externos;
- mostra briefing, perguntas, cobertura, entendimento e artefatos.

URL:

<https://viniciusryanns-gym-ai-discovery-copilot.east-gigantspinosaurus.workers.dev/demo>

### Modo local demonstrativo

- login e cadastro fictícios;
- dados armazenados no `localStorage` do navegador;
- conta pronta: `teste@email.com` / `teste123456`;
- portfólio, discoveries, chat, cobertura e documentos locais;
- botão **Abrir conversa exemplo** com um caso completo;
- comportamento previsível e sem serviços de IA externos.

### Ambiente conectado

O código contém integração com:

- Supabase Auth e PostgreSQL;
- políticas RLS;
- Lovable AI Gateway;
- modelos Gemini;
- Prompt Studio;
- MCP com OAuth.

Esses recursos exigem configuração externa e ainda têm validações pendentes.
Não devem ser apresentados como ambiente produtivo aprovado.

## 8. Arquitetura e tecnologias

### Front-end e aplicação

- **React 19:** componentes e interface;
- **TypeScript:** tipagem e redução de erros;
- **TanStack Start:** aplicação full-stack e renderização no servidor;
- **TanStack Router:** rotas como `/demo`, `/auth` e `/app`;
- **TanStack Query:** cache e sincronização de dados;
- **Tailwind CSS v4:** estilos responsivos;
- **Radix UI:** componentes acessíveis de interface;
- **Motion:** animações;
- **Zod:** validação estruturada.

### Serviços conectados

- **Supabase:** autenticação, PostgreSQL e RLS;
- **Lovable AI Gateway:** acesso a modelos no fluxo conectado;
- **Gemini:** modelos configurados para geração remota;
- **MCP:** ferramentas para acesso controlado aos dados do produto.

### Qualidade, build e publicação

- **Node.js e npm:** execução e dependências;
- **Node Test Runner:** testes automatizados;
- **ESLint e Prettier:** análise e formatação;
- **Vite e Nitro:** build client, SSR e runtime;
- **Cloudflare Workers:** publicação da demonstração em HTTPS;
- **Git e GitHub:** histórico, documentação e portfólio.

## 9. Organização do código

```text
src/routes/                    rotas e páginas
src/components/                interface reutilizável
src/lib/*.functions.ts         funções executadas no servidor
src/lib/demo-mode/             autenticação, dados e respostas locais
src/integrations/supabase/     clientes e middleware Supabase
src/lib/mcp/                   ferramentas MCP
supabase/migrations/           schema e políticas RLS
docs/specs/                    especificações antes das mudanças
docs/sessions/                 evidências e registros de execução
```

## 10. Estado validado

Até 6 de agosto de 2026, existe evidência registrada de:

- instalação reproduzível com npm;
- typecheck aprovado;
- 25 testes automatizados aprovados;
- build de produção aprovado;
- lint global aprovado sem erros ou avisos;
- CI pública aprovada no GitHub Actions;
- package name corrigido para `gym-ai-discovery-copilot`;
- quatro screenshots reais publicados no README;
- rota pública HTTPS com deep link e refresh;
- teste da demo em desktop e mobile;
- ausência de chamadas ao Supabase e gateway no fluxo `/demo`;
- conversa completa local com dez categorias, entendimento e quatro artefatos;
- créditos e limitações documentados.

O projeto pode ser chamado de **MVP funcional demonstrável e estabilizado para
portfólio**. Não deve ser chamado de sistema pronto para produção.

### Narrativa técnica correta

A arquitetura atual comprovada é baseada em TanStack Start, React e TypeScript.
A demo pública e o modo local são determinísticos. No ambiente conectado, a
orquestração validada usa uma chamada estruturada ao modelo por meio do Lovable
AI Gateway; uma arquitetura com agentes independentes deve ser apresentada
somente como roadmap, não como funcionalidade concluída.

## 11. Limitações e riscos conhecidos

- não há suíte E2E permanente no repositório;
- faltam vídeo/GIF opcional e release formal de portfólio;
- o ambiente conectado precisa de validação real de login e IA;
- fallback e atomicidade do gateway remoto estão pendentes;
- RLS e constraints precisam ser fortalecidos e testados entre usuários;
- MCP ainda não foi validado ponta a ponta;
- não há colaboração multiusuário, CRM ou exportação nativa para PDF/DOCX;
- a cobertura é uma estimativa de completude, não uma auditoria de qualidade.

## 12. Próximas prioridades recomendadas

1. preparar o texto final e publicar o projeto no LinkedIn;
2. revisar metadados sociais e GitHub About;
3. criar a release `v0.1.0-portfolio`;
4. adicionar vídeo/GIF curto, se desejado;
5. criar uma suíte E2E permanente;
6. somente depois avançar na resiliência da IA e segurança conectada.

## 13. Links

- Repositório: <https://github.com/ViniciusRyannS/gym-ai-discovery-copilot>
- Demo: <https://viniciusryanns-gym-ai-discovery-copilot.east-gigantspinosaurus.workers.dev/demo>
- Manual técnico: `docs/manual-do-sistema.md`
- Quadro de tarefas: `docs/task-board.md`
- Evidências de testes: `docs/testing.md`

## 14. Prompt sugerido ao compartilhar este arquivo

```text
Leia integralmente este documento e trate-o como contexto factual do Gym.AI.
Não atribua autoria exclusiva a Vinicius, não confunda a demo determinística
com IA remota e não considere o ambiente conectado pronto para produção.
Antes de recomendar mudanças, separe: estado validado, limitações, riscos e
próxima ação prioritária.
```
