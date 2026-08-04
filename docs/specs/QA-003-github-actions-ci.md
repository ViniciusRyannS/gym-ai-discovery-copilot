# QA-003 — GitHub Actions CI

## Problem

Quality gates are executed and documented locally, but the public repository
does not automatically verify new pushes and pull requests.

## Evidence

- there is no `.github/workflows` directory;
- `package.json` already exposes `typecheck`, `test` and `build` scripts;
- the latest local run records 25 passing tests and a successful production
  build;
- the global lint debt is not yet suitable as a blocking repository-wide gate.

## Impact

Recruiters and collaborators must trust manually recorded evidence. A future
change can break installation, typing, tests or the build without a visible
GitHub signal.

## Decision

Create a minimal GitHub Actions workflow using Node.js 22 and npm. Run on pushes
to `main`, pull requests and manual dispatch:

1. checkout;
2. setup Node.js with npm cache;
3. `npm ci`;
4. `npm run typecheck`;
5. `npm test`;
6. `npm run build`.

Do not add global lint until its baseline is resolved. Add a CI badge to the
README only after the workflow exists; confirm its status after the first run.

## Files

- `.github/workflows/ci.yml`;
- `README.md`;
- `docs/specs/QA-003-github-actions-ci.md`;
- `docs/sessions/2026-08-04-github-actions-ci.md`;
- `docs/task-board.md`;
- `docs/release-checklist.md`;
- `docs/testing.md`.

## Acceptance criteria

- [ ] workflow syntax is valid YAML;
- [ ] workflow runs on push to `main`;
- [ ] workflow runs on pull requests;
- [ ] workflow supports manual dispatch;
- [ ] Node.js 22 and npm cache are configured;
- [ ] `npm ci`, typecheck, tests and build are blocking steps;
- [ ] no secret or connected environment variable is required;
- [ ] README contains a CI badge;
- [ ] first GitHub Actions run completes successfully;
- [ ] local quality gates remain green.

## Tests

- run `npm ci`, typecheck, tests and build locally;
- parse the YAML with an available parser or review its minimal structure;
- push the scoped commit;
- inspect the real GitHub Actions run and record its result.

## Rollback

Revert the CI commit with a new commit. Removing the workflow does not affect the
deployed application. Do not rewrite published Git history.
