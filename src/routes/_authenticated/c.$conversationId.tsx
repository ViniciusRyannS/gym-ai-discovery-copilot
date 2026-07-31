import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ArrowUp, Check, Copy, FileText, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AttachTextFile } from "@/components/AttachTextFile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CoverageCockpit } from "@/components/CoverageCockpit";
import { MarkdownView } from "@/components/MarkdownView";
import { UnderstandingDrawer } from "@/components/UnderstandingDrawer";
import { ArtifactsPanel } from "@/components/ArtifactsPanel";
import { LocalArtifactsPanel } from "@/components/demo/LocalArtifactsPanel";
import { LocalUnderstandingDrawer } from "@/components/demo/LocalUnderstandingDrawer";
import { normalizeAssistantContent } from "@/lib/normalize-reply";
import { deleteConversation, getConversation, sendMessage } from "@/lib/conversations.functions";
import { EMPTY_COVERAGE } from "@/lib/discovery-defaults";
import { useNavigate } from "@tanstack/react-router";
import { getDemoSession } from "@/lib/demo-mode/auth";
import {
  deleteDemoConversation,
  type DemoConversationDetail,
  getDemoConversation,
  sendDemoMessage,
} from "@/lib/demo-mode/store";

export const Route = createFileRoute("/_authenticated/c/$conversationId")({
  component: ChatPage,
});

function ChatMessage({ role, content }: { role: string; content: string }) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";
  const rendered = isUser ? content : normalizeAssistantContent(content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`group flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`font-mono-tabular text-[10px] uppercase tracking-widest ${
          isUser ? "text-muted-foreground" : "text-primary"
        }`}
      >
        {isUser ? "Você" : "Gym.AI"}
      </div>
      {isUser ? (
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-sm">
          {content}
        </div>
      ) : (
        <div className="w-full max-w-none">
          <MarkdownView content={rendered} />
          <div className="mt-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(rendered);
                setCopied(true);
                setTimeout(() => setCopied(false), 1400);
              }}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-mono-tabular uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "copiado" : "copiar"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ThinkingShimmer() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="inline-block h-3 w-1 animate-pulse rounded-sm bg-primary" />
      <span className="shimmer-text bg-clip-text text-transparent">pensando…</span>
    </div>
  );
}

function ChatPage() {
  const { conversationId } = Route.useParams();
  const isDemo = Boolean(getDemoSession());
  const get = useServerFn(getConversation);
  const send = useServerFn(sendMessage);
  const del = useServerFn(deleteConversation);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const conversationQueryKey = [
    "conversation",
    conversationId,
    isDemo ? "demo" : "online",
  ] as const;

  const { data, isLoading } = useQuery<DemoConversationDetail>({
    queryKey: conversationQueryKey,
    queryFn: async () => {
      if (isDemo) return getDemoConversation(conversationId);
      const result = await get({ data: { id: conversationId } });
      return {
        conversation: result.conversation,
        messages: result.messages,
        state: {
          coverage_by_category:
            (result.state?.coverage_by_category as Record<string, number> | undefined) ??
            EMPTY_COVERAGE,
          primary_category: result.state?.primary_category ?? "contexto_negocio",
        },
        understandings: [],
        artifacts: [],
      };
    },
  });

  const [input, setInput] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [artifactsOpen, setArtifactsOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const sendMut = useMutation<void, Error, string>({
    mutationFn: async (content: string) => {
      if (isDemo) {
        sendDemoMessage(conversationId, content);
        return;
      }
      await send({ data: { conversation_id: conversationId, content } });
    },
    onMutate: (content) => {
      qc.setQueryData<DemoConversationDetail>(
        conversationQueryKey,
        (prev) =>
          prev && {
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: `optimistic-${Date.now()}`,
                role: "user",
                content,
                created_at: new Date().toISOString(),
              },
            ],
          },
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversation", conversationId] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation<void, Error, void>({
    mutationFn: async () => {
      if (isDemo) {
        deleteDemoConversation(conversationId);
        return;
      }
      await del({ data: { id: conversationId } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      navigate({ to: "/app" });
    },
  });

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [data?.messages.length, sendMut.isPending]);

  const coverage =
    (data?.state?.coverage_by_category as Record<string, number> | undefined) ?? EMPTY_COVERAGE;
  const overall =
    Object.values(coverage).reduce((a, b) => a + b, 0) / Object.keys(EMPTY_COVERAGE).length;

  function submit() {
    const v = input.trim();
    if (!v || sendMut.isPending) return;
    setInput("");
    sendMut.mutate(v);
  }

  return (
    <div className="flex h-full min-w-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-hairline px-6 py-3">
          <div className="min-w-0">
            <div className="truncate font-display text-lg">{data?.conversation.title ?? "…"}</div>
            <div className="truncate text-xs text-muted-foreground">
              {data?.conversation.service_type}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1 font-mono-tabular text-xs text-muted-foreground sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px] shadow-primary" />
              {(overall * 100).toFixed(0)}% cobertura
            </div>
            <Button size="sm" variant="outline" onClick={() => setDrawerOpen(true)}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Entendimento
            </Button>
            <Button size="sm" variant="outline" onClick={() => setArtifactsOpen(true)}>
              <FileText className="mr-1.5 h-3.5 w-3.5" /> Artefatos
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => deleteMut.mutate()}
              title="Descartar"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </header>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-8">
            {isLoading && <div className="text-sm text-muted-foreground">Carregando…</div>}
            {data?.messages.length === 0 && (
              <div className="glass rounded-2xl p-5 text-sm text-muted-foreground">
                <div className="mb-2 font-mono-tabular text-[10px] uppercase tracking-widest text-primary">
                  Briefing
                </div>
                {data.conversation.briefing}
                <div className="mt-3 text-xs">
                  Envie sua primeira mensagem para começar. O motor conduzirá o discovery.
                </div>
              </div>
            )}
            <div className="flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {data?.messages.map((m) => (
                  <ChatMessage key={m.id} role={m.role} content={m.content} />
                ))}
              </AnimatePresence>
              {sendMut.isPending && (
                <div className="flex flex-col gap-1">
                  <div className="font-mono-tabular text-[10px] uppercase tracking-widest text-primary">
                    Gym.AI
                  </div>
                  <ThinkingShimmer />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-hairline">
          <div className="mx-auto max-w-3xl px-6 py-4">
            <div className="glass rounded-2xl p-2">
              <div className="flex items-end gap-2 pr-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
                  }}
                  placeholder="Responda a última pergunta ou traga contexto novo…  (⌘/Ctrl + Enter)"
                  className="min-h-[48px] resize-none border-0 bg-transparent p-2 focus-visible:ring-0"
                />
                <Button size="icon" onClick={submit} disabled={sendMut.isPending || !input.trim()}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-start px-1 pb-1">
                <AttachTextFile
                  label="Anexar contexto (.txt / .md)"
                  onText={(text, filename) =>
                    setInput((prev) => (prev ? `${prev}\n\n--- ${filename} ---\n${text}` : text))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="hidden w-[340px] shrink-0 border-l border-hairline p-5 lg:block">
        <CoverageCockpit coverage={coverage} primaryCategory={data?.state?.primary_category} />
      </aside>

      {isDemo ? (
        <>
          <LocalUnderstandingDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            conversationId={conversationId}
          />
          <LocalArtifactsPanel
            open={artifactsOpen}
            onOpenChange={setArtifactsOpen}
            conversationId={conversationId}
          />
        </>
      ) : (
        <>
          <UnderstandingDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            conversationId={conversationId}
          />
          <ArtifactsPanel
            open={artifactsOpen}
            onOpenChange={setArtifactsOpen}
            conversationId={conversationId}
          />
        </>
      )}
    </div>
  );
}
