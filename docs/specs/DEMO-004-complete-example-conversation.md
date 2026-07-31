# DEMO-004 — Complete example conversation

## Problem

The local demo starts with an empty discovery form. Although the placeholders
help the user begin, a recruiter who wants to understand the product quickly
must invent a scenario and conduct several turns before seeing a meaningful
result.

## Evidence

- `src/routes/_authenticated/app.tsx` shows the new-discovery form but offers no
  complete local example.
- `src/lib/demo-mode/store.ts` initializes local accounts with an empty
  conversation list.
- the deterministic reply flow supports guided turns, but an evaluator still
  needs to type every answer manually.
- the connected demo journeys cannot be used in local demo mode because they
  depend on the remote environment.

## Impact

The first authenticated impression has unnecessary friction and does not show
how a vague operational problem becomes structured context, coverage,
understanding and artifacts.

## Decision

Add an explicit **Open example conversation** action to local demo mode. It will
create or reuse one deterministic conversation about production rework and
populate a complete, realistic exchange across the ten discovery categories.

The example will:

- identify itself as simulated;
- contain alternating user and Gym.AI messages;
- avoid invented claims beyond the fictional scenario;
- include measurable business context, systems, scope, operation, security,
  volume, criticality, governance, assumptions and risks;
- use the existing local templates to generate one executive understanding and
  all four artifact types;
- remain editable so the evaluator can continue the conversation;
- never call Supabase or the remote AI gateway.

## Files involved

- `src/lib/demo-mode/store.ts`;
- `src/lib/demo-mode/store.test.ts`;
- `src/routes/_authenticated/app.tsx`;
- `src/routes/__root.tsx`;
- `docs/specs/DEMO-004-complete-example-conversation.md`;
- `docs/sessions/2026-07-31-complete-example-conversation.md`;
- context and testing documents after validation.

## Acceptance criteria

- [x] the action appears only in local demo mode;
- [x] one click opens a complete example conversation;
- [x] the scenario starts from a production-rework problem;
- [x] the conversation covers all ten categories in a coherent sequence;
- [x] simulated/local behavior is disclosed in the conversation;
- [x] coverage is visibly advanced;
- [x] an Executive Understanding already exists;
- [x] PRD, ADR, Spec and User Stories already exist;
- [x] invoking the action again reuses the example instead of duplicating it;
- [x] the evaluator can continue sending local messages;
- [x] no connected AI or RLS code is changed;
- [x] the public build can open demo authentication and local demo routes
      without initializing Supabase;
- [x] typecheck, focused lint, tests and build pass.

## Tests

- create the example in a local demo session;
- assert message ordering and the presence of both roles;
- assert all ten category labels are represented;
- assert advanced coverage;
- assert one understanding and four artifact kinds;
- call the seed function twice and assert the same conversation ID and a single
  stored conversation;
- run the existing quality gate.

## Rollback

Revert the DEMO-004 commit with a new commit. Existing user-created local
discoveries remain untouched because the example uses its own stable marker and
is stored only inside the current demo account namespace.
