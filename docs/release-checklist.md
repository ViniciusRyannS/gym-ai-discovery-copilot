# Checklist de conclusão — Gym.AI

Este checklist consolida o objetivo da sprint de finalização. Um item só é
concluído com evidência real; limitações externas devem permanecer explícitas.

## 1. Preservação e apresentação

- [x] Preservar créditos do grupo Gym.IA.
- [x] Documentar continuidade pós-entrega conduzida por Vinicius Ryann.
- [x] Inicializar repositório Git próprio.
- [x] Publicar histórico inicial em repositório privado.
- [x] Criar README de execução e limitações.
- [ ] Revisar README final para abertura pública.
- [ ] Definir licença com os autores ou manter todos os direitos reservados.
- [ ] Adicionar screenshots reais e GIF/vídeo curto.
- [ ] Preparar texto final de apresentação e LinkedIn.

## 2. Execução e dependências

- [x] Proteger `.env` e fornecer `.env.example`.
- [x] Adotar npm e `package-lock.json` no novo repositório.
- [x] Documentar execução local.
- [x] Validar instalação.
- [x] Adicionar script de typecheck.
- [x] Validar build de produção.
- [ ] Corrigir o lint global ou definir baseline explícito.
- [x] Atualizar o nome genérico do pacote.
- [ ] Adicionar CI para typecheck, testes e build.

## 3. Autenticação e demonstração

- [x] Corrigir estados e mensagens de autenticação.
- [x] Criar login e cadastro fictícios locais.
- [x] Persistir sessão demo no navegador.
- [x] Criar rota pública `/demo`.
- [x] Publicar `/demo` em URL HTTPS independente.
- [x] Criar portfólio, discovery e chat determinísticos no modo demo.
- [x] Adicionar conversa completa de exemplo com entendimento e artefatos.
- [ ] Validar login real confirmado no ambiente conectado.
- [ ] Decidir se o OAuth Google será configurado ou removido da documentação.
- [x] Implementar Entendimento e Artefatos locais com identificação explícita.
- [x] Executar teste visual mobile e desktop do modo demo.

## 4. Qualidade do discovery e IA

- [x] Rejeitar saudações, ruído e mensagens sem informação sem criar fatos.
- [x] Impedir aumento de cobertura por entrada insuficiente.
- [x] Exigir evidência textual para fatos extraídos.
- [ ] Deduplicar e reconciliar fatos.
- [ ] Adicionar fallback para indisponibilidade do gateway.
- [ ] Evitar persistência parcial quando a IA falhar.
- [ ] Tratar todos os erros de banco relevantes.
- [ ] Adicionar limites de tamanho aos inputs.
- [x] Alinhar a alegação “multi-agente” ao código real.
- [x] Criar testes unitários dos guardrails de entrada.
- [ ] Criar testes de integração do orquestrador remoto.

## 5. Banco e segurança

- [ ] Fortalecer RLS das tabelas filhas com propriedade da conversa.
- [ ] Adicionar constraints de versão para prompts e entendimentos.
- [ ] Restringir tipos de artefato e categorias válidas no banco.
- [ ] Validar isolamento entre dois usuários reais.
- [ ] Revisar uso e necessidade da service role.
- [ ] Confirmar que segredos não aparecem em bundle ou logs.

## 6. Produto e UX

- [x] Demonstrar briefing, perguntas, cobertura, entendimento e artefatos.
- [x] Manter aviso de revisão humana.
- [x] Substituir o manual desatualizado por uma versão canônica e verificável.
- [ ] Revisar os demais textos e alegações da interface.
- [ ] Validar acessibilidade por teclado, foco e contraste.
- [ ] Validar responsividade das rotas principais.
- [ ] Melhorar recuperação de estados vazios e erros.
- [ ] Confirmar fluxo de anexos e limites.

## 7. Integrações e release

- [ ] Validar MCP ponta a ponta com OAuth.
- [ ] Validar Entendimento Executivo versionado no ambiente conectado.
- [ ] Validar geração dos quatro artefatos.
- [ ] Executar roteiro completo de demonstração.
- [ ] Criar release candidata com tag.
- [ ] Tornar o repositório público somente após a revisão de segredos, autoria e
      documentação.
- [x] Validar acesso direto e refresh da rota pública `/demo`.
- [x] Validar ausência de chamadas ao Supabase e ao gateway na demo pública.

## Quality gate final

- [x] install
- [ ] lint global ou baseline aprovado
- [x] typecheck
- [x] testes unitários
- [x] build
- [x] login demo
- [x] portfólio demo
- [x] novo discovery demo
- [x] fluxo de mensagem demo
- [x] cobertura demo
- [ ] login real
- [ ] fluxo de mensagem remoto com guardrails
- [ ] Entendimento Executivo remoto
- [ ] artefatos remotos
- [ ] RLS isolation
- [ ] MCP
- [x] rota manual
- [x] rota pública `/demo`
