# Sign-In Rate Limiting Is Never Called (Plus Password Reset Cleanup)

## Summary

`lib/rate-limiter.ts` was added with working `checkRateLimit` / `recordRateLimitAttempt` / `resetRateLimit` functions, and imported into `app/auth/actions.ts` — but nothing ever calls them. Sign-in has no rate limiting. Two other files in the same change also import functions they never use.

The password reset action in the same change fixed a real bug, but introduced a user-enumeration leak that should be closed at the same time.

## Background

### The rate limiter is dead code

`app/auth/actions.ts:7`:

```ts
import { checkRateLimit, recordRateLimitAttempt, resetRateLimit } from "@/lib/rate-limiter";
```

That import is the only reference to the module anywhere in the app. The sign-in action never calls any of the three functions, so the 73 lines in `lib/rate-limiter.ts` have no effect. Sign-in accepts unlimited password attempts.

Two more imports in the same change are also unused:

- `app/home/account-settings/_components/AccountSettingsChangePassword.tsx:19` — imports `updatePassword`, never called
- `app/home/account-settings/_components/AccountSettingsDialog.tsx:31` — imports `updateEmail`, never called

Worth checking whether those two were meant to replace inline logic that is still in place.

### The in-memory store will not survive production

`lib/rate-limiter.ts` keeps state in a module-level `Map`. In a serverless deployment each instance has its own copy and it is wiped on cold start, so an attacker spreading attempts across instances is barely slowed. It also grows unbounded for unique keys within a window.

This repo already has Redis wired up — `lib/server/redis.ts`, `lib/server/redis-cache.ts`, and `ioredis` in `package.json` — with a graceful-fallback pattern already established. That is the natural backing store.

Minor: `checkRateLimit` declares a `windowMs` parameter it never uses, and `cleanupExpiredEntries()` scans the whole map on every call.

### Password reset — one real fix, one regression

`app/auth/password-reset/action.ts` correctly fixed a genuine bug: the redirect decision read `data.availability_status === "passed"` when the value actually lives on `application_status`. That fix is good and should stay.

Two things to address:

1. **User enumeration.** The action now throws `"No account found with this email address"`, which tells anyone probing the endpoint exactly which emails have accounts. Password reset should behave identically whether or not the address exists.
2. **Origin fallback.** `const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000"` — if both the header and the env var are missing in production, reset links point at localhost. Better to fail loudly than to send broken links.

Also confirm intent: non-passed users now redirect to `/applicant/waiting` instead of `/applicant/account-settings`. That may be deliberate, but it is a behavior change worth stating in the PR.

## Objectives

- Make sign-in rate limiting actually run.
- Back it with a store that works across instances.
- Remove or wire up the other unused imports.
- Close the enumeration leak without losing the `application_status` fix.

## Expected Behavior

- Repeated failed sign-in attempts for the same identifier are blocked after a threshold, with a clear message telling the user when to try again.
- A successful sign-in clears the counter for that identifier.
- The limit holds regardless of which server instance handles the request.
- Requesting a password reset returns the same response whether or not the email is registered.
- No file imports a function it does not call.

## Acceptance Criteria

- [ ] `checkRateLimit` is called before the sign-in attempt, `recordRateLimitAttempt` on failure, and `resetRateLimit` on success.
- [ ] A blocked user sees a message including how long until they can retry.
- [ ] Rate limit state is shared across instances (Redis), with a sensible fallback if Redis is unavailable.
- [ ] Verified by test: N failed sign-ins produce a block; waiting out the window restores access; a successful sign-in resets the counter.
- [ ] `AccountSettingsChangePassword.tsx` and `AccountSettingsDialog.tsx` either use their imports or drop them.
- [ ] Password reset returns an identical response for registered and unregistered emails.
- [ ] The `application_status` fix is preserved.
- [ ] The origin fallback no longer silently produces localhost URLs in production.

## Solution Hint

Treat these as advisory, not prescriptive.

**Key the limit carefully.** Keying on email alone lets an attacker lock a known user out of their own account by burning attempts deliberately. Keying on IP alone is defeated by rotation and punishes shared networks. A common compromise is to track both and block on whichever trips first, with a more forgiving IP threshold.

**Reuse the existing Redis setup** in `lib/server/redis.ts` rather than adding a new dependency. Follow the graceful-fallback pattern already used there — if Redis is down, sign-in should still work rather than failing closed and locking everyone out.

**For enumeration**, keep the internal lookup (you still need `application_status` to pick the redirect) but return the same success response either way, and only skip the send when there is no account. Log the miss server-side rather than surfacing it.

**For the origin fallback**, drop the `"http://localhost:3000"` default and throw if neither the header nor the env var is present — a loud failure in staging beats broken reset links in production.

Rate limiting will also be needed for 2FA recovery-code attempts (see the recovery codes task). Build the helper so it can serve both.

## Reminders

- The unused imports are the whole reason this needs revisiting — the feature reads as shipped but does nothing. Verify by actually attempting repeated bad logins, not by reading the diff.
- Keep the `availability_status` → `application_status` fix. It is correct.
- Do not fail sign-in closed when Redis is unreachable.

## Instructions

- Branch naming: `fix/sign-in-rate-limiting/Jury`.
- PR should include the chosen key strategy and thresholds, and the result of the manual lockout test.
- Call out whether the `/applicant/waiting` redirect change was intentional.
