# PORT-007 — Portfolio package name

## Problem

The root package still uses the scaffold name `tanstack_start_ts`, which does
not identify the product in package-manager output, build logs or repository
metadata.

## Evidence

- `package.json` contains `"name": "tanstack_start_ts"`;
- the root entry in `package-lock.json` uses the same generic name;
- the public repository and deployment already use
  `gym-ai-discovery-copilot`.

## Impact

The generic name makes the project look unfinished and weakens consistency in a
portfolio review. It can also make logs and future automation harder to
identify.

## Decision

Rename the npm package to `gym-ai-discovery-copilot` using npm commands and let
npm synchronize the lockfile. Do not edit the lockfile manually and do not
change dependencies or application behavior.

## Files

- `package.json`;
- `package-lock.json`;
- `docs/specs/PORT-007-package-name.md`;
- `docs/sessions/2026-08-04-package-name.md`;
- `docs/task-board.md`;
- `docs/release-checklist.md`.

## Acceptance criteria

- [x] `package.json` uses `gym-ai-discovery-copilot`;
- [x] root package metadata in `package-lock.json` matches;
- [x] no dependency version changes are introduced;
- [x] `npm ci` passes;
- [x] typecheck passes;
- [x] all tests pass;
- [x] production build passes;
- [x] Git diff check passes.

## Tests

```text
npm ci
npm run typecheck
npm test
npm run build
git diff --check
```

## Rollback

Revert the package-name commit with a new commit and run npm again to keep the
manifest and lockfile synchronized. Do not rewrite published history.
