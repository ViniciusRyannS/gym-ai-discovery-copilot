import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  FileCode2,
  FileText,
  Gauge,
  Lightbulb,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo guiada | Gym.AI" },
      {
        name: "description",
        content:
          "Veja como o Gym.AI transforma um briefing incompleto em discovery estruturado, entendimento executivo e artefatos.",
      },
    ],
  }),
  component: PublicDemo,
});

const steps = [
  { label: "Briefing", eyebrow: "O problema" },
  { label: "Perguntas", eyebrow: "Discovery" },
  { label: "Cobertura", eyebrow: "Clareza" },
  { label: "Entendimento", eyebrow: "Decisão" },
  { label: "Artefatos", eyebrow: "Entrega" },
];

const categories = [
  { label: "Contexto de negócio", before: 42, after: 95 },
  { label: "Ambiente atual", before: 18, after: 90 },
  { label: "Escopo técnico", before: 12, after: 88 },
  { label: "Operação", before: 8, after: 84 },
  { label: "Segurança", before: 0, after: 80 },
  { label: "Volumetria", before: 0, after: 92 },
  { label: "Criticidade", before: 15, after: 90 },
  { label: "Governança", before: 22, after: 76 },
  { label: "Premissas", before: 5, after: 82 },
  { label: "Riscos", before: 0, after: 78 },
];

const questions = [
  {
    category: "Contexto de negócio",
    question:
      "Além do reajuste do datacenter, qual resultado precisa justificar o programa para o Comitê Executivo?",
    answer: "Reduzir 30% do OPEX no segundo ano e eliminar as quedas que já afetaram as lojas.",
    insight: "Meta mensurável + fórum decisor identificados",
  },
  {
    category: "Ambiente atual",
    question: "Quais integrações tornam o ERP crítico para a operação das 180 lojas?",
    answer: "PDVs sincronizam via MPLS; há integrações com WMS, SEFAZ e três adquirentes.",
    insight: "Dependências críticas e superfície de migração mapeadas",
  },
  {
    category: "Volumetria e criticidade",
    question: "Qual é o pico real e o impacto de indisponibilidade durante o cutover?",
    answer: "4.200 pedidos/hora na Black Friday. Uma falha no sync PDV–ERP pode paralisar vendas.",
    insight: "Capacidade e risco operacional quantificados",
  },
];

const artifacts = [
  {
    id: "prd",
    label: "PRD",
    title: "Migração AWS — Varejista Nordeste",
    icon: FileText,
    preview: [
      "Objetivo e métricas de sucesso",
      "Escopo e não escopo",
      "Requisitos e critérios de aceite",
    ],
  },
  {
    id: "adr",
    label: "ADR",
    title: "Estratégia de migração e coexistência",
    icon: Lightbulb,
    preview: [
      "Contexto da decisão",
      "Alternativas consideradas",
      "Decisão, consequências e riscos",
    ],
  },
  {
    id: "spec",
    label: "SPEC",
    title: "Landing zone e cutover assistido",
    icon: FileCode2,
    preview: ["Arquitetura alvo", "Fluxos e integrações", "Observabilidade e rollback"],
  },
  {
    id: "stories",
    label: "STORIES",
    title: "Backlog inicial do programa",
    icon: Users,
    preview: ["Histórias orientadas a valor", "Critérios verificáveis", "Dependências explícitas"],
  },
];

function PublicDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [activeArtifact, setActiveArtifact] = useState("prd");
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 hero-glow" />
      <div className="pointer-events-none fixed -right-52 top-1/3 h-[32rem] w-[32rem] rounded-full bg-primary/8 blur-[120px]" />

      <header className="relative z-20 border-b border-hairline bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Gym.AI">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-primary/30 bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Gym.AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-hairline bg-surface/70 px-3 py-1.5 text-[11px] text-muted-foreground sm:inline">
              Ambiente demonstrativo · dados simulados
            </span>
            <Link
              to="/auth"
              search={{ next: "" }}
              className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
            >
              Acessar produto
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-8 sm:px-8 sm:pt-12">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-8 bg-primary/70" />
              Demo guiada · 4 minutos
            </div>
            <h1 className="max-w-3xl font-display text-4xl leading-[0.98] sm:text-6xl">
              De um briefing vago a uma{" "}
              <span className="italic text-primary">decisão defensável.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Acompanhe como o copiloto organiza o discovery técnico-comercial sem substituir o
              julgamento de quem conduz a oportunidade.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface/50 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs font-medium">Humano no loop</div>
              <div className="text-[11px] text-muted-foreground">
                Toda saída exige validação profissional
              </div>
            </div>
          </div>
        </section>

        <nav aria-label="Etapas da demonstração" className="mb-5 overflow-x-auto pb-1">
          <ol className="grid min-w-[680px] grid-cols-5 gap-2">
            {steps.map((step, index) => (
              <li key={step.label}>
                <button
                  type="button"
                  onClick={() => setActiveStep(index)}
                  aria-current={activeStep === index ? "step" : undefined}
                  className={`group w-full rounded-2xl border px-4 py-3 text-left transition ${
                    activeStep === index
                      ? "border-primary/45 bg-primary/10"
                      : index < activeStep
                        ? "border-hairline bg-surface/55"
                        : "border-transparent bg-surface/25 hover:border-hairline"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      0{index + 1}
                    </span>
                    {index < activeStep && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <div className="mt-2 text-sm font-medium">{step.label}</div>
                  <div className="text-[10px] text-muted-foreground">{step.eyebrow}</div>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mb-6 h-px overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <section className="min-h-[560px] rounded-[2rem] border border-hairline bg-surface/35 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
          {activeStep === 0 && <BriefingStep />}
          {activeStep === 1 && (
            <QuestionsStep activeQuestion={activeQuestion} setActiveQuestion={setActiveQuestion} />
          )}
          {activeStep === 2 && <CoverageStep />}
          {activeStep === 3 && <UnderstandingStep />}
          {activeStep === 4 && (
            <ArtifactsStep activeArtifact={activeArtifact} setActiveArtifact={setActiveArtifact} />
          )}
        </section>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
            disabled={activeStep === 0}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-0"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep((step) => Math.min(steps.length - 1, step + 1))}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110"
            >
              Continuar <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              to="/auth"
              search={{ next: "" }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110"
            >
              Experimentar o Gym.AI <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

function PanelTitle({
  icon: Icon,
  kicker,
  title,
  description,
}: {
  icon: typeof Target;
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7 flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </span>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
          {kicker}
        </div>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function BriefingStep() {
  const known = ["180 lojas", "Oracle EBS + Magento", "Prazo de 10 meses"];
  const missing = [
    "Critério de sucesso",
    "Integrações críticas",
    "Picos de carga",
    "SLA e rollback",
  ];

  return (
    <div>
      <PanelTitle
        icon={CircleAlert}
        kicker="Entrada recebida"
        title="O briefing parece completo. Não está."
        description="Informação suficiente para iniciar uma conversa, insuficiente para estimar escopo, risco ou investimento com segurança."
      />
      <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-3xl border border-hairline bg-background/45 p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">briefing_cliente.md</span>
            <span className="rounded-full bg-warn/10 px-2.5 py-1 font-mono text-[10px] text-warn">
              INCOMPLETO
            </span>
          </div>
          <p className="font-display text-2xl leading-snug sm:text-3xl">
            “Somos uma rede com 180 lojas e precisamos migrar nosso ERP Oracle e o e-commerce para
            AWS antes do vencimento do datacenter, em 10 meses.”
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {known.map((item) => (
              <span
                key={item}
                className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs"
              >
                <Check className="mr-1.5 inline h-3 w-3 text-primary" /> {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-warn/15 bg-warn/[0.035] p-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Gauge className="h-4 w-4 text-warn" /> Cobertura inicial
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="font-mono text-5xl">12</span>
            <span className="mb-1 text-sm text-muted-foreground">/ 100</span>
          </div>
          <div className="mt-5 h-1.5 rounded-full bg-white/5">
            <div className="h-full w-[12%] rounded-full bg-warn" />
          </div>
          <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">
            O que ainda não sabemos
          </p>
          <ul className="mt-3 space-y-2.5">
            {missing.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-warn" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function QuestionsStep({
  activeQuestion,
  setActiveQuestion,
}: {
  activeQuestion: number;
  setActiveQuestion: (value: number) => void;
}) {
  const item = questions[activeQuestion];
  return (
    <div>
      <PanelTitle
        icon={MessageSquareText}
        kicker="Perguntas adaptativas"
        title="Cada resposta abre a próxima camada."
        description="O Gym.AI não aplica um checklist cego: usa o contexto já capturado para perguntar o que reduz incerteza e risco."
      />
      <div className="grid gap-4 lg:grid-cols-[.38fr_1fr]">
        <div className="space-y-2">
          {questions.map((question, index) => (
            <button
              type="button"
              key={question.category}
              onClick={() => setActiveQuestion(index)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                activeQuestion === index
                  ? "border-primary/40 bg-primary/10"
                  : "border-hairline bg-background/25 hover:bg-white/[0.03]"
              }`}
            >
              <span className="font-mono text-[10px] text-primary">PERGUNTA 0{index + 1}</span>
              <div className="mt-1 text-sm font-medium">{question.category}</div>
            </button>
          ))}
        </div>
        <div className="rounded-3xl border border-hairline bg-background/45 p-5 sm:p-8">
          <div className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-xs font-bold text-primary-foreground">
              AI
            </span>
            <div className="rounded-2xl rounded-tl-sm bg-surface-elevated p-4 text-sm leading-6 sm:text-base">
              {item.question}
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <div className="max-w-[88%] rounded-2xl rounded-tr-sm border border-hairline bg-white/[0.035] p-4 text-sm leading-6">
              {item.answer}
            </div>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-hairline bg-surface text-xs">
              VC
            </span>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/[0.06] p-4">
            <Target className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-primary">
                Insight capturado
              </div>
              <div className="mt-1 text-sm">{item.insight}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverageStep() {
  return (
    <div>
      <PanelTitle
        icon={Gauge}
        kicker="Cobertura em tempo real"
        title="Clareza visível, não sensação de completude."
        description="As 10 dimensões tornam lacunas explícitas. Cobertura orienta a conversa; não é uma garantia automática de qualidade."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_.42fr]">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {categories.map((category) => (
            <div key={category.label}>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span>{category.label}</span>
                <span className="font-mono text-primary">{category.after}%</span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-white/15"
                  style={{ width: `${category.before}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-700"
                  style={{ width: `${category.after}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between rounded-3xl border border-primary/20 bg-primary/[0.055] p-6">
          <div>
            <div className="text-xs text-muted-foreground">Cobertura consolidada</div>
            <div className="mt-3 font-mono text-6xl">
              85<span className="text-2xl text-primary">%</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
              Base suficiente para consolidar
            </div>
          </div>
          <div className="mt-8 border-t border-hairline pt-5">
            <div className="text-xs font-medium">Atenção direcionada</div>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">
              Governança e riscos permanecem abaixo de 80%. O entendimento registrará essas lacunas
              — não as esconderá.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnderstandingStep() {
  return (
    <div>
      <PanelTitle
        icon={Target}
        kicker="Entendimento Executivo · v1"
        title="Da conversa para uma visão compartilhada."
        description="Fatos, hipóteses, riscos e próximos passos são separados para que comercial, técnico e cliente validem a mesma leitura."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-hairline bg-background/45 p-6">
          <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
            Síntese
          </span>
          <p className="mt-3 text-base leading-7">
            A rede precisa migrar Oracle EBS e Magento 2 para AWS em 10 meses, limitada a R$ 4,2
            milhões no primeiro ano e comprometida com 30% de redução de OPEX no segundo.
          </p>
          <span className="mt-7 block font-mono text-[10px] uppercase tracking-wider text-primary">
            Diagnóstico
          </span>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            O prazo é viável, mas o sincronismo PDV–ERP torna um cutover big-bang inadequado. A
            hipótese recomendada combina coexistência controlada, piloto por perfil de loja e
            rollback assistido.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <UnderstandingCard
            title="Riscos"
            tone="warn"
            items={[
              "Falha de sync paralisa vendas",
              "Licenciamento Oracle pode alterar TCO",
              "Meta de OPEX sem baseline auditável",
            ]}
          />
          <UnderstandingCard
            title="Próximos passos"
            tone="primary"
            items={["Assessment de licenças", "Piloto em 5 lojas", "ADR da arquitetura-alvo"]}
          />
          <div className="sm:col-span-2 flex items-start gap-3 rounded-2xl border border-hairline bg-white/[0.025] p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs leading-5 text-muted-foreground">
              Conteúdo gerado como apoio à decisão. Premissas e recomendações devem ser revisadas
              pelo time responsável antes de compor proposta ou compromisso contratual.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnderstandingCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "warn" | "primary";
}) {
  return (
    <div className="rounded-3xl border border-hairline bg-background/35 p-5">
      <div className={`text-sm font-medium ${tone === "warn" ? "text-warn" : "text-primary"}`}>
        {title}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-5 text-muted-foreground">
            <span
              className={`mt-2 h-1 w-1 shrink-0 rounded-full ${tone === "warn" ? "bg-warn" : "bg-primary"}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArtifactsStep({
  activeArtifact,
  setActiveArtifact,
}: {
  activeArtifact: string;
  setActiveArtifact: (value: string) => void;
}) {
  const selected = artifacts.find((artifact) => artifact.id === activeArtifact) ?? artifacts[0];
  const Icon = selected.icon;
  return (
    <div>
      <PanelTitle
        icon={FileText}
        kicker="Saídas acionáveis"
        title="O discovery não termina em uma transcrição."
        description="O contexto validado alimenta artefatos consistentes para produto, arquitetura e engenharia — sempre como rascunhos revisáveis."
      />
      <div className="grid gap-4 lg:grid-cols-[.42fr_1fr]">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {artifacts.map((artifact) => {
            const ArtifactIcon = artifact.icon;
            return (
              <button
                type="button"
                key={artifact.id}
                onClick={() => setActiveArtifact(artifact.id)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  activeArtifact === artifact.id
                    ? "border-primary/40 bg-primary/10"
                    : "border-hairline bg-background/25 hover:bg-white/[0.03]"
                }`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5">
                  <ArtifactIcon className="h-4 w-4 text-primary" />
                </span>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] text-primary">{artifact.label}</div>
                  <div className="truncate text-xs text-muted-foreground">{artifact.title}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="overflow-hidden rounded-3xl border border-hairline bg-[#11121a]">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="h-4 w-4 text-primary" /> {selected.id}.md
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-[9px] text-primary">
              RASCUNHO
            </span>
          </div>
          <div className="p-6 sm:p-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              {selected.label}
            </div>
            <h3 className="mt-2 font-display text-3xl">{selected.title}</h3>
            <div className="mt-7 space-y-3">
              {selected.preview.map((line, index) => (
                <div
                  key={line}
                  className="flex items-center gap-3 rounded-xl border border-hairline bg-white/[0.025] px-4 py-3"
                >
                  <span className="font-mono text-[10px] text-primary">0{index + 1}</span>
                  <span className="text-sm">{line}</span>
                  <Check className="ml-auto h-3.5 w-3.5 text-primary" />
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
              <span className="text-xs text-muted-foreground">
                Derivado de 19 fatos e 10 categorias
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Pronto para revisão
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
