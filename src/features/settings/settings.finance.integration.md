# Payment & Finance Settings

Route: `/settings/payments-finance`. The settings overview links to `PaymentFinanceSettingsPage`.

## Data Boundary

Inject a `FinanceSettingsAdapter` into the feature page. Its `load` and `save` methods return a screen snapshot; `configureGateway` returns redacted gateway information, and `testConnection` returns the backend's connection-check result. Set a distinct cache key for the tenant/environment. Map real response contracts at this boundary, rather than changing the form components. Credentials bypass TanStack mutation state and must never be returned, logged, or cached.

The mock adapter holds configuration in memory for this preview. Reloading initializes fixtures again. Draft changes use RHF and Zod. Saving updates configuration only, not transactions, payouts, refunds, aggregates, notifications, or activity records. The gateway check performs no network request. Configuring dummy credentials marks the gateway unverified; it never retains their raw values. An empty secret means the existing secret is unchanged. The webhook URL is deliberately absent until supplied by a backend.

## Requirements To Resolve

The full PRD v2.0 is not available locally. README finance requirements specify a 10% service fee and NGN 1,000 platform fee per Hoste engagement. The screenshot's 20/35/30% commissions, fees, payment methods, thresholds, and automation options are illustrative configuration view models, not approved backend rules. Confirm all these against the PRD before production integration.

Backend authorization must enforce management rights; `canManage` only disables controls. Backend owns payment verification, escrow release, commissions, payout/refund calculations and transitions, notifications, and audit creation. Gateway keys must go to an authenticated server endpoint, never directly to Paystack from the browser. No endpoint URLs or production key-validation rules are assumed here. Manage Payouts opens the existing Payments & Payouts route; financial activity displays the supplied records without generating fake audits.

## Verification

`settings.finance.test.ts` covers snapshot isolation, validation, credential redaction, honest mock checks, and read-only writes. Verify the page at 1280px and above, and exercise configuration, commission confirmation, payment-method disabling, refund draft synchronization, save, discard, loading, error, and empty states before enabling a real adapter.
