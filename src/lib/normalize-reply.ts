// Extrai o texto natural quando o modelo devolve JSON dentro do `reply`.
// Cobre variações comuns: pergunta / reply / resposta / message / answer / content / text.
const TEXT_KEYS = [
  "pergunta",
  "reply",
  "resposta",
  "message",
  "answer",
  "content",
  "text",
] as const;

function pickText(obj: unknown): string | null {
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  for (const k of TEXT_KEYS) {
    const v = o[k];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return null;
}

/**
 * Se `raw` for um JSON com um dos campos de texto conhecidos, devolve só o texto.
 * Caso contrário, devolve o próprio conteúdo.
 */
export function normalizeAssistantContent(raw: string): string {
  const s = raw?.trim();
  if (!s) return "";
  // Fast path: só tenta parsear se parece JSON
  if (!(s.startsWith("{") || s.startsWith("["))) return raw;
  try {
    const parsed = JSON.parse(s);
    const direct = pickText(parsed);
    if (direct) return direct;
    // Array de objetos: junta textos encontrados
    if (Array.isArray(parsed)) {
      const parts = parsed.map(pickText).filter((v): v is string => !!v);
      if (parts.length) return parts.join("\n\n");
    }
  } catch {
    /* não é JSON válido — mantém o texto original */
  }
  return raw;
}
