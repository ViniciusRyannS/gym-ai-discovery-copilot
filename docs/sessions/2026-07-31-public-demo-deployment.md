# Session — PORT-001 public demo deployment

**Date:** 2026-07-31

## Objective

Publish a stable public `/demo` URL that a recruiter can use without login,
installation or connected environment configuration.

## Plan

- preserve the existing TanStack Start architecture;
- use the Cloudflare Workers runtime already emitted by the build;
- isolate `/demo` from the global Supabase auth listener;
- run the existing quality gates;
- deploy the prebuilt worker;
- validate the live deep link, anonymous journey, mobile viewport, external
  requests and public bundle;
- update repository context only with evidence collected from the live URL.

## Risks

- Cloudflare deployment requires account authorization outside the repository;
- the root layout currently touches Supabase after hydration;
- generated output may contain build-time public configuration if the local
  `.env` is loaded;
- runtime or direct-route behavior can differ from the local preview.

## Initial evidence

- repository branch: `main`;
- working tree was clean before PORT-001;
- current build target: Nitro `cloudflare-module`;
- generated worker name: `viniciusryanns-gym-ai-discovery-copilot`;
- `/demo` contains local React state and deterministic constants only;
- `/demo` itself has no fetch, Supabase, AI gateway or persistence dependency;
- the root auth listener is the identified connected dependency to isolate.

## Changes

- `src/routes/__root.tsx` no longer initializes the Supabase auth listener when
  the active route is exactly `/demo`;
- the existing Nitro Cloudflare Worker output was deployed without changing the
  remote AI flow, RLS, migrations or authenticated route behavior;
- the public URL was added to `README.md`.

## Deployment

```text
Provider: Cloudflare Workers
Worker: viniciusryanns-gym-ai-discovery-copilot
Version: 34094b84-3270-40a1-be2e-60059be45b5d
URL: https://viniciusryanns-gym-ai-discovery-copilot.east-gigantspinosaurus.workers.dev/demo
```

The temporary deployment was claimed by the user before live validation.

## Evidence

- `npm run typecheck`: passed;
- `npm test`: 23 tests passed;
- focused ESLint on `src/routes/__root.tsx`: passed;
- production build without `.env`: passed and `.env` was restored;
- direct `GET /demo`: HTTP 200;
- second direct request, equivalent to refresh/deep link: HTTP 200;
- rendered HTML contains the Gym.AI title, simulated-data label and human
  review notice;
- clean-browser journey passed at 1366x768 and 390x844;
- both viewports had document width equal to viewport width;
- Questions, Coverage, Understanding, Artifacts and return to Briefing passed;
- no login fields were present;
- browser network capture found zero Supabase and zero Lovable AI Gateway
  requests;
- build generated without connected variables and public assets contained no
  configured server secret value.

## Known scope boundary

The connected product routes still need their own environment configuration.
Only the public deterministic `/demo` is covered by this deployment guarantee.

## Status

Completed. PORT-001 acceptance evidence is recorded above.
