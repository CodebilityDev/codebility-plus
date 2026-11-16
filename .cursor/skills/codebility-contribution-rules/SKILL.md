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

## 7. Fetch failures and error boundaries

A query exception is not an empty result. Keep these cases distinct:

- **No rows**: return the valid empty value.
- **Missing resource**: return null only where the caller will use `notFound()`.
- **Query or transport failure**: throw an error, or return an explicit failure that renders an error state.

Do not catch a database error and return `[]`, `null`, or a zero count. That turns a failure into a misleading empty UI and prevents the error boundary from running.

Use the smallest boundary that matches the failure:

- **Page-critical data** throws from the page or its owning Server Component. The nearest route `error.tsx` handles it.
- **Independent sections** catch their own fetch failure and render `SectionError` from `components/global/feedback/SectionError.tsx`. The rest of the page stays usable.
- **Missing resources** use `notFound()` and the route's not-found UI.
- **Server Actions and event handlers** return field or action errors. Error boundaries do not catch these.
- **Root layout or provider failures** use `app/global-error.tsx`.

Every route error boundary must use `RouteError` and the Next 16 `retry` prop. Do not use `reset()` when the intent is to re-fetch. Do not add a component-level boundary around every fetch. Route and section errors share the same visual language and the same reporting path.

Report unexpected errors through `lib/global/error-reporting.ts`. Server errors are captured by `instrumentation.ts`; browser errors and unhandled rejections by `instrumentation-client.ts`. Route and section boundaries must report through the same adapter, with a route and boundary name. Do not use console-only catches in new code.

PPR caveat: after a streamed shell has been sent, a later error can render the error UI but cannot reliably change the HTTP status to 500. If a route must guarantee a 500, its page-critical data has to complete before streaming, or the route must opt out of PPR. Document that tradeoff when it applies.

## 8. Lazy loading

Lazy loading applies to Client Components and their dependencies. Server Components are already split; do not add a dynamic wrapper that changes their loading behavior.

- Use `next/dynamic` from a Client Component for heavy below-the-fold modules.
- Use `ssr: false` only inside a Client Component. Next rejects it in a Server Component.
- Defer work until it is needed: visible with `IntersectionObserver`, or triggered by an interaction such as opening a drawer or modal.
- Keep fallback dimensions stable so the section does not shift when the module loads.
- Preserve the real UI and behavior. A lazy version is not done if the component only works after an untested click.
- Prefer splitting at the heavy boundary, not at the page. For example, lazy load a rich text editor or a cropper, not the whole board or profile.

Never lazy load the LCP image, hero, first-viewport interaction, primary navigation, or a primary form. Do not lazy load a component only to move a small amount of code and add a loading flash.

Verify both sides of every candidate:

- Before the trigger, the heavy module is absent from the initial route chunks.
- After the trigger, the component renders and behaves normally.
- A failed chunk load has a visible fallback or retry path when the feature is important.

## What review catches

Comments and folder boundaries are mechanical. These are not, and they come back
as review comments:

- a second implementation of something that already exists
- a fetch or a check in a layout
- a Suspense boundary around a whole page body
- a new dependency where a few lines would do
- prose that reads like a machine wrote it
- a database failure turned into an empty state
- a route boundary around a section that can fail independently
- an independent section that takes down the whole page
- a per-component error boundary where a route boundary or local state is enough
- console-only error handling
- a heavy below-the-fold module still statically imported into the initial chunk
- a lazy component with no loading fallback or no post-load verification

## Before you push

    pnpm.cmd --filter codebility lint
    pnpm.cmd codebility:build

For a new fetch path or error boundary, exercise the failure path once, not only the healthy path. For a lazy component, verify the initial payload and the loaded state. Check the browser console and the dev server output before calling the change complete.
