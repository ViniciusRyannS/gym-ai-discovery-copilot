import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createGateway(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export const CHAT_MODEL = "google/gemini-2.5-flash";
export const REASONING_MODEL = "google/gemini-2.5-pro";