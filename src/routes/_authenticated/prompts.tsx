import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, History, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AttachTextFile } from "@/components/AttachTextFile";
import { Badge } from "@/components/ui/badge";
import { activatePromptVersion, getActivePrompt, savePromptVersion } from "@/lib/prompts.functions";

export const Route = createFileRoute("/_authenticated/prompts")({
  component: Prompts,
});

function Prompts() {
  const get = useServerFn(getActivePrompt);
  const save = useServerFn(savePromptVersion);
  const activate = useServerFn(activatePromptVersion);
  const qc = useQueryClient();

  const { data } = useQuery({ queryKey: ["prompt"], queryFn: () => get() });
  const [draft, setDraft] = useState("");

  const active =
    data?.versions.find((v) => v.id === data.prompt.active_version_id) ?? data?.versions[0];

  useEffect(() => {
    if (active && !draft) setDraft(active.content);
  }, [active, draft]);

  const saveMut = useMutation({
    mutationFn: () => save({ data: { content: draft } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prompt"] });
      toast.success("Nova versão salva e ativada");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const actMut = useMutation({
    mutationFn: (id: string) => activate({ data: { version_id: id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prompt"] });
      toast.success("Versão ativada");
    },
  });

  return (
    <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="space-y-3">
        <div>
          <div className="font-mono-tabular text-[10px] uppercase tracking-widest text-primary">
            Timeline
          </div>
          <h2 className="font-display text-2xl">Versões</h2>
        </div>
        <div className="space-y-1.5">
          {data?.versions.map((v) => (
            <button
              key={v.id}
              onClick={() => setDraft(v.content)}
              className="glass w-full rounded-xl p-3 text-left transition hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono-tabular text-xs">v{v.version_number}</span>
                  {v.id === data.prompt.active_version_id && (
                    <Badge variant="outline" className="border-primary/40 text-primary text-[10px]">
                      ativa
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(v.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                {v.content.slice(0, 120)}…
              </div>
              {v.id !== data.prompt.active_version_id && (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    actMut.mutate(v.id);
                  }}
                  className="mt-2 inline-flex cursor-pointer items-center gap-1 text-[10px] text-primary hover:underline"
                >
                  <CheckCircle2 className="h-3 w-3" /> ativar
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-h-0 flex-col gap-3">
        <header>
          <div className="font-mono-tabular text-[10px] uppercase tracking-widest text-primary">
            Prompt Studio
          </div>
          <h1 className="font-display text-4xl">System Prompt do motor</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edite as instruções que o Gym.AI segue em todos os discoveries. Salvar cria uma nova
            versão e ativa automaticamente.
          </p>
        </header>
        <div className="flex justify-end">
          <AttachTextFile label="Carregar de .txt / .md" onText={(text) => setDraft(text)} />
        </div>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="min-h-[500px] font-mono text-xs leading-relaxed"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono-tabular">
            {draft.length} caracteres
          </span>
          <Button
            onClick={() => saveMut.mutate()}
            disabled={saveMut.isPending || draft === active?.content}
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {saveMut.isPending ? "Salvando…" : "Salvar nova versão"}
          </Button>
        </div>
      </section>
    </div>
  );
}
