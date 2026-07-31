import { useEffect, useState } from "react";
import { Check, Copy, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { MarkdownView } from "@/components/MarkdownView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type DemoArtifact, type DemoArtifactKind } from "@/lib/demo-mode/deliverables";
import { generateDemoArtifacts, getDemoConversation } from "@/lib/demo-mode/store";

const KINDS: Array<{ id: DemoArtifactKind; label: string; description: string }> = [
  { id: "prd", label: "PRD", description: "Requisitos e métricas" },
  { id: "adr", label: "ADR", description: "Decisão arquitetural" },
  { id: "spec", label: "Spec", description: "Especificação técnica" },
  { id: "user_story", label: "User Stories", description: "Histórias e critérios" },
];

export function LocalArtifactsPanel({
  open,
  onOpenChange,
  conversationId,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  conversationId: string;
}) {
  const [selected, setSelected] = useState<DemoArtifactKind[]>([
    "prd",
    "adr",
    "spec",
    "user_story",
  ]);
  const [artifacts, setArtifacts] = useState<DemoArtifact[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  function refresh() {
    setArtifacts(getDemoConversation(conversationId).artifacts);
  }

  useEffect(() => {
    if (open) setArtifacts(getDemoConversation(conversationId).artifacts);
  }, [open, conversationId]);

  function toggle(kind: DemoArtifactKind) {
    setSelected((current) =>
      current.includes(kind) ? current.filter((item) => item !== kind) : [...current, kind],
    );
  }

  function generate() {
    generateDemoArtifacts(conversationId, selected);
    refresh();
    toast.success(`${selected.length} artefato(s) demonstrativo(s) gerado(s)`);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="border-b border-hairline pb-4">
          <div>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 font-mono-tabular text-[9px] text-primary">
              DEMO LOCAL
            </span>
          </div>
          <SheetTitle className="font-display text-2xl">Artefatos</SheetTitle>
          <SheetDescription>
            Templates locais derivados do briefing e das respostas registradas.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {KINDS.map((kind) => (
            <button
              type="button"
              key={kind.id}
              onClick={() => toggle(kind.id)}
              className={`flex items-start gap-2 rounded-xl border p-3 text-left transition ${
                selected.includes(kind.id)
                  ? "border-primary/40 bg-primary/[0.07]"
                  : "border-hairline"
              }`}
            >
              <Checkbox checked={selected.includes(kind.id)} className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium">{kind.label}</span>
                <span className="block text-[11px] text-muted-foreground">{kind.description}</span>
              </span>
            </button>
          ))}
        </div>

        <Button onClick={generate} disabled={!selected.length} className="mt-3 w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          Gerar {selected.length} artefato(s)
        </Button>

        <div className="mt-6 space-y-3">
          {artifacts.map((artifact) => (
            <div key={artifact.id} className="rounded-2xl border border-hairline bg-surface/40 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{artifact.title}</div>
                  <Badge variant="outline" className="mt-1 text-[9px]">
                    {artifact.kind}
                  </Badge>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(artifact.content);
                    toast.success("Markdown copiado");
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(expanded === artifact.id ? null : artifact.id)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary"
              >
                {expanded === artifact.id && <Check className="h-3 w-3" />}
                {expanded === artifact.id ? "Ocultar preview" : "Ver preview"}
              </button>
              {expanded === artifact.id && (
                <div className="mt-3 max-h-96 overflow-y-auto rounded-xl border border-hairline bg-background/60 p-4">
                  <MarkdownView content={artifact.content} />
                </div>
              )}
            </div>
          ))}
          {!artifacts.length && (
            <div className="rounded-2xl border border-dashed border-hairline p-6 text-center text-sm text-muted-foreground">
              Nenhum artefato local gerado.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
