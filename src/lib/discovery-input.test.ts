import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assessDiscoveryInput,
  getInputRecoveryReply,
  isGroundedEvidence,
} from "./discovery-input.ts";

describe("assessDiscoveryInput", () => {
  it("recognizes greetings without treating them as discovery facts", () => {
    for (const value of ["oi", "Olá", "bom dia", "boa noite"]) {
      assert.equal(assessDiscoveryInput(value).kind, "greeting");
    }
  });

  it("rejects obvious noise and test messages", () => {
    for (const value of ["a", "aaa", "teste", "te4ste", "???", "qwerty"]) {
      assert.equal(assessDiscoveryInput(value).kind, "noise");
    }
  });

  it("keeps short but plausible answers in the normal flow", () => {
    for (const value of ["CFO", "AWS", "sim", "não", "250", "24x7", "LGPD"]) {
      assert.equal(assessDiscoveryInput(value).kind, "informative");
    }
  });
});

describe("getInputRecoveryReply", () => {
  it("does not claim understanding for an insufficient answer", () => {
    const reply = getInputRecoveryReply("noise", "Migração AWS");
    assert.match(reply, /não vou assumir/i);
    assert.doesNotMatch(reply, /compreendido|entendi o problema/i);
  });
});

describe("isGroundedEvidence", () => {
  const content = "O sponsor é o CFO e precisamos reduzir o retrabalho no fechamento mensal.";

  it("accepts a literal excerpt from the user message", () => {
    assert.equal(isGroundedEvidence(content, "o CFO"), true);
    assert.equal(isGroundedEvidence(content, "reduzir o retrabalho"), true);
  });

  it("rejects facts without literal support", () => {
    assert.equal(isGroundedEvidence(content, "orçamento de R$ 2 milhões"), false);
    assert.equal(isGroundedEvidence(content, "a"), false);
  });
});
