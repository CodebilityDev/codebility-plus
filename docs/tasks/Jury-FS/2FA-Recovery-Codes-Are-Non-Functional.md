# 2FA Recovery Codes Are Non-Functional (Live Lockout Risk)

## Summary

When a user enables Two-Factor Authentication, the app generates 10 backup recovery codes and shows them in a modal telling the user to save them somewhere safe. Those codes are never stored anywhere, and the login screen's "Use Backup Recovery Code" path is a placeholder that rejects every code it is given.

The result: **any user who enables 2FA and then loses their authenticator device is permanently locked out of their account**, holding a list of recovery codes that cannot work. This is live on production today.

Priority: highest of the open auth items. Every new 2FA enrollment adds another user who can be locked out.

## Background

### Codes are generated but never persisted

`app/home/account-settings/_components/AccountSettings2FA.tsx:118-124`, immediately after successful enrollment:

```ts
// Generate 10 random single-use backup recovery codes
const generatedCodes = Array.from({ length: 10 }, () =>
  Math.random().toString(36).substring(2, 6).toUpperCase() + "-" +
  Math.random().toString(36).substring(2, 6).toUpperCase()
);
setRecoveryCodes(generatedCodes);
setIsRecoveryOpen(true);
```

There is no database write. The codes exist only in React state and are gone when the modal closes. There is no table storing them and nothing to compare against later.

Separately, `Math.random()` is not cryptographically secure and must not be used to generate authentication secrets.

### Verification always fails

`app/auth/2fa-challenge/_components/TwoFactorForm.tsx:56-60`:

```ts
if (isBackupMode) {
  // Backup Recovery Code check placeholder / code verification
  toast.error("Invalid recovery code. Please check your backup codes or try TOTP.");
  setIsLoading(false);
  return;
}
```

The branch is reachable from the UI — `TwoFactorForm.tsx:119-125` renders a "Use Backup Recovery Code" toggle. So users can and will try it, and are told their correct code is invalid.

### There is no self-service way out

`AccountSettings2FA.tsx:138` (`handleDisable2FA`) calls `supabase.auth.mfa.unenroll()`, which requires an authenticated `aal2` session. A user who cannot pass the 2FA challenge cannot reach it. Recovery currently requires someone with database access removing the MFA factor by hand.

### What is working

The TOTP path itself is correct and should not be changed: `middleware.ts:128-137` implements the Supabase assurance-level check properly, and `TwoFactorForm.tsx:64` uses `challengeAndVerify` correctly.

## Objectives

- Stop presenting users with recovery codes that cannot work.
- Give a user who has lost their authenticator a supported way to regain access.
- Make sure no authentication secret is generated with `Math.random()`.
- Change nothing about the working TOTP challenge flow.

## Expected Behavior

- A user who enrolls in 2FA either receives recovery codes that actually work, or is told clearly that recovery requires contacting an admin — never codes that silently do nothing.
- Entering a valid recovery code at the 2FA challenge signs the user in and consumes that code, so it cannot be reused.
- Entering an invalid or already-used recovery code is rejected.
- Users already enrolled under the broken flow are not left stranded.

## Acceptance Criteria

- [ ] The "Use Backup Recovery Code" option either works end to end, or is removed from the UI along with the enrollment modal that hands out codes.
- [ ] No path shows a user a recovery code that is not verifiable.
- [ ] If codes are implemented: they are generated with a CSPRNG, stored hashed (never plaintext), verified server-side, and single-use.
- [ ] If codes are implemented: reusing a consumed code fails.
- [ ] A documented recovery path exists for users already enrolled before this fix.
- [ ] The TOTP challenge flow still works — verified by enrolling and logging in with an authenticator app.
- [ ] `Math.random()` is not used to generate any authentication value.

## Solution Hint

Treat these as advisory, not prescriptive.

**Do the safe part first.** The fastest way to stop the harm is to remove the backup-code UI — the toggle in `TwoFactorForm.tsx:119-125` and the recovery-code modal in `AccountSettings2FA.tsx` — and replace it with a short line telling users that losing their device means contacting an admin. That is a small, low-risk change that ends the false promise immediately. Real recovery codes can follow as a second PR.

**If implementing real recovery codes:** note that Supabase Auth has no built-in backup-code feature for MFA, so this has to be built. Confirm that against the current Supabase docs before starting. The rough shape:

- A table (e.g. `mfa_recovery_codes`) holding `codev_id`, a **hash** of each code, `used_at`, `created_at`. RLS should deny all direct client access — only server code touches it.
- Generate with `crypto.randomBytes` / `crypto.getRandomValues`, not `Math.random()`.
- Show the plaintext codes exactly once at enrollment, then store only hashes.
- Verification must happen in a server action, not in the client component. Compare the hash, check `used_at IS NULL`, mark it used, then elevate the session. Elevating without a TOTP code needs the service-role admin API — work out that step before committing to this approach, as it is the hard part.
- Rate limit recovery attempts (see the sign-in rate limiting task — same helper should cover this).

**For users already enrolled:** you will need a documented admin procedure to remove a factor for a locked-out user. Worth adding regardless of which option is chosen.

## Reminders

- This is live. Every day it stays, more users enroll and become lockout candidates.
- Removing the misleading UI is a valid and useful first PR. Do not let the full implementation block the quick fix.
- Do not touch `middleware.ts:128-137` or the `challengeAndVerify` call — that part is correct.
- Never store recovery codes in plaintext, and never verify them client-side.

## Instructions

- Branch naming: `fix/2fa-recovery-codes/Jury`.
- Split into two PRs if helpful: (1) remove the misleading UI, (2) implement real recovery codes.
- PR should state which option was taken and, if codes were implemented, how a code is verified and consumed.
