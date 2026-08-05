# Gym.AI — Guia para mentores e pessoas não técnicas

## O que é o Gym.AI?

O Gym.AI é uma ferramenta que ajuda profissionais a entender melhor o problema
de um cliente antes de propor uma solução tecnológica.

Imagine que um cliente diga:

> “Minha equipe está perdendo tempo com retrabalho. Quero automatizar isso.”

A frase aponta uma dor, mas ainda não é suficiente para decidir o que construir,
quanto custará ou quais riscos existem. O Gym.AI conduz uma conversa organizada
para transformar essa fala inicial em informações úteis para negócio, produto e
tecnologia.

## Por que esse projeto seria útil?

Em muitos projetos, a equipe começa a pensar na solução cedo demais. Depois
descobre que:

- não entendeu a meta do cliente;
- esqueceu uma integração importante;
- não mediu o volume de uso;
- ignorou uma regra de segurança;
- não sabia quem precisava aprovar;
- estimou prazo e custo com informações incompletas.

Isso gera novas reuniões, retrabalho, atraso e propostas menos confiáveis.

O Gym.AI funciona como um roteiro inteligente. Ele ajuda a lembrar quais
perguntas precisam ser respondidas e mostra visualmente o que ainda está
faltando.

## Uma analogia simples: preparar um bolo

Uma pessoa diz:

> “Preciso fazer um bolo, mas não sei como.”

Antes de entregar uma receita, seria necessário perguntar:

- para quantas pessoas;
- qual sabor;
- se alguém tem alergia;
- qual é a data do evento;
- quais ingredientes já existem;
- qual forno será usado;
- quanto a pessoa pode gastar;
- se o bolo precisa ser transportado;
- qual decoração é esperada.

Sem essas respostas, recomendar “um bolo de chocolate” pode não resolver o
problema. Talvez exista alergia, o forno seja pequeno ou o evento seja para cem
pessoas.

O Gym.AI aplica essa mesma lógica a projetos de tecnologia: primeiro entende o
contexto, depois ajuda a organizar uma solução possível.

## Exemplo do projeto: retrabalho na produção

### O problema inicial

> “O cliente está com retrabalho no fechamento das ordens de produção e isso
> está atrasando as entregas.”

### O que o Gym.AI pergunta

Durante a demonstração, o sistema investiga:

- qual melhoria a diretoria espera;
- como o trabalho é feito hoje;
- quais sistemas estão envolvidos;
- o que é indispensável na primeira versão;
- quando a fábrica pode ficar em manutenção;
- quais registros são necessários para auditoria;
- quantas operações acontecem por dia;
- qual é o custo dos erros;
- quem aprova a solução;
- quais testes precisam acontecer antes da implantação.

### O que foi descoberto

No exemplo fictício:

- operadores preenchem planilhas;
- um analista digita as mesmas informações novamente no ERP Totvs;
- a meta é reduzir o retrabalho em 40%;
- existem aproximadamente 1.800 registros por dia;
- erros podem custar até R$ 80 mil em hora extra e frete emergencial;
- a fábrica opera em três turnos;
- a solução deve começar com um piloto na Linha 2;
- o Wi-Fi industrial e a integração com o ERP ainda precisam ser testados.

### A hipótese de solução

Registrar os dados uma única vez em tablets, validar as informações antes do
envio e integrá-las ao ERP. A mudança começaria em uma linha de produção, com
possibilidade de voltar ao processo anterior durante o piloto.

Essa não é uma resposta automática considerada verdadeira. É uma hipótese bem
mais fundamentada, pronta para ser revisada pelos responsáveis.

## O que aparece na tela?

### Conversa guiada

O usuário descreve o que sabe e o Gym.AI faz a próxima pergunta relevante.

### Cobertura

Um painel mostra quanto foi investigado em dez áreas. A cobertura ajuda a
enxergar lacunas, mas não garante que a proposta está correta.

### Entendimento Executivo

É um resumo voltado a quem precisa tomar decisões. Ele reúne problema, contexto,
riscos, informações faltantes, premissas e próximos passos.

### Artefatos

O Gym.AI prepara quatro tipos de rascunho:

- **PRD:** explica o problema, objetivos e requisitos do produto;
- **ADR:** registra uma decisão de arquitetura e seus prós e contras;
- **Spec:** detalha inicialmente como a solução poderia funcionar;
- **User Stories:** organiza necessidades em itens que uma equipe pode planejar.

Esses documentos não são contratos nem projetos finais. Eles aceleram a
discussão e precisam de revisão humana.

## Tecnologias utilizadas, em linguagem simples

### React

Biblioteca usada para construir as telas e permitir que elas mudem conforme a
pessoa interage.

### TypeScript

Linguagem que adiciona verificações ao código JavaScript. Ajuda a encontrar
erros antes de colocar o sistema no ar.

### TanStack Start e TanStack Router

Estruturam a aplicação, organizam as páginas e permitem acessar endereços como
`/demo`, `/auth` e `/app`.

### Tailwind CSS e Radix UI

São usados para aparência, responsividade e componentes de interface como
botões, painéis e janelas.

### TanStack Query

Ajuda a buscar, atualizar e organizar os dados exibidos pela interface.

### Supabase

No ambiente conectado, oferece login, banco de dados PostgreSQL e regras para
separar dados de usuários. Essa parte ainda requer validações antes de produção.

### Gemini e Lovable AI Gateway

Fazem parte do fluxo conectado de inteligência artificial. A demonstração
pública não depende deles e não finge estar consultando uma IA externa.

### Cloudflare Workers

É o serviço que mantém a demonstração disponível pela internet com HTTPS.

### GitHub

Armazena o código, o histórico das alterações, testes e documentação. Também
funciona como portfólio técnico.

### Spec-as-Code

É a forma de trabalhar usada na estabilização: antes de uma mudança relevante,
o problema, a decisão, os critérios e os testes são registrados em documentos
versionados junto ao código.

## A demonstração usa dados reais?

Não. A demo pública e a conversa completa usam dados fictícios.

Na demonstração:

- não é necessário cadastro;
- nenhuma resposta é enviada ao Supabase;
- nenhuma resposta é enviada a um modelo de IA;
- o resultado é previsível e seguro para apresentação;
- a tela avisa que os conteúdos precisam de revisão humana.

Isso foi uma decisão de produto: um mentor ou recrutador pode avaliar a ideia
sem depender de contas, chaves ou serviços externos.

## O que já funciona?

- demonstração pública sem login;
- login fictício para explorar o produto;
- criação de um discovery;
- conversa orientada por dez categorias;
- tratamento de mensagens vagas;
- visualização da cobertura;
- conversa completa pronta para avaliação;
- Entendimento Executivo;
- PRD, ADR, Spec e User Stories;
- armazenamento local no navegador;
- testes automatizados e build de produção;
- publicação em HTTPS.

## O que ainda não está pronto?

O projeto é um MVP funcional para demonstração, não um produto comercial em
produção. Ainda faltam, entre outros pontos:

- validação completa do ambiente online com usuários reais;
- testes de segurança entre usuários;
- maior resistência a falhas de serviços externos;
- testes automatizados da jornada inteira no navegador;
- recursos como colaboração, CRM e exportação para PDF/DOCX;
- materiais visuais finais, como GIF e vídeo de apresentação.

## Quem desenvolveu?

O MVP acadêmico foi criado pelo grupo **Gym.IA**:

- Vinicius Ryann;
- Carlos Andrade;
- Eduarda Coelho;
- Fábio;
- Kaiky Gomes.

Depois da entrega acadêmica, Vinicius Ryann conduziu uma etapa de estabilização,
testes, documentação, demonstração pública e preparação para portfólio. Isso não
remove nem substitui os créditos do grupo original.

## Como experimentar

### Opção rápida — sem login

Abra:

<https://viniciusryanns-gym-ai-discovery-copilot.east-gigantspinosaurus.workers.dev/demo>

A demonstração apresenta briefing, perguntas, cobertura, entendimento e
artefatos.

### Opção completa

1. Na demo pública, clique em **Acessar produto**.
2. Escolha o modo **Demonstração**.
3. Use `teste@email.com` e `teste123456`.
4. Clique em **Abrir conversa exemplo**.
5. Leia a conversa e abra **Entendimento** e **Artefatos**.

## Links

- Código e documentação:
  <https://github.com/ViniciusRyannS/gym-ai-discovery-copilot>
- Demonstração:
  <https://viniciusryanns-gym-ai-discovery-copilot.east-gigantspinosaurus.workers.dev/demo>

## Resumo em uma frase

> O Gym.AI ajuda equipes de pré-vendas a fazer as perguntas certas antes de
> prometer uma solução, reduzindo lacunas, retrabalho e decisões baseadas em
> suposições.
