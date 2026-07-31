import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthErrorMessage, getSignUpResultState } from "@/lib/auth/auth-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  demoSignIn,
  demoSignUp,
  getDemoSession,
} from "@/lib/demo-mode/auth";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  head: () => ({
    meta: [
      { title: "Entrar — Gym.AI" },
      {
        name: "description",
        content: "Entre no Gym.AI para começar seu próximo discovery técnico-comercial.",
      },
    ],
  }),
  component: AuthPage,
});

function safeNext(raw: string): string {
  // Only same-origin relative paths (start with a single "/")
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/app";
  return raw;
}

function AuthPage() {
  const { next } = Route.useSearch();
  const target = safeNext(next);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [authSource, setAuthSource] = useState<"demo" | "online">("demo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getDemoSession()) {
      window.location.replace(target);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace(target);
    });
  }, [target]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (authSource === "demo") {
        if (mode === "signup") {
          await demoSignUp({ email, password, displayName });
          toast.success("Conta fictícia criada neste navegador.");
        } else {
          await demoSignIn(email, password);
          toast.success("Modo demonstração iniciado.");
        }
        window.location.replace(target);
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${target}`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;

        if (getSignUpResultState(data.session) === "authenticated") {
          toast.success("Conta criada com sucesso.");
          window.location.replace(target);
          return;
        }

        throw {
          code: "signup_confirmation_enabled",
          message: "Signup requires email confirmation",
        };
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.replace(target);
      }
    } catch (err) {
      toast.error(
        authSource === "demo" && err instanceof Error ? err.message : getAuthErrorMessage(err),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 hero-glow" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
        <div className="mb-10 flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-mono-tabular tracking-wider uppercase">Gym.AI</span>
        </div>
        <h1 className="font-display text-5xl leading-[1.05] text-foreground">
          Discovery <em className="text-primary">conduzido</em> por IA.
        </h1>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Entre para acessar seu copiloto de pré-vendas.
        </p>

        <form onSubmit={handleSubmit} className="glass mt-10 w-full space-y-4 rounded-2xl p-6">
          <div className="grid grid-cols-2 rounded-xl bg-background/50 p-1">
            <button
              type="button"
              onClick={() => setAuthSource("demo")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                authSource === "demo"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Demonstração
            </button>
            <button
              type="button"
              onClick={() => setAuthSource("online")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                authSource === "online"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Conta online
            </button>
          </div>

          {authSource === "demo" && mode === "signin" && (
            <button
              type="button"
              onClick={() => {
                setEmail(DEMO_EMAIL);
                setPassword(DEMO_PASSWORD);
              }}
              className="w-full rounded-xl border border-primary/25 bg-primary/[0.06] p-3 text-left transition hover:bg-primary/10"
            >
              <span className="block font-mono-tabular text-[10px] uppercase tracking-widest text-primary">
                Conta pronta para apresentação
              </span>
              <span className="mt-1 block text-xs text-foreground">
                {DEMO_EMAIL} · senha {DEMO_PASSWORD}
              </span>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                Clique para preencher as credenciais.
              </span>
            </button>
          )}
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Como devemos te chamar"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy
              ? "Aguarde…"
              : mode === "signup"
                ? authSource === "demo"
                  ? "Criar conta fictícia"
                  : "Criar conta online"
                : authSource === "demo"
                  ? "Entrar no modo demonstração"
                  : "Entrar"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Não tem conta? Criar uma agora" : "Já tem conta? Entrar"}
          </button>
          {authSource === "demo" && (
            <p className="text-center text-[10px] leading-4 text-muted-foreground">
              Dados fictícios salvos somente neste navegador. Nenhuma credencial é enviada ao
              Supabase.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
