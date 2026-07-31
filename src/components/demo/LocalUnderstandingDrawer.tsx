import { useEffect, useState } from "react";
import { RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type DemoUnderstanding } from "@/lib/demo-mode/deliverables";
import { generateDemoUnderstanding, getDemoConversation } from "@/lib/demo-mode/store";

export function LocalUnderstandingDrawer({
  open,
  onOpenChange,
  conversationId,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  conversationId: string;
}) {
  const [understandings, setUnderstandings] = useState<DemoUnderstanding[]>([]);

  function refresh() {
    setUnderstandings(getDemoConversation(conversationId).understandings);
  }

  useEffect(() => {
    if (open) setUnderstandings(getDemoConversation(conversationId).understandings);
  }, [open, conversationId]);

  function generate() {
    generateDemoUnderstanding(conversationId);
    refresh();
    toast.success("Entendimento demonstrativo gerado");
  }

  const latest = understandings[0];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="border-b border-hairline pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 font-mono-tabular text-[9px] text-primary">
              DEMO LOCAL
            </span>
          </div>
          <SheetTitle className="font-display text-2xl">Entendimento Executivo</SheetTitle>
          <SheetDescription>
            Síntese determinística dos dados locais. Não utiliza IA nem serviços externos.
          </SheetDescription>
        </SheetHeader>

        <Button onClick={generate} className="mt-5 w-full">
          {latest ? <RefreshCw className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {latest ? "Gerar nova versão" : "Gerar Entendimento"}
        </Button>

        {!latest && (
          <div className="mt-6 rounded-2xl border border-dashed border-hairline p-6 text-center text-sm text-muted-foreground">
            Converse no discovery e gere uma síntese quando quiser revisar o contexto.
          </div>
        )}

        {latest && (
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Versão {latest.version}</span>
              <span>{new Date(latest.created_at).toLocaleString("pt-BR")}</span>
            </div>
            <Section title="Síntese">
              <p>{latest.summary}</p>
            </Section>
            <Section title="Diagnóstico">
              <p>{latest.diagnosis}</p>
            </Section>
            <ListSection title="Informações que faltam" items={latest.missing_information} />
            <ListSection title="Riscos" items={latest.risks} />
            <ListSection title="Premissas" items={latest.assumptions} />
            <ListSection title="Próximos passos" items={latest.next_steps} />
            <div className="flex gap-3 rounded-2xl border border-primary/20 bg-primary/[0.06] p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-5 text-muted-foreground">
                Conteúdo simulado por template local. Requer revisão profissional antes de qualquer
                proposta ou compromisso com clientes.
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface/40 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <Section title={title}>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}
