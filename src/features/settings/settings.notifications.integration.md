# Notifications Settings

Route: `/settings/notifications`. This is separate from the existing `/notifications` feed and broadcast workflow. The route is a Server Component importing the client feature component.

## Integration Boundary

Inject a `NotificationSettingsAdapter` into `NotificationsSettingsPage`. Map the production data contract into the typed screen snapshot at the adapter boundary. Its `load` and `save` methods integrate with the existing TanStack Query hook. Use a distinct cache key per tenant/environment. The backend supplies management capability, aggregate counts, provider statuses, template summaries, and delivery activity; the form only edits configuration.

The mock adapter clones snapshots and stores settings in memory. Reloading resets fixtures. Channel controls, preferences, event matrices, schedules, defaults, provider details, and sample templates share one RHF/Zod draft. Configure and template dialogs apply draft changes; Save Changes persists the draft. Discard restores the last saved values. Provider changes become unverified rather than claiming a successful connection. No emails, push notifications, SMS, retries, broadcasts, audit events, or provider checks are executed.

## Requirements To Confirm

The full PRD v2.0 is unavailable locally. README confirms Email/Push/SMS channel settings. Screenshot labels, providers, event names, template counts, percentages, reminder text, quiet-hour exemptions, and defaults are illustrative screen fixtures, not an assumed production API or policy. Reminder schedules currently remain display strings; map backend structured schedules when the contract is available. Three sample templates are provided for editing; the screenshot's aggregate counts do not imply a complete mock template catalog. Existing user-type labels are preserved from the supplied design, not new authorization roles.

Backend owns delivery, consent/opt-out enforcement, retry scheduling, critical alert exemptions, provider credentials, connection verification, and authorization. Channel configuration intentionally contains non-secret provider/sender fields only. Keep real provider secrets on the server and never in query state. Event matrices are configuration, not frontend notification dispatch logic. Do not independently connect the finance screen's alert preferences to this screen without an agreed backend source of truth.

The email dialog also edits sender and reply-to email addresses. `testEmail` is an adapter operation with an honest mock result; production must validate and authorize test sends on the server. No credentials are collected. Category preferences are explicit per-user-type overrides, separate from the main table's channel defaults. Modal Cancel discards its local draft; Save Preferences/Save Config stages into the page draft. Reset stages the backend-supplied `defaults` snapshot and requires the page's Save Changes to persist. Booking-email disables require confirmation. Sonner shows success after staging or saving, with wording that distinguishes these operations.

## Verification

Tests cover snapshot isolation, persisted draft values, invalid times/retries, read-only writes, and honest provider status updates. Check 1280px+ desktop layout, accessible checkboxes, shared preference dialog values, template validation, quiet hours, save/discard, loading, error/retry, and empty sections before integrating a real API.
