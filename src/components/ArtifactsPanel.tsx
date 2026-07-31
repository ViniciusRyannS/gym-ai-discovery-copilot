import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { generateArtifacts, listArtifacts } from "@/lib/conversations.functions";
import { Copy, Download, FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MarkdownView } from "@/components/MarkdownView";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  conversationId: string;
}

const KINDS = [
  { id: "prd", label: "PRD", desc: "Product Requirements" },
  { id: "adr", label: "ADR", desc: "Decisão arquitetural" },
  { id: "spec", label: "Spec", desc: "Especificação técnica" },
  { id: "user_story", label: "User Stories", desc: "5-8 histórias com critérios" },
] as const;

export function ArtifactsPanel({ open, onOpenChange, conversationId }: Props) {
  const list = useServerFn(listArtifacts);
  const gen = useServerFn(generateArtifacts);
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string[]>(["prd"]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: artifacts = [] } = useQuery({
    queryKey: ["artifacts", conversationId],
    queryFn: () => list({ data: { conversation_id: conversationId } }),
    enabled: open,
  });

  const genMut = useMutation({
    mutationFn: () => gen({ data: { conversation_id: conversationId, kinds: selected as any } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["artifacts", conversationId] });
      toast.success("Artefatos gerados");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function toggle(k: string) {
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }

  function download(a: (typeof artifacts)[number]) {
    const blob = new Blob([a.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${a.kind}-${a.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="border-b border-hairline pb-4">
          <SheetTitle className="font-display text-2xl">Artefatos</SheetTitle>
          <SheetDescription>Gere PRD, ADR, Spec ou User Stories a partir do discovery em curso.</SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {KINDS.map((k) => (
              <label
                key={k.id}
                className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-sm transition ${
                  selected.includes(k.id) ? "border-primary/50 bg-primary/5" : "border-hairline hover:border-primary/30"
                }`}
              >
                <Checkbox checked={selected.includes(k.id)} onCheckedChange={() => toggle(k.id)} className="mt-0.5" />
                <div className="min-w-0">
                  <div className="font-medium">{k.label}</div>
                  <div className="text-xs text-muted-foreground">{k.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <Button disabled={!selected.length || genMut.isPending} onClick={() => genMut.mutate()} className="w-full">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {genMut.isPending ? "Gerando…" : `Gerar ${selected.length} artefato${selected.length > 1 ? "s" : ""}`}
          </Button>
        </div>

        <div className="mt-6 space-y-2">
          {artifacts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-hairline p-6 text-center text-sm text-muted-foreground">
              Nenhum artefato ainda.
            </div>
          )}
          {artifacts.map((a) => (
            <div key={a.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{a.title}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Badge variant="outline" className="font-mono-tabular text-[10px]">{a.kind}</Badge>
                      <span>{new Date(a.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(a.content); toast.success("Copiado"); }}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => download(a)}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                className="mt-2 text-xs text-primary hover:underline"
              >
                {expanded === a.id ? "Ocultar preview" : "Ver preview"}
              </button>
              {expanded === a.id && (
                <div className="mt-3 max-h-80 overflow-y-auto rounded-lg border border-hairline bg-surface/50 p-4">
                  <MarkdownView content={a.content} />
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}