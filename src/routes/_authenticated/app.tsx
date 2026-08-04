import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Sparkles, ArrowRight, MessageSquareText, Wand2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AttachTextFile } from "@/components/AttachTextFile";
import { Label } from "@/components/ui/label";
import { listPortfolio } from "@/lib/portfolio.functions";
import { createConversation } from "@/lib/conversations.functions";
import { listConversations } from "@/lib/conversations.functions";
import { hasDemoData, seedDemoData, wipeDemoData } from "@/lib/demo.functions";
import { getDemoSession } from "@/lib/demo-mode/auth";
import {
  createDemoConversation,
  listDemoConversations,
  listDemoPortfolio,
  openCompleteDemoConversation,
} from "@/lib/demo-mode/store";

export const Route = createFileRoute("/_authenticated/app")({
  component: Home,
});

function Home() {
  const isDemo = Boolean(getDemoSession());
  const list = useServerFn(listPortfolio);
  const create = useServerFn(createConversation);
  const listConv = useServerFn(listConversations);
  const hasDemo = useServerFn(hasDemoData);
  const seed = useServerFn(seedDemoData);
  const wipe = useServerFn(wipeDemoData);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: portfolio = [] } = useQuery({
    queryKey: ["portfolio", isDemo ? "demo" : "online"],
    queryFn: () => (isDemo ? Promise.resolve(listDemoPortfolio()) : list()),
  });

  const { data: convs = [] } = useQuery({
    queryKey: ["conversations", isDemo ? "demo" : "online"],
    queryFn: () => (isDemo ? Promise.resolve(listDemoConversations()) : listConv()),
  });
  const { data: demoStatus } = useQuery({
    queryKey: ["demo-status"],
    queryFn: () => hasDemo(),
    enabled: !isDemo,
  });

  const seedMut = useMutation({
    mutationFn: () => seed(),
    onSuccess: (r) => {
      toast.success(
        `Demo carregada: ${r.created.conversations} jornadas, ${r.created.messages} mensagens.`,
      );
      qc.invalidateQueries({ queryKey: ["conversations"] });
      qc.invalidateQueries({ queryKey: ["demo-status"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const wipeMut = useMutation({
    mutationFn: () => wipe(),
    onSuccess: (r) => {
      toast.success(`${r.deleted} jornadas de demo removidas.`);
      qc.invalidateQueries({ queryKey: ["conversations"] });
      qc.invalidateQueries({ queryKey: ["demo-status"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [serviceType, setServiceType] = useState("");
  const [briefing, setBriefing] = useState("");
  const [title, setTitle] = useState("");

  const createMut = useMutation({
    mutationFn: (v: { service_type: string; briefing: string; title: string }) =>
      isDemo ? Promise.resolve(createDemoConversation(v)) : create({ data: v }),
    onSuccess: (conv) => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      navigate({ to: "/c/$conversationId", params: { conversationId: conv.id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exampleMut = useMutation({
    mutationFn: () => Promise.resolve(openCompleteDemoConversation()),
    onSuccess: (conversation) => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      navigate({ to: "/c/$conversationId", params: { conversationId: conversation.id } });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function pick(name: string) {
    setServiceType(name);
    if (!title) setTitle(name);
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[380px] hero-glow" />
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono-tabular uppercase tracking-[0.2em]">Novo discovery</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display mt-4 text-5xl leading-[1.02] tracking-tight text-foreground sm:text-6xl"
        >
          Qual serviço você vai <em className="text-primary">descobrir</em> hoje?
        </motion.h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          O copiloto conduz o discovery em 10 categorias — do contexto de negócio aos riscos — e
          organiza Entendimento Executivo e artefatos para revisão profissional.
        </p>

        {isDemo && (
          <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/[0.06] p-4 text-xs leading-5 text-muted-foreground">
            <div>
              <span className="font-medium text-primary">MODO DEMO</span> · Seus dados ficam somente
              neste navegador e as respostas do chat são simuladas para uma apresentação previsível.
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl">
                Quer ver o resultado primeiro? Abra um caso completo sobre retrabalho na produção,
                com conversa, cobertura, entendimento e artefatos já preparados.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={exampleMut.isPending}
                onClick={() => exampleMut.mutate()}
                className="shrink-0 border-primary/40 text-foreground"
              >
                <MessageSquareText className="mr-1.5 h-3.5 w-3.5 text-primary" />
                {exampleMut.isPending ? "Preparando exemplo…" : "Abrir conversa exemplo"}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {!isDemo && !demoStatus?.has && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={seedMut.isPending}
              onClick={() => seedMut.mutate()}
              className="border-primary/40 text-foreground"
            >
              <Wand2 className="mr-1.5 h-3.5 w-3.5 text-primary" />
              {seedMut.isPending ? "Carregando jornadas…" : "Carregar 4 jornadas de demonstração"}
            </Button>
          )}
          {!isDemo && demoStatus?.has && convs.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={wipeMut.isPending}
              onClick={() => wipeMut.mutate()}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              {wipeMut.isPending ? "Limpando…" : "Limpar jornadas de demo"}
            </Button>
          )}
          {!isDemo && demoStatus?.has && (
            <span className="font-mono-tabular text-[10px] uppercase tracking-widest text-muted-foreground">
              {demoStatus.count} jornada(s) [DEMO] ativas
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {portfolio
            .filter((p) => p.is_active)
            .map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => pick(p.name)}
                className={`glass rounded-full px-3.5 py-1.5 text-xs transition hover:border-primary/40 hover:text-foreground ${
                  serviceType === p.name
                    ? "border-primary/60 text-foreground shadow-[var(--shadow-glow)]"
                    : "text-muted-foreground"
                }`}
              >
                <span className="mr-1.5 font-mono-tabular text-[10px] uppercase tracking-wider text-muted-foreground">
                  {p.category}
                </span>
                {p.name}
              </button>
            ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!serviceType || !briefing || !title) return toast.error("Preencha os três campos");
            createMut.mutate({ service_type: serviceType, briefing, title });
          }}
          className="mt-8 space-y-4 glass rounded-3xl p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="service">Serviço proposto</Label>
              <Input
                id="service"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="Ex: Migração Cloud AWS"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title">Título do discovery</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Cliente X — nome interno"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="briefing">Briefing inicial</Label>
              <AttachTextFile
                onText={(text, filename) =>
                  setBriefing((prev) => (prev ? `${prev}\n\n--- ${filename} ---\n${text}` : text))
                }
              />
            </div>
            <Textarea
              id="briefing"
              rows={5}
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              placeholder="O que você já sabe do cliente, do problema e do timing. Quanto mais contexto, mais preciso o discovery."
            />
          </div>
          <Button type="submit" disabled={createMut.isPending} className="group w-full sm:w-auto">
            {createMut.isPending ? "Preparando..." : "Iniciar discovery"}
            <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-0.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
