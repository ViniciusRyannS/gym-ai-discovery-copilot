import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { listConversations } from "@/lib/conversations.functions";
import { BookOpen, Library, MessageSquareText, Plus, Wand2 } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const list = useServerFn(listConversations);
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => list(),
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(to: string, params?: Record<string, string>) {
    setOpen(false);
    navigate({ to, params } as never);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar discoveries ou executar ação…" />
      <CommandList>
        <CommandEmpty>Nada encontrado.</CommandEmpty>
        <CommandGroup heading="Ações">
          <CommandItem onSelect={() => go("/app")}>
            <Plus className="mr-2 h-4 w-4" /> Novo discovery
          </CommandItem>
          <CommandItem onSelect={() => go("/portfolio")}>
            <Library className="mr-2 h-4 w-4" /> Abrir portfólio
          </CommandItem>
          <CommandItem onSelect={() => go("/prompts")}>
            <Wand2 className="mr-2 h-4 w-4" /> Prompt Studio
          </CommandItem>
          <CommandItem onSelect={() => go("/manual")}>
            <BookOpen className="mr-2 h-4 w-4" /> Manual / Sobre
          </CommandItem>
        </CommandGroup>
        {conversations.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Discoveries">
              {conversations.slice(0, 20).map((c) => (
                <CommandItem
                  key={c.id}
                  value={`${c.title} ${c.service_type}`}
                  onSelect={() => go("/c/$conversationId", { conversationId: c.id })}
                >
                  <MessageSquareText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{c.title || c.service_type}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}