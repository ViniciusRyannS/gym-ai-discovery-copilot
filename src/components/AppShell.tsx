import { type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { listConversations } from "@/lib/conversations.functions";
import { Sparkles, Plus, Library, Wand2, LogOut, MessageSquareText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommandPalette } from "@/components/CommandPalette";
import { demoSignOut, getDemoSession } from "@/lib/demo-mode/auth";
import { listDemoConversations } from "@/lib/demo-mode/store";

const NAV = [
  { to: "/app", label: "Novo discovery", icon: Plus },
  { to: "/portfolio", label: "Portfólio", icon: Library },
  { to: "/prompts", label: "Prompt Studio", icon: Wand2 },
  { to: "/manual", label: "Manual / Sobre", icon: BookOpen },
];

export function AppShell({ children }: { children: ReactNode }) {
  const isDemo = Boolean(getDemoSession());
  const list = useServerFn(listConversations);
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations", isDemo ? "demo" : "online"],
    queryFn: () => (isDemo ? Promise.resolve(listDemoConversations()) : list()),
  });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  async function signOut() {
    if (isDemo) {
      demoSignOut();
      navigate({ to: "/auth", search: { next: "" } });
      return;
    }
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { next: "" } });
  }

  return (
    <div className="flex h-svh w-full bg-background text-foreground">
      <aside className="hidden w-[264px] shrink-0 flex-col border-r border-hairline bg-sidebar md:flex">
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg text-foreground">Gym.AI</div>
            <div className="font-mono-tabular text-[10px] uppercase tracking-widest text-muted-foreground">
              Discovery Copilot
            </div>
          </div>
          {isDemo && (
            <span className="ml-auto rounded-full border border-primary/30 bg-primary/10 px-2 py-1 font-mono-tabular text-[9px] text-primary">
              DEMO
            </span>
          )}
        </div>

        <nav className="flex flex-col gap-0.5 px-3 py-2">
          {NAV.filter((item) => !isDemo || item.to !== "/prompts").map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-sidebar-accent text-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 pt-4 pb-1 text-[10px] font-mono-tabular uppercase tracking-widest text-muted-foreground">
          Discoveries
        </div>
        <ScrollArea className="min-h-0 flex-1 px-2">
          <div className="flex flex-col gap-0.5 pb-4">
            {conversations.length === 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground">Nenhum ainda.</div>
            )}
            {conversations.map((c) => {
              const active = pathname.includes(`/c/${c.id}`);
              return (
                <Link
                  key={c.id}
                  to="/c/$conversationId"
                  params={{ conversationId: c.id }}
                  className={`group flex items-start gap-2 rounded-lg px-3 py-2 text-left transition ${
                    active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60"
                  }`}
                >
                  <MessageSquareText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-foreground">
                      {c.title || c.service_type}
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {c.service_type}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </ScrollArea>

        <div className="border-t border-hairline p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-start text-muted-foreground"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" /> Sair
          </Button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      {!isDemo && <CommandPalette />}
    </div>
  );
}
