# DOC-004 — Project handoff documents

## Problem

The repository has detailed technical documents, but no single handoff file for
an AI assistant and no concise, non-technical explanation suitable for a mentor.

## Evidence

- product, technical, testing and release context is distributed across several
  files;
- the system manual is comprehensive but is not optimized as an AI continuation
  prompt;
- a non-technical reader needs examples and terminology explanations before
  understanding the value of discovery coverage and generated artifacts.

## Impact

Sharing only the repository or the system manual increases the chance of
misinterpretation, unsupported claims and confusion between the deterministic
demo and the connected environment.

## Decision

Create two canonical Markdown documents:

1. a structured, evidence-aware handoff for ChatGPT or another AI assistant;
2. a plain-language guide for mentors and non-technical readers.

## Files

- `docs/contexto-completo-para-ia.md`;
- `docs/guia-do-projeto-para-mentores.md`;
- `README.md` documentation index;
- `docs/task-board.md`;
- `docs/sessions/2026-07-31-project-handoff-documents.md`.

## Acceptance criteria

- [x] both requested documents exist in Markdown;
- [x] purpose, problem, solution, features and examples are covered;
- [x] technologies are explained accurately;
- [x] local demo and connected environment are distinguished;
- [x] known limitations are explicit;
- [x] group credits and post-MVP work are separated;
- [x] public demo and repository links are present;
- [x] documents are linked from the README;
- [x] formatting and Git diff checks pass.

## Tests

- review claims against current repository context;
- run Prettier on changed Markdown files;
- run `git diff --check`.

## Rollback

Revert the documentation commit with a new commit. No application behavior is
affected.
