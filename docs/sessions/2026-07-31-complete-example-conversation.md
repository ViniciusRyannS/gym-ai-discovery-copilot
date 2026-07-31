# Session — DEMO-004 complete example conversation

**Date:** 2026-07-31

## Objective

Let an evaluator open a realistic, complete discovery conversation in one click
inside local demo mode.

## Plan

- add an idempotent local example seeder;
- build a coherent fictional production-rework narrative across ten categories;
- derive understanding and artifacts through the existing local generators;
- expose one clear action on the new-discovery page;
- add focused tests and run the full quality gate;
- do not modify remote AI, Supabase, migrations or RLS.

## Status

Completed.

## Changes

- added the local action `Abrir conversa exemplo` to the new-discovery page;
- added one idempotent fictional scenario about production rework;
- populated alternating messages across all ten discovery categories;
- generated local coverage, one Executive Understanding and PRD, ADR, Spec and
  User Stories through the existing deterministic generators;
- kept the conversation open for additional evaluator messages;
- prevented Supabase initialization on `/auth` and whenever a local demo
  session exists, without changing online authentication behavior;
- deployed the update to the existing Cloudflare Worker.

## Evidence

- clean install from lockfile: passed;
- typecheck: passed;
- 25 tests passed;
- focused ESLint passed;
- production build passed;
- Cloudflare deployment version:
  `64e506af-099a-4a4a-b13f-cae33af85395`;
- live `/auth` and `/demo`: HTTP 200;
- public assets contain the action, scenario and no-external-send disclosure.

## Scope boundary

No remote AI function, Supabase migration or RLS policy was changed.
