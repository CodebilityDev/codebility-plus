# Removing hydration-deferral hooks

## Problem

`useIsMounted` defers a value to a second client render so the server and the
first client paint agree. The value it defers is a clock read, which the server
can compute once per request instead.

```
useIsMounted -> useCurrentYear / useFormattedDate -> 4 render sites
```

Each site renders `value ?? ""`, so the server emits an empty string and the
client fills it in after mount.

## Fix

Compute the date once per request on the server and pass it down as a prop.

| File | Change |
|---|---|
| `hooks/global/useIsMounted.ts` | delete |
| `hooks/global/useCurrentYear.ts` | delete |
| `hooks/global/useFormattedDate.ts` | delete |
| `app/(marketing)/layout.tsx` | server component computes the year, passes it to the footer |
| `components/marketing/MarketingFooter.tsx` | take `year` as a prop |
| `app/proposal/page.tsx` | pass `year` into the view |
| `components/global/marketing/ProposalView.tsx` | take `year` as a prop |
| `app/nda-signing/public/page.tsx` | split into a server page plus a client view |
| `app/nda-signing/[token]/page.tsx` | pass `formattedDate` into the client |

The date comes from a cached helper in `lib/global/` so marketing routes keep
prerendering. A bare `new Date()` in the layout would make every marketing route
dynamic.

## Preventing recurrence

Two lint rules, staged through `DEBT_RULES` as warnings first:

1. Flag a `useEffect` whose body is a single `setState(true)` with empty deps when
   the flag is only read in a ternary or `??`. This catches `useIsMounted`, the
   old modal providers, and the four components already removed.
2. Flag `new Date()` and `Math.random()` during render, the root cause that forces
   the flag. Both have already caused hydration work in this codebase.

## Same root cause, swept in the same pass

- `BubbleBackground.tsx` generates layout in a mount effect.
- `OnboardingClient.tsx` and `app/applicant/profile/layout.tsx` use render-phase
  one-shot flags for the same purpose.
