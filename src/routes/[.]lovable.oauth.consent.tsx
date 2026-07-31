import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

// Local typed wrapper for the beta supabase.auth.oauth namespace.
type AuthorizationDetails = {
  client?: { name?: string; client_uri?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
  scope?: string;
};
type OAuthResult = { data: AuthorizationDetails | null; error: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) {
      window.location.href = immediate;
      return data;
    }
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md p-8 text-sm text-muted-foreground">
      Não foi possível carregar esta autorização: {String((error as Error)?.message ?? error)}
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("O servidor de autorização não retornou uma URL de redirecionamento.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "Este aplicativo";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 hero-glow" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-mono-tabular uppercase tracking-wider">Gym.AI · Autorização</span>
        </div>
        <div className="glass w-full space-y-5 rounded-2xl p-6">
          <div>
            <h1 className="font-display text-2xl leading-tight">
              Conectar <em className="text-primary not-italic">{clientName}</em> à sua conta Gym.AI
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {clientName} poderá chamar as tools do Gym.AI enquanto você estiver conectado.
              As permissões e políticas do sistema (RLS) continuam valendo — o cliente age como você.
            </p>
          </div>

          <ul className="space-y-2 text-sm text-foreground/90">
            <li className="flex gap-2"><span className="text-primary">•</span> Listar e criar seus discoveries</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Enviar mensagens no chat como você</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Gerar Entendimento Executivo e artefatos</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Ler seu portfólio e prompt ativo</li>
          </ul>

          {error && (
            <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
              {busy ? "Autorizando…" : "Autorizar"}
            </Button>
            <Button variant="outline" className="flex-1" disabled={busy} onClick={() => decide(false)}>
              Cancelar
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Você pode revogar esse acesso a qualquer momento saindo da sua conta Gym.AI.
          </p>
        </div>
      </div>
    </div>
  );
}