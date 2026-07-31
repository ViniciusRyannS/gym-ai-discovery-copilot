import { createFileRoute } from "@tanstack/react-router";
import { MarkdownView } from "@/components/MarkdownView";
import manualContent from "../../../docs/manual-do-sistema.md?raw";

export const Route = createFileRoute("/_authenticated/manual")({
  head: () => ({
    meta: [
      { title: "Manual — Gym.AI" },
      {
        name: "description",
        content:
          "Manual do sistema Gym.AI: funcionalidades, limitações, próximos passos e integrantes do grupo Gym.IA.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Manual,
});

function Manual() {
  return (
    <div className="mx-auto w-full max-w-3xl overflow-y-auto px-6 py-10">
      <header className="mb-8">
        <div className="font-mono-tabular text-[10px] uppercase tracking-widest text-primary">
          Entrega / Sobre
        </div>
        <h1 className="font-display mt-1 text-4xl">Manual do Gym.AI</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Descrição, funcionalidades, limitações, próximos passos e créditos do grupo Gym.IA.
        </p>
      </header>
      <article className="glass rounded-2xl p-8">
        <MarkdownView content={manualContent} />
      </article>
    </div>
  );
}
