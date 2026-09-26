---
name: codebility-codebase
description: >-
  Points to the Codebility folder structure and contribution rules. Use when adding,
  moving or deleting files in apps/codebility, debugging auth/middleware or the
  applicant pipeline, or when the user mentions Codebility or codebility-plus.
---

# Codebility codebase

Read `AGENTS.md` at the repo root. It is the single source for:

- what the app contains after the September 2026 reset
- where each kind of file goes (folder map)
- the import-boundary rules that `pnpm --filter codebility lint` enforces
- the steps for adding or removing a private `/home` page
- the checks to run before pushing

For marketing pages, also use the `nextjs-static-public-data` and `landing-scroll-motion` skills in this folder.
