import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, requireAuth, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "get_discovery",
  title: "Ver discovery",
  description: "Retorna um discovery completo: conversa, mensagens, cobertura por categoria e fatos capturados.",
  inputSchema: {
    id: z.string().uuid().describe("ID (uuid) do discovery."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    const guard = requireAuth(ctx);
    if (guard) return guard;
    const supabase = supabaseForUser(ctx);
    const { data: conv, error } = await supabase
      .from("conversations").select("*").eq("id", id).maybeSingle();
    if (error) return errorResult(error.message);
    if (!conv) return errorResult("Discovery não encontrado");
    const [{ data: messages }, { data: state }] = await Promise.all([
      supabase.from("messages").select("role, content, created_at").eq("conversation_id", id).order("created_at"),
      supabase.from("discovery_states").select("*").eq("conversation_id", id).maybeSingle(),
    ]);
    return jsonResult({
      conversation: conv,
      messages: messages ?? [],
      coverage_by_category: state?.coverage_by_category ?? {},
      facts: state?.facts ?? [],
      primary_category: state?.primary_category ?? null,
    });
  },
});