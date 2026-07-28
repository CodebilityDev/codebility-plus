# Feature Specification: Two-Factor Authentication (2FA)

## Executive Summary

Implement an enterprise-grade Two-Factor Authentication (2FA) system for the Codebility platform utilizing Supabase Auth Multi-Factor Authentication (MFA) via Time-based One-Time Password (TOTP) standard (RFC 6238).

---

## 1. Security & Method Evaluation

| Authentication Method | Security Rating | Phishing Resistance | UX / Operational Cost | Selection Decision |
| :--- | :--- | :--- | :--- | :--- |
| **TOTP (Authenticator App)** | **High** | Moderate (Phishing-susceptible without WebAuthn, but highly secure against credential stuffing) | High user familiarity, zero SMS cost | **SELECTED (Primary)** |
| **SMS-based OTP** | Low (SIM Swap, Interception) | Low | Dependency on telecom gateways & high recurring costs | Rejected |
| **WebAuthn / FIDO2** | Highest | Maximum (Cryptographically bound) | Advanced, requires fallback mechanism | Future Roadmap |

---

## 2. Architecture & Authentication Flow

### Enrollment Workflow
1. User navigates to `/home/account-settings` -> `Two-Factor Authentication` section.
2. User clicks **Enable 2FA**.
3. Server invokes `supabase.auth.mfa.enroll({ factorType: 'totp' })` to receive `qr_code`, `secret`, and `factorId`.
4. UI displays QR Code & manual key entry alongside a verification input box.
5. User scans QR code with authenticator app (Google Authenticator, Authy, 1Password, etc.) and enters 6-digit TOTP code.
6. Server verifies code via `supabase.auth.mfa.challengeAndVerify({ factorId, code })`.
7. Upon successful verification, 2FA status is set to active and 10 single-use Backup Recovery Codes are generated and presented to the user to download/save.

### Login / Verification Workflow
1. User logs in with email/password (Assurance Level: `aal1`).
2. Middleware checks active MFA factors for user via `supabase.auth.mfa.getAuthenticatorAssuranceLevel()`.
3. If `currentLevel` is `aal1` and `nextLevel` is `aal2` (MFA enrolled):
   - Redirect user to `/auth/2fa-challenge`.
4. User enters 6-digit TOTP code or Backup Recovery Code.
5. Server executes `supabase.auth.mfa.challengeAndVerify()`. Session assurance level upgrades to `aal2`.
6. User is redirected to their intended dashboard path.

---

## 3. Threat Assessment & Mitigations

- **Brute Force Attempts**: Rate-limit 2FA challenge attempts (max 5 consecutive failures before temporary cooldown).
- **Session Hijacking**: Enforce strict HTTP-only secure cookie sessions with Supabase SSR (`@supabase/ssr`).
- **Lost Authenticator Device**: Provide cryptographic Backup Recovery Codes stored hashed in database for emergency access.
- **Unauthorized Disabling**: Require password re-authentication before disabling 2FA or regenerating recovery codes.

---

## 4. Implementation Objectives & Acceptance Criteria

- [ ] **Account Settings UI Integration**: Update `AccountSettings2FA.tsx` to display active status, Enable/Disable modal dialogs, QR Code setup, and Backup Code management.
- [ ] **Auth Challenge Screen**: Create `/auth/2fa-challenge` route and client component for post-login TOTP verification.
- [ ] **Middleware Enforcement**: Update `apps/codebility/middleware.ts` to check `AuthenticatorAssuranceLevel` and enforce `aal2` for users with enrolled 2FA factors.
- [ ] **Backup Recovery Codes**: Implement database storage (`user_mfa_recovery_codes` table or encrypted user metadata) and verification logic.
- [ ] **Audit Logging**: Log 2FA enable, disable, and failed challenge events for security tracking.

---

## 5. Proposed Branch & PR Protocol

- **Branch Name**: `feature/2fa-totp-authentication/juryyy`
- **Target PR**: `dev`
- **Scope**: Dedicated PR under Jury Security tasks (`/juryyy`).
