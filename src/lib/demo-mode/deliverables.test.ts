import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { EMPTY_COVERAGE } from "../discovery-defaults.ts";
import { buildDemoArtifacts, buildDemoUnderstanding } from "./deliverables.ts";

const context = {
  conversation: {
    id: "demo-1",
    title: "Modernização Clear IT",
    service_type: "Plataforma de Dados",
    briefing: "Reduzir retrabalho no fechamento mensal.",
    created_at: "2026-07-31T00:00:00.000Z",
  },
  messages: [
    {
      id: "message-1",
      role: "user",
      content: "O CFO patrocina o projeto.",
      created_at: "2026-07-31T00:01:00.000Z",
    },
  ],
  coverage: { ...EMPTY_COVERAGE, contexto_negocio: 0.8 },
};

describe("local demo deliverables", () => {
  it("builds an honest understanding from local evidence", () => {
    const result = buildDemoUnderstanding(context);
    assert.match(result.summary, /Reduzir retrabalho/);
    assert.match(result.diagnosis, /1 resposta/);
    assert.equal(result.simulated, true);
    assert.ok(result.missing_information.length > 0);
  });

  it("builds all artifact types with review notices and user evidence", () => {
    const artifacts = buildDemoArtifacts(context, ["prd", "adr", "spec", "user_story"]);
    assert.equal(artifacts.length, 4);
    for (const artifact of artifacts) {
      assert.match(artifact.content, /Demonstração local/);
      assert.match(artifact.content, /O CFO patrocina o projeto/);
    }
  });

  it("deduplicates requested artifact kinds", () => {
    assert.equal(buildDemoArtifacts(context, ["prd", "prd"]).length, 1);
  });
});
