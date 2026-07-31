import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AttachTextFile } from "@/components/AttachTextFile";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  deletePortfolioItem,
  listPortfolio,
  togglePortfolioItem,
  upsertPortfolioItem,
} from "@/lib/portfolio.functions";
import { getDemoSession } from "@/lib/demo-mode/auth";
import {
  addDemoPortfolioItem,
  deleteDemoPortfolioItem,
  listDemoPortfolio,
  toggleDemoPortfolioItem,
} from "@/lib/demo-mode/store";

export const Route = createFileRoute("/_authenticated/portfolio")({
  component: Portfolio,
});

function Portfolio() {
  const isDemo = Boolean(getDemoSession());
  const list = useServerFn(listPortfolio);
  const upsert = useServerFn(upsertPortfolioItem);
  const toggle = useServerFn(togglePortfolioItem);
  const del = useServerFn(deletePortfolioItem);
  const qc = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ["portfolio", isDemo ? "demo" : "online"],
    queryFn: () => (isDemo ? Promise.resolve(listDemoPortfolio()) : list()),
  });

  const [form, setForm] = useState({ category: "", name: "", description: "", aliases: "" });

  const upsertMut = useMutation({
    mutationFn: (v: typeof form) =>
      isDemo
        ? Promise.resolve(
            addDemoPortfolioItem({
              category: v.category,
              name: v.name,
              description: v.description,
              aliases: v.aliases
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              is_active: true,
            }),
          )
        : upsert({
            data: {
              category: v.category,
              name: v.name,
              description: v.description,
              aliases: v.aliases
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              is_active: true,
            },
          }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      setForm({ category: "", name: "", description: "", aliases: "" });
      toast.success("Serviço adicionado");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const toggleMut = useMutation<void, Error, { id: string; is_active: boolean }>({
    mutationFn: async (v) => {
      if (isDemo) {
        toggleDemoPortfolioItem(v.id, v.is_active);
        return;
      }
      await toggle({ data: v });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
  const delMut = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (isDemo) {
        deleteDemoPortfolioItem(id);
        return;
      }
      await del({ data: { id } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });

  return (
    <div className="mx-auto w-full max-w-4xl overflow-y-auto px-6 py-10">
      <header className="mb-8">
        <div className="font-mono-tabular text-[10px] uppercase tracking-widest text-primary">
          Catálogo
        </div>
        <h1 className="font-display mt-1 text-4xl">Portfólio de serviços</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O motor usa esses serviços como referência ao conduzir os discoveries e sugerir escopo.
        </p>
        {isDemo && (
          <p className="mt-3 rounded-xl border border-primary/20 bg-primary/[0.06] px-3 py-2 text-xs text-primary">
            MODO DEMO · alterações salvas somente neste navegador
          </p>
        )}
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name || !form.category) return toast.error("Nome e categoria são obrigatórios");
          upsertMut.mutate(form);
        }}
        className="glass mb-8 space-y-3 rounded-2xl p-5"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Dados, IA, Infra…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Nome do serviço</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>Descrição</Label>
            <AttachTextFile
              onText={(text, filename) =>
                setForm((prev) => ({
                  ...prev,
                  description: prev.description
                    ? `${prev.description}\n\n--- ${filename} ---\n${text}`
                    : text,
                }))
              }
            />
          </div>
          <Textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Apelidos (separados por vírgula)</Label>
          <Input
            value={form.aliases}
            onChange={(e) => setForm({ ...form, aliases: e.target.value })}
            placeholder="rag, chatbot, assistente"
          />
        </div>
        <Button type="submit" disabled={upsertMut.isPending}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Adicionar
        </Button>
      </form>

      <div className="space-y-2">
        {items.map((i) => (
          <div
            key={i.id}
            className="glass grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-2xl p-4"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono-tabular text-[10px]">
                  {i.category}
                </Badge>
                <span
                  className={`font-medium ${i.is_active ? "text-foreground" : "text-muted-foreground line-through"}`}
                >
                  {i.name}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{i.description}</p>
              {(i.aliases ?? []).length > 0 && (
                <div className="mt-1 text-[11px] font-mono-tabular text-muted-foreground">
                  {(i.aliases ?? []).join(" · ")}
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Switch
                checked={i.is_active}
                onCheckedChange={(v) => toggleMut.mutate({ id: i.id, is_active: v })}
              />
              <Button size="icon" variant="ghost" onClick={() => delMut.mutate(i.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
