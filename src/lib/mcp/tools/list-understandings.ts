import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, requireAuth, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "list_understandings",
  title: "Listar Entendimentos Executivos",
  description:
    "Retorna as versões do Entendimento Executivo geradas para um discovery (sumário, riscos, próximos passos).",
  inputSchema: {
    conversation_id: z.string().uuid().describe("ID do discovery."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ conversation_id }, ctx) => {
    const guard = requireAuth(ctx);
    if (guard) return guard;
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("executive_understandings")
      .select("*")
      .eq("conversation_id", conversation_id)
      .order("version", { ascending: false });
    if (error) return errorResult(error.message);
    return jsonResult({ understandings: data ?? [] });
  },
});
