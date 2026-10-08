# Hosté Management Integration

`HosteManagementPage` consumes an injectable `HosteSettingsAdapter` through a TanStack Query hook. Presentational sections use the validated RHF form, not API calls.

Implement `load` and `save` with the existing API client after confirming endpoints and contracts. Map responses into the screen view model, use a distinct `cacheKey`, and return the saved configuration and backend-owned statistics. Supply authenticated `canManage`; backend authorization remains mandatory.

The mock adapter retains configuration during browser navigation and resets on full reload. Changes are drafted locally and only applied through Save All Changes. No subscription billing, commission calculation, account suspension, email dispatch, or audit events occur.

Screenshot commission values (20%, 30%, 35%) are illustrative fixtures, not the README's production service-fee rules. Confirm these settings, subscription durations, badge behavior, and verification requirements against PRD v2.0 before API integration. PRD v2.0 was not available locally.

Unknown subscription-log and badge-audit destinations are not fabricated. Quick actions link to existing profiles and sections of this screen.
