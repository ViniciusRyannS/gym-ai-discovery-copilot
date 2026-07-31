import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, requireAuth, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "list_portfolio",
  title: "Portfólio de serviços",
  description: "Lista os serviços ativos do portfólio do usuário (usados como referência pelos discoveries).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const guard = requireAuth(ctx);
    if (guard) return guard;
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("id, category, name, description, aliases, is_active")
      .order("created_at", { ascending: true });
    if (error) return errorResult(error.message);
    return jsonResult({ items: data ?? [] });
  },
});