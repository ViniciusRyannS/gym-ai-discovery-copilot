# DOC-005 — Technical narrative alignment

## Problem

Public application copy still describes Gym.AI as a “multi-agent engine”, while
the validated connected implementation uses one structured model call and the
public/local demos are deterministic. An external presentation also contained
obsolete FastAPI and OpenRouter architecture, but those technologies are no
longer referenced by the repository itself.

## Evidence

- `src/routes/__root.tsx` repeats “Motor conversacional multi-agente” in page,
  Open Graph and Twitter descriptions;
- `src/routes/_authenticated/app.tsx` presents the product as a multi-agent
  engine;
- `README.md` and `docs/manual-do-sistema.md` already warn that five independent
  agents have not been validated;
- repository-wide search found no FastAPI, OpenRouter or `OPENROUTER_API_KEY`
  reference outside historical/corrective documentation;
- `src/lib/conversations.functions.ts` contains the current structured remote
  orchestration.

## Impact

Recruiters or mentors can receive conflicting architecture claims from the UI,
README and presentation. This weakens technical credibility and can lead the
presenter to explain functionality that the repository does not prove.

## Decision

- replace current public “multi-agent engine” claims with “discovery copilot”;
- describe the validated architecture as a deterministic public/local demo plus
  a connected structured model flow;
- retain historical specs and session notes that document why the correction
  was necessary;
- do not add FastAPI/OpenRouter migration claims because the current repository
  contains no evidence that they were part of this codebase;
- do not change remote AI behavior, prompts, database, RLS or MCP.

## Files

- `src/routes/__root.tsx`;
- `src/routes/_authenticated/app.tsx`;
- `README.md`;
- `docs/manual-do-sistema.md`;
- `docs/release-checklist.md`;
- `docs/contexto-completo-para-ia.md`;
- `docs/sessions/2026-08-04-technical-narrative-alignment.md`.

## Acceptance criteria

- [x] no current product UI or social metadata claims a multi-agent engine;
- [x] README and manual describe the structured connected flow consistently;
- [x] FastAPI, OpenRouter and `OPENROUTER_API_KEY` are absent from current
      product documentation and code;
- [x] historical correction records remain intact;
- [x] deterministic demo and connected environment remain clearly separated;
- [x] no remote AI, RLS or MCP behavior changes;
- [x] focused lint, typecheck, tests and build pass;
- [x] public deployment is updated and smoke-tested.

## Tests

```text
rg narrative audit
npm run typecheck
npm test
npm exec -- eslint <changed source files>
npm run build
deployment smoke test
```

## Rollback

Revert the narrative-alignment commit with a new commit and redeploy the prior
Cloudflare Worker version. Do not rewrite published Git history.
