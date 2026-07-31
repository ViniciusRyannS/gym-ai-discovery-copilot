import { DISCOVERY_CATEGORIES, EMPTY_COVERAGE } from "./discovery-defaults";

export type SeedMessage = { role: "user" | "assistant"; content: string };
export type SeedFact = { key: string; value: string; category: string };
export type SeedUnderstanding = {
  summary: string;
  diagnosis: string;
  missing_information: string[];
  risks: string[];
  assumptions: string[];
  next_steps: string[];
  complexity: "baixa" | "media" | "alta";
};
export type SeedArtifact = {
  kind: "prd" | "adr" | "spec" | "user_story";
  title: string;
  content: string;
};
export type SeedJourney = {
  service_type: string;
  title: string;
  briefing: string;
  primary_category: string;
  coverage: Record<string, number>;
  messages: SeedMessage[];
  facts: SeedFact[];
  understandings: SeedUnderstanding[];
  artifacts: SeedArtifact[];
};

const CATS = Object.fromEntries(DISCOVERY_CATEGORIES.map((c) => [c.key, c.key])) as Record<string, string>;

function coverage(partial: Record<string, number>): Record<string, number> {
  return { ...EMPTY_COVERAGE, ...partial };
}

// ------------------------------------------------------------------
// Jornada 1 — Migração Cloud AWS — 85% cobertura
// ------------------------------------------------------------------
const J1: SeedJourney = {
  service_type: "Migração Cloud AWS",
  title: "[DEMO] Varejista Nordeste — Migração AWS",
  briefing:
    "Rede varejista com 180 lojas físicas quer migrar ERP legado (Oracle E-Business Suite on-prem) e portal e-commerce para AWS. Motivador: contrato de datacenter vence em 10 meses, custo subiu 40%. Sponsor é o CFO. TI enxuta (12 pessoas). Sem experiência prévia em cloud.",
  primary_category: CATS.contexto_negocio,
  coverage: coverage({
    contexto_negocio: 0.95, ambiente_atual: 0.9, escopo_tecnico: 0.9,
    operacao_sustentacao: 0.85, seguranca_conformidade: 0.8, volumetria_capacidade: 0.9,
    criticidade: 0.9, governanca: 0.75, premissas_exclusoes: 0.8, riscos_validacoes: 0.75,
  }),
  messages: [
    { role: "user", content: "Vamos começar. Preciso mapear escopo e riscos antes de mandar proposta em 3 semanas." },
    { role: "assistant", content: "Ótimo. Começando pelo **contexto de negócio**: qual é o driver principal — só o custo do DC ou tem outro objetivo estratégico (velocidade de release, expansão de canais, resiliência)?\n\nE quem, além do CFO, precisa aprovar essa migração?" },
    { role: "user", content: "Driver primário é custo (contrato do DC vence, 40% de reajuste). Secundário é resiliência — tiveram 3 quedas críticas em 12 meses. Aprovação: CFO patrocina, CIO tecniciza, e o Comitê Executivo (5 pessoas) precisa dar aval na fase de contratação." },
    { role: "assistant", content: "Perfeito. Sobre o **ambiente atual**: além do Oracle EBS, quais são as integrações críticas hoje? Estou pensando em SEFAZ (NFe), meios de pagamento, WMS, PDV das lojas. E o portal e-commerce roda em qual stack?" },
    { role: "user", content: "Integrações: NFe (Focus NFe SaaS), Cielo/Rede/Getnet, WMS Manhattan on-prem, ~180 PDVs Linux com sync noturno via VPN MPLS. Portal é Magento 2 com MySQL 8, cache Redis, imagens em NFS local." },
    { role: "assistant", content: "Anotado. Sobre **volumetria**: qual o pico de pedidos/hora no e-commerce (Black Friday, por exemplo) e o volume médio de transações do ERP por dia? Isso muda a estratégia entre lift-and-shift e refatoração." },
    { role: "user", content: "Pico Black Friday 2024: 4.200 pedidos/hora, ~11k sessões concorrentes. Dia normal: 800 ped/h. ERP: ~40k transações/dia, batch noturno de 6h para consolidação fiscal." },
    { role: "assistant", content: "Bom sinal — volumetria não é extrema. Sobre **segurança e conformidade**: dados de cartão passam pelo ambiente (PCI-DSS)? LGPD tem DPO nomeado? Alguma auditoria externa recente?" },
    { role: "user", content: "PCI-DSS SAQ-A (tokenização no adquirente, não armazenamos PAN). LGPD: DPO nomeado, ROPA feito ano passado, sem incidentes reportados. Auditoria interna anual, sem externa formal." },
    { role: "assistant", content: "Ótimo, isso simplifica muito. Sobre **operação**: qual o SLA hoje do e-commerce e do ERP? Time de sustentação atual — próprio ou terceirizado? Janela de manutenção disponível?" },
    { role: "user", content: "SLA e-commerce: 99.5% (medido, entrega 99.1%). ERP: horário comercial + batch, sem SLA formal. Sustentação: 4 pessoas próprias + AMS Oracle terceirizado. Janela: dom 2h-6h para o ERP; e-commerce sem janela." },
    { role: "assistant", content: "Ponto crítico do e-commerce zero-downtime. Sobre **riscos**: qual é o maior medo do CIO nessa migração? E o CFO tem um teto de investimento definido para o programa?" },
    { role: "user", content: "CIO teme paralisar operação de lojas por integração PDV-ERP quebrada. CFO: teto de R$ 4,2 milhões CAPEX ano 1 + até 30% economia OPEX ano 2 (compromisso público)." },
    { role: "assistant", content: "Cenário está bem claro. Recomendo agora **gerar o Entendimento Executivo** — já temos base para diagnóstico, riscos e próximos passos. Você quer que eu monte também o PRD e o ADR de estratégia de migração?" },
    { role: "user", content: "Sim, gera tudo: entendimento, PRD, ADR e as user stories para escopo do MVP." },
  ],
  facts: [
    { key: "driver_primario", value: "Fim do contrato DC + reajuste 40%", category: CATS.contexto_negocio },
    { key: "driver_secundario", value: "Resiliência (3 quedas críticas em 12m)", category: CATS.contexto_negocio },
    { key: "sponsor", value: "CFO patrocina; CIO tecniciza; Comitê Executivo aprova", category: CATS.governanca },
    { key: "prazo", value: "10 meses até vencimento do DC", category: CATS.contexto_negocio },
    { key: "erp", value: "Oracle E-Business Suite on-prem", category: CATS.ambiente_atual },
    { key: "ecommerce_stack", value: "Magento 2 + MySQL 8 + Redis + NFS", category: CATS.ambiente_atual },
    { key: "integracoes", value: "Focus NFe, Cielo/Rede/Getnet, WMS Manhattan, 180 PDVs Linux via MPLS", category: CATS.ambiente_atual },
    { key: "pico_ecommerce", value: "4.200 ped/h e 11k sessões concorrentes (Black Friday)", category: CATS.volumetria_capacidade },
    { key: "volume_erp", value: "40k transações/dia, batch fiscal 6h", category: CATS.volumetria_capacidade },
    { key: "pci", value: "SAQ-A, sem armazenar PAN (tokenização)", category: CATS.seguranca_conformidade },
    { key: "lgpd", value: "DPO nomeado, ROPA feito, sem incidentes", category: CATS.seguranca_conformidade },
    { key: "sla_ecommerce", value: "99.5% (entrega 99.1%)", category: CATS.operacao_sustentacao },
    { key: "sustentacao", value: "4 internos + AMS Oracle terceirizado", category: CATS.operacao_sustentacao },
    { key: "janela_manutencao", value: "Dom 2h-6h ERP; e-commerce zero-downtime", category: CATS.operacao_sustentacao },
    { key: "criticidade_pdv", value: "Alta — quebra integração PDV-ERP paralisa lojas", category: CATS.criticidade },
    { key: "teto_capex", value: "R$ 4,2M ano 1", category: CATS.premissas_exclusoes },
    { key: "meta_opex", value: "30% economia OPEX ano 2 (compromisso público)", category: CATS.premissas_exclusoes },
    { key: "risco_principal", value: "Quebra de sync PDV durante cutover", category: CATS.riscos_validacoes },
    { key: "estrategia_hipotese", value: "Lift-and-shift ERP + refactor seletivo do e-commerce", category: CATS.escopo_tecnico },
  ],
  understandings: [
    {
      summary:
        "Varejista com 180 lojas precisa migrar Oracle EBS + Magento 2 para AWS em 10 meses, com CAPEX limitado a R$ 4,2M e meta pública de 30% de economia OPEX no ano 2. Sponsor é o CFO, viabilizador é o CIO.",
      diagnosis:
        "Cenário maduro para migração: volumetria moderada, PCI/LGPD já endereçados, integrações mapeadas. Principal complicador é o sync PDV-ERP em 180 lojas com MPLS legado — cutover requer estratégia de coexistência, não big-bang. Magento 2 comporta refatoração seletiva (imagens saindo do NFS para S3+CloudFront traria ganho imediato). Oracle EBS provavelmente vai de lift-and-shift para RDS Oracle BYOL ou EC2 dedicado, dado o AMS.",
      missing_information: [
        "Custo atual detalhado do DC (por CI) para calcular TCO comparativo real",
        "Contratos de licenças Oracle (LMS) — mobilidade cloud e BYOL",
        "Topologia MPLS e viabilidade de SD-WAN por loja",
        "Roadmap de novos canais (marketplace, app) que possam mudar o teto de tráfego",
      ],
      risks: [
        "Cutover PDV: falha de sync paralisa vendas — mitigar com dupla escrita e rollback assistido",
        "Licenças Oracle LMS podem inflar custo se auditadas pós-migração",
        "Meta pública de 30% OPEX cria pressão política — exigir baseline auditável antes de assinar",
        "AMS Oracle terceirizado pode resistir a mudança de escopo — negociar cedo",
        "180 lojas com conectividade heterogênea — piloto obrigatório",
      ],
      assumptions: [
        "Magento 2 permanece — sem replatform para Vtex/Shopify neste programa",
        "Oracle EBS não será upgrade de versão no cutover (mudança 1: infra)",
        "Adquirentes atuais permanecem — sem mudar tokenização",
        "Datacenter atual não renova — não há plano B híbrido de longo prazo",
      ],
      next_steps: [
        "Assessment de licenças Oracle (LMS) — 2 semanas com parceiro certificado",
        "Piloto de conectividade em 5 lojas de perfis distintos (grande, média, pequena, remota, mall)",
        "Definir arquitetura-alvo AWS (VPCs, contas, DR, backup) — ADR formal",
        "Baseline de OPEX auditável assinado pelo CFO antes de fechar SOW",
        "Landing Zone + Control Tower nas primeiras 4 semanas do programa",
      ],
      complexity: "alta",
    },
  ],
  artifacts: [
    {
      kind: "prd",
      title: "PRD — Migração AWS Varejista Nordeste",
      content: `# PRD — Migração AWS Varejista Nordeste

## Contexto
Rede varejista de 180 lojas com Oracle EBS on-prem + Magento 2 precisa migrar para AWS em 10 meses (vencimento do DC). Driver primário: fim de contrato com reajuste de 40%. Driver secundário: resiliência após 3 incidentes críticos em 12 meses.

## Objetivos
- Migrar 100% das cargas produtivas para AWS até o mês 9, com 1 mês de buffer.
- Reduzir OPEX de infraestrutura em ≥ 30% no ano fiscal seguinte à conclusão.
- Elevar SLA medido do e-commerce de 99,1% para ≥ 99,9% após 90 dias em regime.
- Zero incidentes P1 relacionados à integração PDV-ERP durante o cutover.

## Não-objetivos
- Substituir Oracle EBS por outro ERP (fora de escopo).
- Replataformar Magento para outra suíte de e-commerce.
- Renegociar contratos com adquirentes (Cielo/Rede/Getnet).
- Alterar processos fiscais ou de emissão de NFe.

## Público
Sponsor: CFO. Viabilizador: CIO. Aprovadores finais: Comitê Executivo (5). Beneficiários: operação de e-commerce (SLA), operação de lojas (estabilidade PDV), finanças (redução de OPEX).

## Requisitos Funcionais
- **RF1** — ERP Oracle EBS operando em AWS com paridade funcional 1:1.
- **RF2** — Portal Magento 2 operando em AWS com CDN, cache e imagens externalizadas.
- **RF3** — Sincronização PDV↔ERP mantida com janela ≤ 5min (hoje é noturna).
- **RF4** — Integração NFe, adquirentes e WMS preservadas sem mudança de contrato.
- **RF5** — Console de observabilidade unificada (CloudWatch + Grafana) para operação.

## Requisitos Não-Funcionais
- SLA e-commerce ≥ 99,9% pós-estabilização.
- RPO ≤ 15min e RTO ≤ 1h para ERP.
- RPO ≤ 1min e RTO ≤ 15min para e-commerce.
- Compliance PCI-DSS SAQ-A e LGPD mantidos.
- Custos mensuráveis por tag de aplicação (FinOps).

## Métricas
- % de OPEX reduzido vs. baseline (meta 30%).
- SLA medido por trimestre.
- MTTR de incidentes P1/P2.
- Custo por pedido processado (Magento).
- Custo por transação ERP.

## Riscos
- Cutover PDV — 180 lojas com conectividade heterogênea.
- Licenças Oracle LMS podem inflar TCO.
- Meta pública de 30% OPEX cria risco político-comercial.
- Dependência de AMS Oracle terceirizado no cutover.
`,
    },
    {
      kind: "adr",
      title: "ADR-001 — Estratégia de Migração: Rehost + Refactor Seletivo",
      content: `# ADR-001 — Estratégia de Migração: Rehost + Refactor Seletivo

## Contexto
Programa de migração AWS com prazo curto (10 meses), CAPEX limitado (R$ 4,2M) e meta agressiva de OPEX (-30%). Duas cargas principais: Oracle EBS (ERP) e Magento 2 (e-commerce). Time de TI enxuto sem experiência prévia em cloud.

## Decisão
Adotar **rehost (lift-and-shift) para Oracle EBS** e **refactor seletivo para Magento 2**.

- Oracle EBS: mover para EC2 dedicated + storage EBS gp3, mantendo AMS atual, com estudo de RDS Oracle BYOL no ano 2.
- Magento 2: manter aplicação, mas externalizar sessão para ElastiCache, imagens para S3+CloudFront, banco para RDS MySQL Multi-AZ.
- Landing Zone via Control Tower com 4 contas (prod, hml, sandbox, security).
- Conectividade lojas: Direct Connect + SD-WAN piloto em 5 lojas antes de rollout.

## Alternativas Consideradas
1. **Replataforma Magento** para Vtex/Shopify — descartada: prazo e escopo inviáveis, e mudaria adquirentes.
2. **Refactor Oracle para PostgreSQL** — descartada: risco fiscal alto, sem ganho de OPEX significativo no ano 1.
3. **Retain (permanecer em DC)** — descartada: driver contratual e financeiro do CFO.
4. **Big-bang cutover** — descartada: 180 lojas + integração PDV inviabilizam.

## Consequências
**Positivas:** velocidade compatível com o prazo, risco técnico contido, foco de OPEX no ano 2 (refactor seletivo).
**Negativas:** débito técnico do EBS permanece; futuro upgrade de versão continua pendente.
**Trade-off aceito:** priorizar prazo e economia acima de modernização de plataforma neste programa.
`,
    },
    {
      kind: "spec",
      title: "Spec — Arquitetura-Alvo AWS",
      content: `# Spec — Arquitetura-Alvo AWS

## Arquitetura Proposta
- **Contas**: prod / hml / sandbox / security (Control Tower).
- **Rede**: 2 VPCs (produção e não-produção), Transit Gateway para lojas via Direct Connect (backup SD-WAN).
- **Compute**: EC2 dedicated para Oracle EBS; ECS Fargate para Magento 2 stateless; RDS MySQL Multi-AZ.
- **Dados**: S3 (imagens + backups) com Intelligent-Tiering; EBS gp3 para EBS DB.
- **Segurança**: GuardDuty, Security Hub, KMS por conta, WAF em CloudFront.
- **Observabilidade**: CloudWatch + Grafana Cloud; log central em CloudWatch Logs + S3 Glacier.

## Componentes
- Frontend Magento em ALB → ECS Fargate.
- Backend Oracle EBS em EC2 r6i.4xlarge (redimensionar após 30 dias).
- Sync PDV via Kinesis Firehose + Lambda para ERP.
- NFe: continua com Focus NFe SaaS (sem mudança).

## Fluxos
1. Cliente → CloudFront → ALB → Magento (Fargate) → RDS/ElastiCache.
2. PDV → API Gateway → Lambda → EBS.
3. ERP → S3 (arquivos fiscais) → Athena (consulta ad-hoc).

## Contratos de API
- **PDV sync**: POST /v1/pdv/sync — payload JSON, autenticação mTLS.
- **NFe callback**: POST /v1/nfe/status — assinado HMAC.

## Modelo de Dados
Sem alterações de schema no MVP. Migração 1:1 do MySQL e Oracle.

## Segurança
- WAF managed rules OWASP Top 10.
- Segredos em Secrets Manager.
- IAM: least privilege por serviço, sem chaves estáticas.
- PCI-DSS SAQ-A mantido (sem PAN no ambiente).

## Operação
- Runbooks em Confluence.
- On-call rotacionado (4 pessoas).
- Deploy Blue/Green para Magento; janela dominical para EBS.
`,
    },
    {
      kind: "user_story",
      title: "User Stories — MVP Migração",
      content: `# User Stories — MVP Migração

## US-01
**Como** operador de loja, **quero** que meu PDV continue enviando vendas ao ERP em até 5 minutos após a migração **para** não perder registros fiscais.
- Sync PDV↔ERP em ≤5min medida em 100% das lojas piloto.
- Fallback local por 24h se conectividade cair.
- Alerta ao NOC em caso de fila > 500 mensagens.

## US-02
**Como** cliente do e-commerce, **quero** navegar e finalizar compras durante toda a janela de cutover **para** não abandonar carrinho.
- Zero downtime medido durante cutover.
- Latência p95 ≤ 900ms mantida.
- Rollback automático em degradação > 10% no p95.

## US-03
**Como** CFO, **quero** ver o consumo de nuvem por área e aplicação **para** validar a meta de -30% OPEX.
- Dashboard FinOps com tags por aplicação.
- Relatório mensal comparativo com baseline auditado.
- Alerta orçamentário em 80% do budget.

## US-04
**Como** analista de segurança, **quero** logs centralizados com retenção de 12 meses **para** atender auditoria LGPD e PCI.
- CloudTrail + VPC Flow Logs em S3 Glacier.
- Athena habilitado para consulta ad-hoc.
- Alertas GuardDuty críticos abrindo ticket automático.

## US-05
**Como** administrador Oracle, **quero** ambiente EBS em AWS com paridade funcional **para** manter operação sem retrabalho.
- Testes de paridade 1:1 aprovados pelo AMS.
- Janela de rollback definida (dominical).
- Documentação de operação atualizada.

## US-06
**Como** gestor de e-commerce, **quero** provisionar capacidade extra em Black Friday sem intervenção manual **para** absorver pico sem risco.
- Auto Scaling baseado em CPU/latência.
- Teste de carga trimestral simulando 2× do pico anterior.
- Playbook Black Friday validado 30 dias antes.
`,
    },
  ],
};

// ------------------------------------------------------------------
// Jornada 2 — Chatbot RAG Corporativo — 55% cobertura
// ------------------------------------------------------------------
const J2: SeedJourney = {
  service_type: "Chatbot com RAG Corporativo",
  title: "[DEMO] Escritório Jurídico — RAG contratos",
  briefing:
    "Escritório de advocacia médio (140 advogados) quer chatbot que consulte base de 80k contratos e pareceres internos em PDF. Objetivo: reduzir tempo de pesquisa jurisprudencial. Preocupação forte com sigilo cliente/OAB.",
  primary_category: CATS.seguranca_conformidade,
  coverage: coverage({
    contexto_negocio: 0.8, ambiente_atual: 0.5, escopo_tecnico: 0.6,
    operacao_sustentacao: 0.3, seguranca_conformidade: 0.85, volumetria_capacidade: 0.4,
    criticidade: 0.6, governanca: 0.7, premissas_exclusoes: 0.5, riscos_validacoes: 0.4,
  }),
  messages: [
    { role: "user", content: "Cliente quer RAG sobre 80k PDFs de contratos e pareceres. Prazo apertado, sigilo é tudo." },
    { role: "assistant", content: "Entendido. Sobre **contexto de negócio**: qual métrica o sócio quer mover? Tempo médio de pesquisa por caso, produtividade por advogado, ou redução de retrabalho em contratos padrão?" },
    { role: "user", content: "Tempo de pesquisa. Hoje um pleno leva 2-4h para achar precedente interno. Meta é cair para minutos com respostas rastreáveis." },
    { role: "assistant", content: "Métrica clara — resposta com **citação obrigatória**. Sobre **segurança e conformidade**: existe classificação de sigilo por documento? Dados pessoais sensíveis (LGPD) exigem tratamento específico? Podem sair da infra do cliente?" },
    { role: "user", content: "Classificação existe (público, confidencial, sigiloso). Sigilosos são ~15% da base. LGPD: dados de PF em contratos. NADA pode sair da infra do cliente — exigência do compliance." },
    { role: "assistant", content: "Isso trava opções SaaS puras — precisamos rodar em VPC do cliente ou on-prem. Já tem cloud provider padrão? Azure/AWS/GCP? E qual o apetite para GPU on-prem vs. inferência em cloud dedicada?" },
    { role: "user", content: "Azure é padrão (contrato enterprise). Não têm GPU. Aceitam inferência em Azure OpenAI se ficar em region BR e sob contrato existente." },
    { role: "assistant", content: "Ótimo, isso viabiliza Azure OpenAI + AI Search em region brazilsouth. Sobre **volumetria**: 80k PDFs — qual o tamanho médio? Quantos advogados usariam simultaneamente no pico? Novos documentos entram diariamente ou em lotes?" },
    { role: "user", content: "PDFs variam 2 a 300 páginas, média 40. Uso: 140 advogados, pico estimado 30 concorrentes. Novos: ~200 documentos/dia entram no DMS (Sharepoint)." },
    { role: "assistant", content: "Sharepoint como fonte simplifica pipeline. Sobre **operação**: quem sustenta hoje as ferramentas jurídicas? Existe SLA formal ou é best-effort? E o time de TI tem experiência com IA?" },
    { role: "user", content: "Sustentação: 1 pessoa de TI + fornecedor DMS. Zero experiência com IA. Sem SLA formal." },
    { role: "assistant", content: "Aí temos um risco relevante — sustentabilidade pós-projeto exige runbook enxuto e treinamento. Antes de gerar o entendimento, preciso entender **riscos** que o comitê levantou. Já surgiu preocupação com alucinação, viés ou vazamento?" },
  ],
  facts: [
    { key: "metrica", value: "Tempo de pesquisa por caso (2-4h → minutos)", category: CATS.contexto_negocio },
    { key: "publico", value: "140 advogados; pico 30 concorrentes", category: CATS.contexto_negocio },
    { key: "cloud_padrao", value: "Azure enterprise (region brazilsouth obrigatório)", category: CATS.ambiente_atual },
    { key: "dms", value: "Sharepoint corporativo", category: CATS.ambiente_atual },
    { key: "volume_base", value: "80k PDFs, média 40 páginas", category: CATS.volumetria_capacidade },
    { key: "ingestao", value: "~200 documentos novos/dia", category: CATS.volumetria_capacidade },
    { key: "classificacao", value: "Público / Confidencial / Sigiloso (15% sigilosos)", category: CATS.seguranca_conformidade },
    { key: "compliance", value: "LGPD; dados PF em contratos; nada sai da infra do cliente", category: CATS.seguranca_conformidade },
    { key: "inferencia", value: "Azure OpenAI region BR aceito", category: CATS.seguranca_conformidade },
    { key: "sustentacao", value: "1 pessoa TI + fornecedor DMS; sem experiência IA", category: CATS.operacao_sustentacao },
    { key: "requisito_citacao", value: "Toda resposta com citação rastreável", category: CATS.escopo_tecnico },
    { key: "governanca_sigilo", value: "Comitê de ética valida antes de expor sigilosos", category: CATS.governanca },
  ],
  understandings: [
    {
      summary:
        "Escritório de advocacia com 140 advogados quer RAG sobre 80k contratos/pareceres em Sharepoint, rodando em Azure (BR), com citação rastreável e classificação de sigilo obrigatória. Sponsor jurídico, TI enxuto.",
      diagnosis:
        "O escopo funcional é claro e o padrão de arquitetura (Azure OpenAI + AI Search + Sharepoint indexer) é maduro. O ponto crítico é governança de sigilo — 15% da base não pode ser indexada indiscriminadamente. Sustentação com 1 pessoa é frágil; sem plano de operação e treinamento, o produto vira arqueologia em 6 meses. Preciso ainda de volumetria de queries e política de retenção de logs antes de dimensionar.",
      missing_information: [
        "Estimativa de queries/dia e política de retenção de conversas",
        "Definição do papel do comitê de ética no ciclo de indexação",
        "Requisitos de auditoria: quem consultou o quê e quando",
        "Estratégia para documentos sigilosos — indexar em índice separado ou fora do RAG?",
        "SLA desejado e horário de atendimento",
      ],
      risks: [
        "Alucinação em contexto jurídico gera dano reputacional — mitigar com citação obrigatória e disclaimer",
        "Vazamento de sigiloso via prompt injection — sanitizar contexto e isolar índice sigiloso",
        "Sustentabilidade pós-projeto — TI sem know-how em IA",
        "Custo Azure OpenAI escalar com volume de queries — necessário budget cap",
        "Comitê de ética pode vetar categorias inteiras — validar cedo",
      ],
      assumptions: [
        "Azure OpenAI Service disponível em brazilsouth atende compliance",
        "Sharepoint permanece como fonte única — sem consolidar DMS",
        "Documentos sigilosos ficarão fora do MVP",
        "Modelo base é GPT-4o class; sem fine-tuning no MVP",
      ],
      next_steps: [
        "Workshop com comitê de ética para definir política de indexação (2 sessões)",
        "POC com 500 documentos representativos e 20 queries de referência",
        "Definir métricas: recall@5 nas citações, tempo de resposta, custo por query",
        "Plano de sustentação com fornecedor externo por 6 meses pós-go-live",
        "Estimar custos de inferência em cenário base e pessimista",
      ],
      complexity: "media",
    },
  ],
  artifacts: [
    {
      kind: "prd",
      title: "PRD — RAG Jurídico Corporativo",
      content: `# PRD — RAG Jurídico Corporativo

## Contexto
Escritório com 140 advogados precisa acelerar pesquisa em 80k contratos e pareceres armazenados em Sharepoint, com respostas citando fonte original e respeitando classificação de sigilo.

## Objetivos
- Reduzir tempo médio de pesquisa jurisprudencial interna de 2-4h para < 5min em 80% dos casos.
- Entregar respostas com citação obrigatória e link para o documento fonte.
- Manter 100% da infraestrutura em Azure region brazilsouth.
- Zero incidentes de vazamento de documentos sigilosos.

## Não-objetivos
- Substituir o Sharepoint como DMS.
- Automatizar redação de peças jurídicas.
- Indexar documentos sigilosos no MVP.
- Suportar consultas de clientes externos.

## Público
Sponsor: sócio de contencioso. Usuários: 140 advogados (plenos, seniores, sócios). Guardião: comitê de ética.

## Requisitos Funcionais
- **RF1** — Ingestão contínua do Sharepoint com deduplicação e OCR.
- **RF2** — Busca semântica com retorno de trechos e citações.
- **RF3** — Interface web integrada ao SSO corporativo (Entra ID).
- **RF4** — Filtros por área do direito, ano e tipo de documento.
- **RF5** — Auditoria de consultas por advogado.

## Requisitos Não-Funcionais
- Latência p95 ≤ 6s para respostas.
- Recall@5 ≥ 0,85 em benchmark interno.
- Compliance LGPD; retenção de logs configurável.
- Custo por query ≤ R$ 0,25 no cenário base.

## Métricas
- Adoção semanal (advogados ativos / total).
- Satisfação pós-resposta (thumbs up/down).
- Tempo médio de resposta.
- Custo mensal de inferência.
- Nº de citações incorretas reportadas.

## Riscos
- Alucinação — mitigada por citação obrigatória.
- Prompt injection expondo sigilosos — isolamento de índice.
- Sustentabilidade pós-projeto — TI enxuto.
- Custo Azure OpenAI acima do previsto.
`,
    },
  ],
};

// ------------------------------------------------------------------
// Jornada 3 — Zero Trust Fintech — 30% cobertura (começo)
// ------------------------------------------------------------------
const J3: SeedJourney = {
  service_type: "Programa Zero Trust",
  title: "[DEMO] Fintech de Crédito — Zero Trust",
  briefing:
    "Fintech de crédito consignado (300 funcionários) sofreu tentativa de intrusão via credencial vazada. BC exige plano de segurança. CTO quer implementar Zero Trust em 12 meses.",
  primary_category: CATS.seguranca_conformidade,
  coverage: coverage({
    contexto_negocio: 0.7, ambiente_atual: 0.4, escopo_tecnico: 0.2,
    operacao_sustentacao: 0.1, seguranca_conformidade: 0.6, volumetria_capacidade: 0.1,
    criticidade: 0.5, governanca: 0.4, premissas_exclusoes: 0.1, riscos_validacoes: 0.3,
  }),
  messages: [
    { role: "user", content: "Preciso montar proposta de Zero Trust em uma fintech regulada. Sponsor forte, mas nunca fizeram programa desse porte." },
    { role: "assistant", content: "Boa. Zero Trust é mais programa cultural do que projeto técnico — quero começar pelo **contexto**: o gatilho foi o incidente de credencial ou tem exigência formal do BC/Bacen? Isso muda o senso de urgência e a governança." },
    { role: "user", content: "Os dois. Tentativa de intrusão em fev, e o Bacen respondeu ao RDR pedindo plano formal em 90 dias. Já foi apresentado plano macro; agora precisamos executar." },
    { role: "assistant", content: "Prazo regulatório muda tudo — governança precisa ser blindada. Sobre **ambiente atual**: qual IdP hoje (Entra ID, Okta, Google)? Existe MFA em 100% dos acessos ou parcial? Endpoints são gerenciados (MDM)?" },
    { role: "user", content: "Entra ID. MFA em 60% dos acessos (falta para produção AWS e alguns SaaS de RH). Endpoints: Intune só em 40% da frota — resto é BYOD parcial." },
    { role: "assistant", content: "Esses gaps já sugerem quick wins críticos: 100% MFA e MDM antes de qualquer segmentação. Sobre **escopo técnico**: o programa inclui rede (segmentação), identidade, endpoints, dados, aplicações — tudo? Ou tem priorização inicial?" },
  ],
  facts: [
    { key: "gatilho", value: "Intrusão + exigência Bacen (plano em 90 dias)", category: CATS.contexto_negocio },
    { key: "sponsor", value: "CTO com respaldo do comitê executivo", category: CATS.governanca },
    { key: "regulador", value: "Bacen — plano formal pós-RDR", category: CATS.seguranca_conformidade },
    { key: "idp", value: "Microsoft Entra ID", category: CATS.ambiente_atual },
    { key: "mfa_cobertura", value: "60% dos acessos", category: CATS.seguranca_conformidade },
    { key: "mdm_cobertura", value: "40% da frota via Intune (resto BYOD parcial)", category: CATS.ambiente_atual },
    { key: "prazo", value: "12 meses (marco Bacen em 90 dias)", category: CATS.contexto_negocio },
  ],
  understandings: [],
  artifacts: [],
};

// ------------------------------------------------------------------
// Jornada 4 — Data Platform Telco — 100% cobertura, human review, todos artefatos
// ------------------------------------------------------------------
const J4: SeedJourney = {
  service_type: "Modernização de Data Platform",
  title: "[DEMO] Telco Nacional — Lakehouse + Governança",
  briefing:
    "Telco top 5 nacional quer substituir DW Teradata (fim de vida) por lakehouse cloud com governança e catálogo. Base de 6PB, 400 usuários analíticos, 90 pipelines críticos. Contrato Teradata expira em 14 meses.",
  primary_category: CATS.contexto_negocio,
  coverage: coverage({
    contexto_negocio: 1, ambiente_atual: 1, escopo_tecnico: 1,
    operacao_sustentacao: 1, seguranca_conformidade: 1, volumetria_capacidade: 1,
    criticidade: 1, governanca: 1, premissas_exclusoes: 1, riscos_validacoes: 1,
  }),
  messages: [
    { role: "user", content: "Programa gigante: sair de Teradata para lakehouse em 14 meses. 6PB, 90 pipelines críticos, 400 analistas. Quero um discovery à altura." },
    { role: "assistant", content: "Escopo enorme e prazo agressivo. Começo com **contexto**: além do fim de vida do Teradata, existe pressão de custo, de time-to-insight ou de novos casos (IA, real-time)? E quem é o dono do programa — CIO, CDO ou CFO?" },
    { role: "user", content: "Dono é o CDO (novo cargo, criado ano passado). Drivers: (1) fim de contrato Teradata; (2) custo do DW cresceu 25%/ano; (3) time-to-market de novos indicadores é 45 dias em média; (4) diretoria quer casos de IA/ML monetizáveis (churn, upsell)." },
    { role: "assistant", content: "CDO como sponsor com casos de IA no radar muda a arquitetura — precisamos suportar batch, streaming e feature store. Sobre **ambiente atual**: além do Teradata, quais ferramentas de ingestão, ETL, orquestração e BI estão em uso hoje? E onde ficam as fontes primárias?" },
    { role: "user", content: "Ingestão: Informatica PowerCenter (30 pipelines) + Kafka (60 pipelines críticos em tempo real). Orquestração: Control-M. BI: MicroStrategy + Power BI (adoção em crescimento). Fontes: BSS (Oracle), OSS (Cassandra), Salesforce, Adobe Analytics, telemetria de rede (5G — HDFS on-prem)." },
    { role: "assistant", content: "Base heterogênea, típico de telco. Sobre **volumetria e capacidade**: 6PB é o tamanho atual ou projetado? Qual a taxa de crescimento anual? E qual o pico de queries concorrentes no Teradata hoje?" },
    { role: "user", content: "6PB hoje, crescendo ~2PB/ano com 5G. Pico Teradata: 3.500 queries concorrentes, top 1% de usuários (analistas de rede) consome 40% dos recursos." },
    { role: "assistant", content: "Cauda longa clássica — arquitetura precisa suportar workloads mistos. Sobre **operação e sustentação**: qual o SLA atual dos pipelines críticos? Time de plataforma tem quantas pessoas? Runbooks estão documentados?" },
    { role: "user", content: "SLA pipelines críticos: 99% (medido, entrega 97,5%). Time plataforma: 22 pessoas (dados + eng). Runbooks: parciais, dependência de conhecimento tácito de 3 seniores. Rotatividade preocupa." },
    { role: "assistant", content: "Risco operacional relevante. Sobre **segurança e conformidade**: LGPD é crítica em telco. Existe DLP, mascaramento de dados sensíveis nos ambientes analíticos? Marco Civil e outros reguladores impõem retenção mínima?" },
    { role: "user", content: "Anatel exige retenção 5 anos de metadados de chamadas. LGPD: temos DPO, mas mascaramento nos ambientes analíticos é parcial (CPF em claro em algumas visões). Auditoria PWC apontou como gap alto." },
    { role: "assistant", content: "Gap alto de LGPD precisa entrar no MVP. Sobre **governança**: existe catálogo de dados hoje? Quem aprova acesso? Qualidade de dados tem métricas?" },
    { role: "user", content: "Catálogo: nada formal, wiki desatualizada. Aprovação de acesso: manual via ticket. Qualidade: sem métricas formais, quase artesanal." },
    { role: "assistant", content: "Grande alavanca de valor — catálogo + qualidade viram diferenciador competitivo. Sobre **criticidade**: quais pipelines não podem parar 1 hora? E qual é a tolerância a downtime na migração de cada um?" },
    { role: "user", content: "Não podem parar 1h: billing (fatal), antifraude (perda), cockpit de rede (regulatório). Tolerância: janelas noturnas OK para os demais; para os 3 críticos, migração dupla-escrita obrigatória." },
    { role: "assistant", content: "Estratégia clara — strangler fig para os críticos. Sobre **riscos**: qual é o maior medo do CDO? E qual é o cenário que faria o programa ser considerado fracasso?" },
    { role: "user", content: "Medo do CDO: perder credibilidade se falhar no primeiro ano — foi ele quem propôs. Cenário de fracasso: passar dos 14 meses e Teradata precisar de renovação emergencial (custo estimado R$ 12M extra)." },
    { role: "assistant", content: "Ponto crítico — precisa de milestone irreversível bem cedo. Sobre **premissas e exclusões**: assumimos Databricks/Snowflake ou está aberto? Existe restrição de cloud provider? MicroStrategy vai junto ou é substituído?" },
    { role: "user", content: "Cloud provider é AWS (contrato enterprise). Databricks está no shortlist junto com Snowflake. MicroStrategy fica no MVP; substituição é fase 2 (fora do escopo agora)." },
    { role: "assistant", content: "Perfeito. Já tenho base robusta. Vou consolidar entendimento com **complexity: alta** e marcar **human_review_required** pelo tamanho do programa. Gera todos os artefatos (PRD, ADR, spec, user stories) para você levar ao comitê?" },
    { role: "user", content: "Sim. Gera tudo, com detalhamento máximo para a apresentação de terça." },
  ],
  facts: [
    { key: "sponsor", value: "CDO (cargo novo, credibilidade em risco)", category: CATS.governanca },
    { key: "prazo", value: "14 meses até vencimento Teradata", category: CATS.contexto_negocio },
    { key: "drivers", value: "Custo (+25%/ano), TTM 45d, casos IA/ML", category: CATS.contexto_negocio },
    { key: "custo_extra_falha", value: "R$ 12M em renovação emergencial se falhar prazo", category: CATS.riscos_validacoes },
    { key: "dw_atual", value: "Teradata (fim de vida)", category: CATS.ambiente_atual },
    { key: "ingestao", value: "Informatica (30) + Kafka (60 críticos)", category: CATS.ambiente_atual },
    { key: "orquestracao", value: "Control-M", category: CATS.ambiente_atual },
    { key: "bi", value: "MicroStrategy + Power BI (crescendo)", category: CATS.ambiente_atual },
    { key: "fontes", value: "BSS (Oracle), OSS (Cassandra), Salesforce, Adobe, HDFS (5G)", category: CATS.ambiente_atual },
    { key: "volume", value: "6PB hoje, +2PB/ano", category: CATS.volumetria_capacidade },
    { key: "concorrencia_pico", value: "3.500 queries; top 1% consome 40%", category: CATS.volumetria_capacidade },
    { key: "sla_pipelines", value: "99% (entrega 97,5%)", category: CATS.operacao_sustentacao },
    { key: "time_plataforma", value: "22 pessoas; risco de rotatividade em 3 seniores", category: CATS.operacao_sustentacao },
    { key: "runbooks", value: "Parciais; conhecimento tácito", category: CATS.operacao_sustentacao },
    { key: "retencao_anatel", value: "5 anos de metadados de chamadas", category: CATS.seguranca_conformidade },
    { key: "gap_lgpd", value: "Mascaramento parcial; CPF em claro (auditoria PWC apontou)", category: CATS.seguranca_conformidade },
    { key: "catalogo", value: "Inexistente formal (wiki desatualizada)", category: CATS.governanca },
    { key: "qualidade_dados", value: "Sem métricas; artesanal", category: CATS.governanca },
    { key: "aprovacao_acesso", value: "Manual via ticket", category: CATS.governanca },
    { key: "criticos_1h", value: "Billing, antifraude, cockpit de rede", category: CATS.criticidade },
    { key: "estrategia_criticos", value: "Dupla escrita (strangler fig)", category: CATS.escopo_tecnico },
    { key: "cloud", value: "AWS enterprise", category: CATS.premissas_exclusoes },
    { key: "plataforma_shortlist", value: "Databricks vs Snowflake", category: CATS.escopo_tecnico },
    { key: "microstrategy_mvp", value: "Mantido no MVP; substituição fase 2 (fora do escopo)", category: CATS.premissas_exclusoes },
    { key: "casos_ia_meta", value: "Churn e upsell no ano 1", category: CATS.contexto_negocio },
    { key: "auditoria_pwc", value: "Apontou gap LGPD alto", category: CATS.seguranca_conformidade },
  ],
  understandings: [
    {
      summary:
        "Telco top 5 substitui Teradata (14 meses) por lakehouse AWS com governança e catálogo. Sponsor CDO com credibilidade em risco. 6PB, 90 pipelines críticos, 400 analistas, casos de IA em churn/upsell no radar.",
      diagnosis:
        "Programa transformacional com prazo regulatório de custo (R$ 12M de renovação emergencial se falhar). Arquitetura precisa suportar batch, streaming e ML — lakehouse é adequado. Riscos principais são operacionais (rotatividade em 3 seniores, runbooks parciais) e de governança (gap LGPD apontado em auditoria). Estratégia strangler fig com dupla escrita para os 3 pipelines críticos (billing, antifraude, cockpit) é obrigatória. Escolha Databricks vs Snowflake deve considerar ML/feature store — Databricks leva vantagem se casos de IA forem prioridade real.",
      missing_information: [
        "Baseline detalhado de custo Teradata para calcular ROI",
        "Contratos com Informatica e Control-M — cláusulas de saída",
        "Skill map atual do time de plataforma vs. skill target",
        "Definição de sucesso do CDO junto ao comitê (KPIs formais)",
      ],
      risks: [
        "Prazo Teradata — sem milestone irreversível cedo, risco de renovação emergencial (R$ 12M)",
        "Rotatividade em 3 seniores de plataforma pode destravar programa",
        "Gap LGPD apontado pela PWC exige remediação no MVP — pode inflar escopo",
        "MicroStrategy dependente de estruturas Teradata — reconstrução pode atrasar entrega analítica",
        "Casos de IA como narrativa política — se não entregar 2 no ano 1, credibilidade do CDO cai",
      ],
      assumptions: [
        "AWS enterprise cobre custos negociados de compute/storage",
        "Databricks ou Snowflake atendem SLA de 99% para pipelines críticos",
        "Control-M permanece como orquestrador no MVP",
        "Casos de IA no ano 1 usam feature store da plataforma escolhida",
      ],
      next_steps: [
        "Sprint 0 (4 semanas): baseline financeiro auditado + POCs Databricks/Snowflake com 3 workloads reais",
        "Definição de arquitetura-alvo com ADRs formais aprovados pelo comitê técnico",
        "Plano de retenção de talentos para os 3 seniores críticos",
        "Roadmap de LGPD com mascaramento em produção no mês 4",
        "Contratação de parceiro de execução com SLA financeiro",
      ],
      complexity: "alta",
    },
    {
      summary:
        "Refinamento pós-oficina técnica: Databricks escolhido pelo peso dos casos de IA. Sprint 0 iniciado. Comitê aprovou baseline financeiro auditado.",
      diagnosis:
        "Escolha por Databricks fecha decisão-chave e viabiliza feature store + MLflow no mesmo stack. Baseline auditado dá previsibilidade de ROI. Ponto de atenção: parceiro de execução precisa ter SLA financeiro atrelado a marcos de migração dos pipelines críticos.",
      missing_information: [
        "Contrato do parceiro com SLA financeiro por marco",
        "Detalhamento do plano de retenção dos 3 seniores",
        "Runbooks priorizados por criticidade",
      ],
      risks: [
        "Parceiro sem SLA financeiro reduz alavanca de cobrança",
        "Migração de billing exige janela regulatória — não pode escorregar",
        "Databricks lock-in — mitigar com Delta Lake padrão e IaC portável",
      ],
      assumptions: [
        "Contrato enterprise AWS + Databricks fechado até fim do mês",
        "Casos IA priorizados: churn (Q2) e upsell (Q4)",
      ],
      next_steps: [
        "Fechar parceiro de execução em 3 semanas",
        "Kickoff formal do programa em 30 dias",
        "Publicar roadmap detalhado dos 90 pipelines com owners",
      ],
      complexity: "alta",
    },
  ],
  artifacts: [
    {
      kind: "prd",
      title: "PRD — Lakehouse & Governança Telco",
      content: `# PRD — Lakehouse & Governança Telco

## Contexto
Telco top 5 opera DW Teradata (fim de vida) com 6PB, 90 pipelines críticos e 400 analistas. Contrato expira em 14 meses. CDO (novo cargo) patrocina modernização com narrativa de casos de IA (churn/upsell) no ano 1.

## Objetivos
- Migrar 100% das cargas produtivas do Teradata para lakehouse até o mês 12, com 2 meses de buffer.
- Zero renovação de Teradata (evitar R$ 12M de custo extra).
- Reduzir tempo de disponibilização de novos indicadores de 45d para ≤ 10d.
- Entregar 2 casos de IA em produção no ano 1 (churn e upsell).
- Fechar gap LGPD apontado pela auditoria PWC até mês 6.

## Não-objetivos
- Substituir MicroStrategy neste programa.
- Consolidar OSS/BSS em fonte única.
- Refatorar pipelines Informatica que não são críticos.

## Público
Sponsor: CDO. Aprovadores: Comitê Executivo + Comitê Técnico. Beneficiários: analistas (400), áreas de negócio (marketing, rede, financeiro).

## Requisitos Funcionais
- **RF1** — Ingestão batch (Informatica) e streaming (Kafka) sobre Delta Lake.
- **RF2** — Catálogo unificado com linhagem por coluna.
- **RF3** — Camadas Bronze/Silver/Gold com governança formal.
- **RF4** — Feature store integrada para casos de ML.
- **RF5** — Interface de auto-serviço para acesso via SQL (Databricks SQL).
- **RF6** — Mascaramento LGPD em produção para dados sensíveis.

## Requisitos Não-Funcionais
- SLA 99% para pipelines críticos.
- Latência p95 ≤ 8s em queries típicas Gold.
- RPO ≤ 15min e RTO ≤ 1h para billing.
- Retenção 5 anos para dados regulados (Anatel).

## Métricas
- % de pipelines migrados por mês.
- SLA medido de pipelines críticos.
- Tempo médio de disponibilização de novos indicadores.
- Nº de casos de IA em produção.
- Custo por TB armazenado e por TB processado.

## Riscos
- Prazo Teradata inegociável (renovação = R$ 12M extra).
- Rotatividade em seniores de plataforma.
- Gap LGPD inflando escopo.
- Dependência do MicroStrategy sobre estruturas Teradata.
- Casos de IA como narrativa política.
`,
    },
    {
      kind: "adr",
      title: "ADR-001 — Escolha da Plataforma: Databricks",
      content: `# ADR-001 — Escolha da Plataforma: Databricks

## Contexto
Programa de modernização data platform com prazo de 14 meses, 6PB, 90 pipelines críticos e prioridade forte em casos de IA (churn/upsell). Duas plataformas no shortlist: Databricks e Snowflake.

## Decisão
Adotar **Databricks Lakehouse** como plataforma principal, com Delta Lake como formato padrão, MLflow como ciclo de ML e Unity Catalog para governança.

## Alternativas Consideradas
1. **Snowflake** — SQL-first mais maduro, ecossistema BI mais amplo. Descartado: ML/feature store menos integrado, workloads streaming exigem soluções externas.
2. **Redshift + Sagemaker** — barreira de integração alta, custo de operação superior, sem convergência lakehouse.
3. **Manter Teradata via upgrade** — descartado por fim de vida e custo.

## Consequências
**Positivas:** ML nativo, streaming e batch no mesmo motor, custo por TB competitivo com compute separado, Unity Catalog cobre governança e linhagem.
**Negativas:** BI puro exige camada extra (Databricks SQL evolui, mas MicroStrategy fica no MVP); risco de lock-in mitigado por Delta Lake padrão aberto e IaC portável.
**Trade-off:** priorizar aderência a casos de IA e streaming em detrimento de maturidade BI pura.
`,
    },
    {
      kind: "spec",
      title: "Spec — Arquitetura Lakehouse AWS + Databricks",
      content: `# Spec — Arquitetura Lakehouse AWS + Databricks

## Arquitetura Proposta
- **Compute**: Databricks Workspace multi-workspace (prod/hml/dev).
- **Storage**: S3 com camadas Bronze/Silver/Gold em Delta Lake.
- **Ingestão batch**: Informatica reescrito para DLT (Delta Live Tables) gradualmente.
- **Ingestão streaming**: Kafka MSK → Structured Streaming → Delta.
- **Governança**: Unity Catalog para catálogo, linhagem, permissões e mascaramento.
- **ML**: MLflow + Feature Store integrados.
- **BI**: MicroStrategy consome via Databricks SQL Warehouses (serverless).
- **Orquestração**: Control-M mantido no MVP, migração incremental para Databricks Workflows.

## Componentes
- Bronze: raw ingerido sem transformação.
- Silver: normalizado, deduplicado, LGPD-compliant.
- Gold: agregações prontas para consumo analítico.
- Feature Store: features de churn e upsell versionadas.

## Fluxos
1. Batch: Fontes → Informatica/DLT → S3 Bronze → Silver → Gold → BI/ML.
2. Streaming: Kafka → Structured Streaming → S3 Delta → Gold → Alertas/ML.
3. ML: Feature Store → MLflow → Model Serving → APIs para casos churn/upsell.

## Contratos de API
- **/api/scores/churn** — POST, autenticação Cognito, retorna score 0..1 por cliente.
- **/api/features/customer** — GET, retorna feature vector atual.

## Modelo de Dados
Camada Silver adota Data Vault 2.0 nas entidades centrais (Cliente, Serviço, Chamada) com hashkeys.

## Segurança
- Unity Catalog RBAC + row/column-level security.
- Mascaramento dinâmico de CPF, telefone e endereço fora do escopo autorizado.
- Segredos em AWS Secrets Manager.
- Logs de acesso em CloudTrail retidos 5 anos (Anatel).

## Operação
- Runbooks priorizados por criticidade.
- On-call 24×7 para pipelines críticos.
- Alertas via Slack + PagerDuty.
- SLO objetivo 99,5% para pipelines críticos.
`,
    },
    {
      kind: "user_story",
      title: "User Stories — MVP Lakehouse",
      content: `# User Stories — MVP Lakehouse

## US-01
**Como** analista de rede, **quero** consultar indicadores 5G em Gold com latência ≤ 8s **para** não perder janela de decisão operacional.
- Query benchmark passa em Databricks SQL.
- Dashboard MicroStrategy migrado sem quebra.
- Documentação de campos disponível no Unity Catalog.

## US-02
**Como** cientista de dados, **quero** publicar modelo de churn em produção via MLflow **para** entregar caso IA do ano 1.
- Pipeline treino automatizado.
- Modelo servido via Databricks Model Serving.
- Métricas de drift monitoradas semanalmente.

## US-03
**Como** DPO, **quero** que CPF apareça mascarado para usuários sem justificativa aprovada **para** fechar o gap LGPD apontado.
- Row-level policy publicada no Unity Catalog.
- Auditoria trimestral de acessos.
- Fluxo de justificativa integrado ao ticket.

## US-04
**Como** engenheiro de dados, **quero** migrar pipeline crítico com dupla escrita **para** não expor o billing a risco.
- Reconciliação diária entre Teradata e Delta.
- Rollback em < 30min caso divergência > 0,1%.
- Cutover formalizado por comitê após 14 dias estáveis.

## US-05
**Como** CDO, **quero** dashboard executivo com % de migração e status de casos IA **para** reportar ao comitê.
- Dashboard atualizado diariamente.
- Alertas de desvio semanal.
- Comparativo baseline vs. real de custo.

## US-06
**Como** analista de negócio, **quero** solicitar acesso a datasets via portal **para** não depender de ticket manual.
- Portal self-service integrado ao Unity Catalog.
- Aprovação em ≤ 24h para datasets classe pública.
- Auditoria automática de acessos concedidos.

## US-07
**Como** engenheiro de plataforma, **quero** runbook publicado para os 3 pipelines críticos **para** reduzir dependência do conhecimento tácito.
- Runbook revisado por 2 pares.
- Simulação de incidente executada trimestralmente.
- Métricas de MTTR reportadas mensalmente.
`,
    },
  ],
};

export const DEMO_JOURNEYS: SeedJourney[] = [J1, J2, J3, J4];

export const DEMO_TITLE_PREFIX = "[DEMO] ";