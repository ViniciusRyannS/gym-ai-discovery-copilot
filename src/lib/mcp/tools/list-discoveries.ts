import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, requireAuth, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "list_discoveries",
  title: "Listar discoveries",
  description: "Lista os discoveries (conversas de pré-vendas) do usuário autenticado no Gym.AI.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Máximo de discoveries a retornar (padrão 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    const guard = requireAuth(ctx);
    if (guard) return guard;
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("conversations")
      .select("id, title, service_type, briefing, created_at, updated_at")
      .eq("is_deleted", false)
      .order("updated_at", { ascending: false })
      .limit(limit ?? 20);
    if (error) return errorResult(error.message);
    return jsonResult({ discoveries: data ?? [] });
  },
});