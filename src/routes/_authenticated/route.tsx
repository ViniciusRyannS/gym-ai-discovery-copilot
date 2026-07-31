import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { getDemoSession } from "@/lib/demo-mode/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const demoSession = getDemoSession();
    if (demoSession) {
      return { user: { id: `demo:${demoSession.email}`, email: demoSession.email }, demo: true };
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth", search: { next: "" } });
    }
    return { user: data.user, demo: false };
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
