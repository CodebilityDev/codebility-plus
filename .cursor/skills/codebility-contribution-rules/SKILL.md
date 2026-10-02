---
name: codebility-contribution-rules
description: >-
  The rules an AI agent must follow when contributing to apps/codebility. Read before
  writing, reviewing or merging any change in this repo.
---

# Contribution rules (apps/codebility)

These are requirements, not suggestions, and they are written for AI agents. A
human contributor gets most of them from `AGENTS.md` and from review. An agent
that skips them produces work someone else has to redo.

## 1. Write no comments

No `//`, no `/* */`, no JSX `{/* */}`, no doc blocks. Not in a new file, not
in an edit to an old one, not as a one-off to explain something non-obvious.

Names and structure carry the meaning. When a rule or a decision needs explaining,
the explanation goes here or in `AGENTS.md`, not in the file.

Two exceptions, because they are directives and not explanation:
`@ts-expect-error` and its relatives, `eslint-disable`, `prettier-ignore`,
and triple-slash references.

The repo still holds 1,216 comment lines across 197 files written before this
rule. Leave them where they are unless you are already rewriting that code. The
trap is mimicry: the file you are editing probably has comments, and matching its
style feels correct. It is not. Add none.

## 2. Folder architecture

Enforced by `codebility/route-scope` in `apps/codebility/eslint.config.js`.
`AGENTS.md` has the full map. The short version:

- `app/` holds routing files only
- `<folder>/global/` is shared, `<folder>/<route>/` belongs to one route
- a file imports from any `global/` folder and from its own route, nothing else
- no subfolders inside a route folder, no `index.ts` barrels
- `PascalCase.tsx` for components, `kebab-case.ts` for everything else
- a component two routes need goes in `components/global/`, which resolves to
  route `""`

That last rule is why `CodevsProfiles` lives in
`components/global/marketing/`. Both `/codevs` and `/hire-a-codev` render
it, and a file in `components/marketing/codevs/` cannot be imported by
`/hire-a-codev`.

## 3. Reuse before you write

The ladder, in order:

1. Does this need to exist?
2. Does it already live in this repo? Grep first.
3. Does the standard library do it?
4. Does the platform do it?
5. Does an installed dependency do it?
6. Can it be one line?

Only then write the minimum. Before adding a file, grep for the thing you are
about to build, because the pattern you need usually exists a few files over. If
two routes need it, it belongs in `global/`. If you reach for a dependency, say
what the few lines would have cost.

## 4. The codebase skill

Read `.cursor/skills/nextjs-static-public-data/SKILL.md` before touching a
public page. It documents the static shell plus streamed data pattern, the traps
that cost real time, and how to verify a change. Skipping it produces changes that
look right and are not.

## 5. Ponytail and unslop

Load the `ponytail` skill for every coding change and `unslop` for every prose
change. Ponytail is the ladder in rule 3. Unslop is zero em-dashes and no AI prose
tells, and it applies to the docs and skills in this repo as much as to a blog
post.

## 6. Never put a fetch or a check in a layout

A layout is a shell. Authentication, authorization and data fetching belong in
`proxy.ts`, in the server component that owns the data, or in the page. A layout
that fetches makes every route under it dynamic and duplicates work the page
already does.

## What review catches

Comments and folder boundaries are mechanical. These are not, and they come back
as review comments:

- a second implementation of something that already exists
- a fetch or a check in a layout
- a Suspense boundary around a whole page body
- a new dependency where a few lines would do
- prose that reads like a machine wrote it

## Before you push

    pnpm.cmd --filter codebility lint
    pnpm.cmd codebility:build
