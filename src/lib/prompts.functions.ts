import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/discovery-defaults";
import { z } from "zod";

export const getActivePrompt = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: prompt } = await supabase
      .from("prompts")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (!prompt) {
      const { data: created, error: pErr } = await supabase
        .from("prompts")
        .insert({ user_id: userId, name: "Discovery Master Prompt", is_active: true })
        .select()
        .single();
      if (pErr) throw new Error(pErr.message);
      const { data: v, error: vErr } = await supabase
        .from("prompt_versions")
        .insert({ prompt_id: created.id, user_id: userId, version_number: 1, content: DEFAULT_SYSTEM_PROMPT })
        .select()
        .single();
      if (vErr) throw new Error(vErr.message);
      await supabase.from("prompts").update({ active_version_id: v.id }).eq("id", created.id);
      return { prompt: { ...created, active_version_id: v.id }, versions: [v] };
    }

    const { data: versions } = await supabase
      .from("prompt_versions")
      .select("*")
      .eq("prompt_id", prompt.id)
      .order("version_number", { ascending: false });
    return { prompt, versions: versions ?? [] };
  });

export const savePromptVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ content: z.string().min(20) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: prompt } = await supabase
      .from("prompts")
      .select("id")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();
    if (!prompt) throw new Error("Prompt não encontrado");

    const { data: last } = await supabase
      .from("prompt_versions")
      .select("version_number")
      .eq("prompt_id", prompt.id)
      .order("version_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextV = (last?.version_number ?? 0) + 1;

    const { data: v, error } = await supabase
      .from("prompt_versions")
      .insert({ prompt_id: prompt.id, user_id: userId, version_number: nextV, content: data.content })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await supabase.from("prompts").update({ active_version_id: v.id }).eq("id", prompt.id);
    return v;
  });

export const activatePromptVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ version_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: v, error } = await supabase
      .from("prompt_versions")
      .select("*")
      .eq("id", data.version_id)
      .eq("user_id", userId)
      .single();
    if (error || !v) throw new Error("Versão não encontrada");
    await supabase.from("prompts").update({ active_version_id: v.id }).eq("id", v.prompt_id);
    return { ok: true };
  });