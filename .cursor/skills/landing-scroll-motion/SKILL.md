---
name: landing-scroll-motion
description: >-
  Marketing landing scroll-reveal and client-effect optimizations for
  apps/codebility marketing page sections. Prefer whileInView + viewport once,
  React.use / useSyncExternalStore / useTransition over useEffect. Use when
  editing landing motion, scroll listeners, image load state, CoDevs pager,
  FloatingParticles, sidenav shrink, or when removing useEffect from marketing
  client components.
---

# Landing scroll motion + effect replacements

**Always read this skill** before changing marketing landing animations,
scroll listeners, or client-side effects under
`apps/codebility/app/(marketing)/`.

## Editing rule

Do not put comments when editing files. No `//`, `/* */`, or JSX `{/* */}`.

## Goals

- Section enter animations run **once** on scroll-in and **never re-hide**.
- Prefer Framer Motion viewport APIs over `useInView` + ternary `animate`.
- Prefer React 19 subscription / transition / event APIs over `useEffect`.
- Keep marketing `/` static (pair with `nextjs-static-public-data` for data).

## Scroll reveal (canonical)

```tsx
const VIEWPORT = { once: true, amount: 0.2 } as const;

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={VIEWPORT}
>
  <motion.div variants={itemVariants}>…</motion.div>
</motion.div>
```

### Rules

1. Use `whileInView` + `viewport={{ once: true, … }}`.
2. **Do not** use `animate={isInView ? "visible" : "hidden"}` — that can
   re-hide when the boolean flickers or remounts.
3. **Do not** use mount-only `animate="visible"` for below-fold sections
   (Admins lesson) — user never sees the enter.
4. Hero / above-fold may keep mount `animate`.
5. Nested opacity parents must **not** wrap already-independent children in
   `hidden: { opacity: 0 }` if those children manage their own reveal
   (Interns shell: animate header separately from `{children}`).
6. Pager remounts: avoid `key={page}` on the motion root; keep a module flag
   (`hasEntered…`) so remounts start `visible` after first enter.

## Replace `useEffect` (decision table)

| Need | Prefer | Avoid |
|------|--------|--------|
| Browser event → React state (scroll threshold, hash) | `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` | `useEffect` + `addEventListener` |
| Client-only random / cached value (particles) | Module cache + `useSyncExternalStore` with empty server snapshot | `useEffect` + `setState` on mount |
| Imperative one-shot DOM (force scroll top) | `useSyncExternalStore` subscribe runs setup, cleanup returns disposer | `useEffect(() => {…}, [])` |
| Image load / error | Native `onLoad` / `onError` → `useState` | `useEffect` + `new Image()` preload |
| Batch image preload for visible `<img>` | Delete — browser loads the real tags | Redundant `useEffect` preload loop |
| Public list page 2+ | `React.use(promise)` + module `Map` (see static-public-data skill) | `useEffect` fetch |
| Urgent UI vs deferred list update (pager) | `useTransition` → `startTransition(() => setPage(n))` | Blocking `setPage` only |
| Scroll-in animation | `whileInView` / `onViewportEnter` | `useEffect` + IntersectionObserver |

### `useSyncExternalStore` checklist

- `getServerSnapshot` must match SSR HTML (usually `false` / `[]` / `""`).
- `getSnapshot` must be referentially stable when the value is unchanged
  (booleans / primitives OK; avoid returning a new object each call).
- Always remove listeners in the subscribe cleanup.
- Use `{ passive: true }` for scroll listeners.

### `useTransition` checklist

- Wrap non-urgent state that suspends or re-renders heavy lists
  (CoDevs `setPage`).
- Optionally dim UI with `isPending` (`opacity-60`) — do not blank the section.

## Reference files

- Features / Why Choose / Work With Us / Partners / Calendly / Admins /
  Testimonials carousel: `whileInView` + `VIEWPORT`
- CoDevs cards: `LandingIntern-CodevCard.tsx` (`onLoad` / module enter flag)
- CoDevs pager: `LandingIntern-CodevPagination.tsx` (`use` + `useTransition`)
- Particles: `FloatingParticles.tsx` (`useSyncExternalStore` + module cache)
- Sidenav shrink: `MarketingSidenavMenu.tsx` (`useSyncExternalStore`)
- Scroll helpers: `ForceScrollTop.tsx`, `LandingScrollToHash.tsx`

## Anti-patterns

- `useEffect` for data that belongs in RSC / `unstable_cache` / `use()`
- `useEffect` for scroll/mouse when `useSyncExternalStore` fits
- Dead motion subscriptions (listeners updating unused `MotionValue`s)
- `viewport.once: false` for marketing section enters
- Comments in edited source (see Editing rule)
