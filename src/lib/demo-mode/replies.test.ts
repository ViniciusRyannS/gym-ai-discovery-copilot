import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getDemoTurn } from "./replies.ts";

describe("local demo replies", () => {
  it("does not advance coverage for greetings or noise", () => {
    for (const content of ["oi", "aaa", "teste", "???"]) {
      const turn = getDemoTurn(content, 0, "Migração AWS");
      assert.equal(turn.advancesCoverage, false);
      assert.doesNotMatch(turn.reply, /compreendido|entendi o problema/i);
    }
  });

  it("advances the guided discovery for plausible information", () => {
    const turn = getDemoTurn("O CFO patrocina o projeto", 0, "Migração AWS");
    assert.equal(turn.advancesCoverage, true);
    assert.match(turn.reply, /Contexto de negócio/);
  });
});
