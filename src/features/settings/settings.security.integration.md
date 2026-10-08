# Security Settings

Route: `/settings/security`. A Server Component imports the interactive feature page. The settings overview links directly to it. Configuration, session rows, activity, defaults and stats come from the injected `SecuritySettingsAdapter` through the established TanStack Query pattern.

## Preview Behavior

The mock adapter only updates in-memory fixtures. Saving a draft does not modify real authentication, passwords, 2FA enrollment, IP restrictions, cookies, device trust, account lockouts, login protection, or notification delivery. Session revoke/sign-out only remove preview rows and always preserve the current session. Activity and aggregate stats remain backend-supplied fixtures; no fake audit events are generated. Reloading reinitializes fixtures.

RHF/Zod owns configuration drafts. IP and 2FA dialogs apply local drafts to the page; modal Cancel does not change settings. Discard restores saved values and Reset Defaults stages the supplied defaults. Confirmation is required for account-lockout disabling, IP-restriction disabling, reset, and session actions. Session operations have async saving/error states and read-only checks.

The IP editor uses Zod's standard IPv4, IPv6, CIDRv4, and CIDRv6 validators. Comma/newline-separated editor input becomes an address array. The backend must enforce restrictions, verify current-IP coverage, account for proxies, and prevent administrator lockout. The displayed current IP is a mock session value, not a real detected address. No network firewall rules are created.

## Requirements To Resolve

The full PRD v2.0 is unavailable locally. README requires mandatory administrator 2FA, so the three enforcement controls are read-only and validated as true. Authenticator/email methods, grace periods, password-expiry controls, account flags, session limits, breach-password checks, statuses and other values are screenshot-based screen models, not production security policy. Confirm them against the PRD/backend before rollout.

Backend owns authorization, 2FA enrollment/verification, password checks, breached-password lookup, session invalidation, account protection, audit creation and notifications. Production sensitive changes need backend authorization/re-authentication, confirmations and validation; client checks are not a security boundary. Map real contracts into the view model at the adapter boundary and use a distinct cache key per tenant/environment. A production revoke response should refresh session/status summaries. Do not automatically synchronize the Users & Access security fields with this screen without a canonical backend source of truth.

Tests cover snapshot isolation, unchanged activity/stats, mandatory 2FA, IP/CIDR validation, current-session protection, sign-out isolation, and read-only mutations. Verify 1280px+ layout, the three dialogs, async error states, empty tables and Save/Discard before enabling a real adapter.
