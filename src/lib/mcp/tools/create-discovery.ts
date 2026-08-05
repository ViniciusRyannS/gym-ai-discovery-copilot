import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, requireAuth, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "create_discovery",
  title: "Criar discovery",
  description:
    "Cria um novo discovery (conversa) para o usuário autenticado. Retorna o ID para uso em outras tools.",
  inputSchema: {
    title: z.string().min(1).describe("Título curto do discovery."),
    service_type: z
      .string()
      .min(1)
      .describe("Serviço do portfólio que será descoberto (ex.: 'Chatbot com RAG')."),
    briefing: z.string().min(1).describe("Briefing inicial do cliente."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    const guard = requireAuth(ctx);
    if (guard) return guard;
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();
    if (!userId) return errorResult("Missing user id");
    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({ ...input, user_id: userId })
      .select()
      .single();
    if (error) return errorResult(error.message);
    await supabase.from("discovery_states").insert({ conversation_id: conv.id, user_id: userId });
    return jsonResult({ id: conv.id, conversation: conv });
  },
});
