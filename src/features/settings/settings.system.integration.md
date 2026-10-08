# System Settings Integration

## Scope

The supplied System screenshots and README's System Settings section define this screen. The full PRD v2.0 is not available in the repository. Verify permissions, configuration ownership, supported option values, and operational restrictions against the PRD and backend contract before production integration.

## Data Boundary

The server route renders `SystemSettingsPage`. The page consumes an injectable `SystemSettingsAdapter` through `useSystemSettings`; presentation receives typed snapshot data. Fixtures live in `data/settings.system.data.ts`, independently of UI. These types are preview view models, not a claimed backend API contract.

`load` supplies settings, permission availability, stats, backups, integrations, storage, and health metadata. `save` validates configuration and returns the authoritative snapshot. RHF keeps a draft until Save; Discard restores the last saved snapshot. Snapshot aggregates and infrastructure metadata are not recalculated by the frontend.

`operate` exposes cache clearing, backup creation/restoration, test email, and maintenance scheduling. The mock returns explicit preview feedback only: it does not clear caches, create backups, restore data, send email, schedule jobs, or append audit events. Real operations require server authorization, validation, idempotency where appropriate, and independently reported job/error states. Restore must validate snapshot availability and require server-side safeguards.

Scheduled inputs are UTC; the form validates enabled windows with an end after start. Actual scheduling and user notifications belong to the backend. Disabling a module stages configuration without deleting existing records.

## Integration Ownership

Paystack configuration reuses the Finance adapter, hook, and dialog. Public/secret key inputs go directly to that configuration operation and are not retained in System settings or query/mutation caches. Only redacted metadata is returned. The UI does not verify a real provider connection. Other provider buttons link to Notification settings. Snapshot connection badges remain fixture values until authoritative backend health data replaces them.

System/General/Finance/Notification fields currently have independent mock ownership. Resolve shared settings to a canonical backend source before integration; do not add speculative client-side synchronization. System, error, and audit links use the existing `/audit-logs` screen, without invented filter contracts.

## States and Verification

Loading skeleton, load error/retry, empty backup state, read-only controls, field validation, async operation errors, busy dialogs, dirty draft, and save feedback are included. Adapter tests cover isolation, validation, unchanged infrastructure snapshots, missing backups, and read-only rejection. Layout targets desktop widths of 1280px and above.
