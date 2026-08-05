import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { generateUnderstanding, listUnderstandings } from "@/lib/conversations.functions";
import { AlertTriangle, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  conversationId: string;
}

const COMPLEXITY_COLOR: Record<string, string> = {
  baixa: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  media: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  alta: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export function UnderstandingDrawer({ open, onOpenChange, conversationId }: Props) {
  const list = useServerFn(listUnderstandings);
  const gen = useServerFn(generateUnderstanding);
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["understandings", conversationId],
    queryFn: () => list({ data: { conversation_id: conversationId } }),
    enabled: open,
  });

  const genMut = useMutation({
    mutationFn: () => gen({ data: { conversation_id: conversationId } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["understandings", conversationId] });
      toast.success("Entendimento executivo atualizado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const latest = rows[0];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="border-b border-hairline pb-4">
          <SheetTitle className="font-display text-2xl">Entendimento Executivo</SheetTitle>
          <SheetDescription>
            Síntese acionável do discovery. Sempre revisada por um profissional antes do cliente.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-xs text-warn">
            <AlertTriangle className="h-3.5 w-3.5" />
            Requer revisão humana
          </div>
          <Button size="sm" onClick={() => genMut.mutate()} disabled={genMut.isPending}>
            {genMut.isPending ? (
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            )}
            {rows.length ? "Regerar" : "Gerar"}
          </Button>
        </div>

        {isLoading && <div className="mt-6 text-sm text-muted-foreground">Carregando…</div>}
        {!isLoading && !latest && (
          <div className="mt-8 rounded-2xl border border-dashed border-hairline p-6 text-center text-sm text-muted-foreground">
            Nenhum entendimento gerado. Clique em <strong>Gerar</strong>.
          </div>
        )}

        {latest && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono-tabular">
                v{latest.version}
              </Badge>
              <Badge variant="outline" className={COMPLEXITY_COLOR[latest.complexity] ?? ""}>
                Complexidade: {latest.complexity}
              </Badge>
            </div>

            <Section title="Sumário">{latest.summary}</Section>
            <Section title="Diagnóstico">{latest.diagnosis}</Section>
            <BulletSection title="Riscos" items={latest.risks ?? []} />
            <BulletSection title="Informação faltante" items={latest.missing_information ?? []} />
            <BulletSection title="Premissas" items={latest.assumptions ?? []} />
            <BulletSection title="Próximos passos" items={latest.next_steps ?? []} />

            {rows.length > 1 && (
              <div className="border-t border-hairline pt-4 text-xs text-muted-foreground">
                Histórico: {rows.length} versões geradas
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 font-mono-tabular text-[10px] uppercase tracking-widest text-primary">
        {title}
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{children}</p>
    </div>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <div className="mb-1.5 font-mono-tabular text-[10px] uppercase tracking-widest text-primary">
        {title}
      </div>
      <ul className="space-y-1 text-sm text-foreground/90">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span className="leading-relaxed">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
