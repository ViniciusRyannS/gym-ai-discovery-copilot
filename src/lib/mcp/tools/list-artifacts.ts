import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, requireAuth, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "list_artifacts",
  title: "Listar artefatos",
  description: "Retorna os artefatos gerados (PRD, ADR, Spec, User Stories) em Markdown para um discovery.",
  inputSchema: {
    conversation_id: z.string().uuid().describe("ID do discovery."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ conversation_id }, ctx) => {
    const guard = requireAuth(ctx);
    if (guard) return guard;
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("artifacts")
      .select("id, kind, title, content, created_at")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: false });
    if (error) return errorResult(error.message);
    return jsonResult({ artifacts: data ?? [] });
  },
});