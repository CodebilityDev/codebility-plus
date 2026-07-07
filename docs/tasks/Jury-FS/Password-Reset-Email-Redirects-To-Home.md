# Fix Password Reset Email Link Redirecting to /home

## Summary

When a user requests a password reset and clicks the link in the email, they get bounced to the `/home` dashboard instead of landing on the Account Settings page where the Change Password form lives. The destination the reset link points to is protected by an admin-only role permission, so any regular Codev whose role doesn't have that permission is redirected away and can never finish changing their password.

## Background

The reset flow targets `/home/settings/account-settings`. The password-reset action builds the link, the auth callback verifies the email token and forwards the user to that path, and then the middleware blocks it.

In `apps/codebility/app/auth/password-reset/action.ts`, a "passed" user gets a link to `/auth/callback?redirect_to=/home/settings/account-settings`. The middleware in `apps/codebility/middleware.ts` maps the `/home/settings` prefix to the `settings` permission, and `/home/settings/account-settings` falls under that prefix. Roles without the `settings` permission hit the redirect to `/home`, so they never reach the form.

Account Settings is a personal page — changing your own password, 2FA, and account deletion — so it shouldn't require the admin `settings` permission at all. The same page already exists at the ungated path `/home/account-settings` (it re-exports the same component), and that path is not in the middleware permission map, so it's reachable by any signed-in user.

## Objectives

- Make the password reset email link land every user on a working Change Password screen, regardless of their role permissions.
- Stop a successful password reset from having any side effect on the user's role or application status.
- Make a failed or expired reset token end in a clear sign-in/error state rather than a misleading dashboard redirect.

## Expected Behavior

- Clicking the reset link signs the recovery session in and opens the Account Settings page with the Change Password card visible and usable, for any role.
- No user is silently demoted or has their application status changed as a side effect of resetting their password.
- An invalid or expired link sends the user to sign-in with a clear message, not to `/home`.

## Acceptance Criteria

- [ ] A regular Codev (role without the `settings` permission) can click the reset email and reach the Change Password form.
- [ ] An admin can still reach the same form through the reset email.
- [ ] An applicant (non-passed user) reaches their account-settings page from the reset email.
- [ ] After a reset, the user's `role_id` and `application_status` are unchanged in the `codev` table.
- [ ] An expired/invalid reset link does not land the user on `/home`; it shows an error or returns them to sign-in.

## Solution Hint

Treat these as advisory, not prescriptive.

- Primary fix: in `apps/codebility/app/auth/password-reset/action.ts`, change the "passed" redirect target from `/home/settings/account-settings` to `/home/account-settings` (the ungated page that renders the same Account Settings component).
- Alternative if the nested URL must stay: allow `/home/settings/account-settings` past the `settings` permission check in `apps/codebility/middleware.ts` before the role-permission block runs.
- While in `apps/codebility/app/auth/callback/route.ts`, two related problems live in the same flow and are worth fixing in this pass:
  - The recovery token is verified with `verifyOtp({ type: "email" })`, but a recovery token's type is `"recovery"`. The call's error is never checked and the route redirects regardless of whether a session was actually established.
  - If the recovery arrives as a `code` (PKCE) param instead of `token_hash`, the callback runs its signup branch, which sets `role_id` to the Applicant role and `application_status` to `applying`, then sends the user to `/applicant/waiting`. That branch must not run for a password reset — it would demote an existing passed user. Distinguish recovery/sign-in from first-time signup before touching `role_id`/`application_status`.

## Reminders

- Test with two accounts: one regular Codev without the `settings` permission and one admin, plus one applicant. Confirm all three reach a change-password screen from the email.
- After resetting, check the `codev` row to confirm `role_id` and `application_status` didn't change.
- Test an expired/used link to confirm the error path.

## Instructions

- Branch off `dev`, e.g. `fix/password-reset-email-redirect`.
- Open the PR against `dev` with a short, factual description of the root cause and the fix.
