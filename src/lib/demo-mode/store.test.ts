import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { DEMO_EMAIL, DEMO_PASSWORD, demoSignIn } from "./auth.ts";
import {
  getDemoConversation,
  listDemoConversations,
  openCompleteDemoConversation,
  sendDemoMessage,
} from "./store.ts";

const data = new Map<string, string>();
const storage = {
  getItem: (key: string) => data.get(key) ?? null,
  setItem: (key: string, value: string) => data.set(key, value),
  removeItem: (key: string) => data.delete(key),
  clear: () => data.clear(),
  key: (index: number) => [...data.keys()][index] ?? null,
  get length() {
    return data.size;
  },
};

Object.defineProperty(globalThis, "localStorage", { value: storage });
Object.defineProperty(globalThis, "window", {
  value: { localStorage: storage, dispatchEvent: () => true },
});

describe("complete local example conversation", () => {
  beforeEach(async () => {
    data.clear();
    await demoSignIn(DEMO_EMAIL, DEMO_PASSWORD);
  });

  it("creates a complete, reviewable journey across all categories", () => {
    const conversation = openCompleteDemoConversation();
    const detail = getDemoConversation(conversation.id);
    const transcript = detail.messages.map((message) => message.content).join("\n");

    assert.match(conversation.briefing, /retrabalho/i);
    assert.ok(detail.messages.some((message) => message.role === "user"));
    assert.ok(detail.messages.some((message) => message.role === "assistant"));
    for (const category of [
      "Contexto de negócio",
      "Ambiente atual",
      "Escopo técnico",
      "Operação",
      "Segurança e conformidade",
      "Volumetria",
      "Criticidade",
      "Governança",
      "Premissas e exclusões",
      "Riscos e validações",
    ]) {
      assert.match(transcript, new RegExp(category, "i"));
    }
    assert.equal(detail.understandings.length, 1);
    assert.deepEqual(
      new Set(detail.artifacts.map((artifact) => artifact.kind)),
      new Set(["prd", "adr", "spec", "user_story"]),
    );
    assert.ok(Object.values(detail.state.coverage_by_category).every((value) => value >= 0.32));
  });

  it("reuses the example and still allows the evaluator to continue", () => {
    const first = openCompleteDemoConversation();
    const second = openCompleteDemoConversation();

    assert.equal(second.id, first.id);
    assert.equal(listDemoConversations().length, 1);

    const before = getDemoConversation(first.id).messages.length;
    sendDemoMessage(first.id, "O piloto também deve medir tempo por apontamento.");
    assert.equal(getDemoConversation(first.id).messages.length, before + 2);
  });
});
