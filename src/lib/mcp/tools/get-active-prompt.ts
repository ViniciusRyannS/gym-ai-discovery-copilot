import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, requireAuth, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "get_active_prompt",
  title: "System prompt ativo",
  description:
    "Retorna o system prompt atualmente ativo no Prompt Studio do usuário (versão + conteúdo).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const guard = requireAuth(ctx);
    if (guard) return guard;
    const supabase = supabaseForUser(ctx);
    const { data: prompt } = await supabase
      .from("prompts")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();
    if (!prompt) return jsonResult({ prompt: null });
    const { data: version, error } = await supabase
      .from("prompt_versions")
      .select("*")
      .eq("id", prompt.active_version_id ?? "")
      .maybeSingle();
    if (error) return errorResult(error.message);
    return jsonResult({ prompt, active_version: version });
  },
});
