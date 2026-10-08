# Users & Access Integration

`UsersAccessPage` accepts an `AccessAdapter` and defaults to `mockAccessAdapter`.
The UI receives snapshots through `useAccessSettings` (TanStack Query), never through direct network calls.

To connect the backend:

1. Implement `AccessAdapter.load()` and `AccessAdapter.execute(command)` using the existing API client.
2. Map confirmed backend responses to the screen's `AccessSnapshot`. The types here are view models, not assumed API payloads.
3. Give the adapter a distinct `cacheKey`, then select it in the client container. Keep the mock adapter for previews and tests.
4. Supply `canManage` from the authenticated backend capability response. Backend authorization must enforce every mutation, including permission changes.
5. Confirm fixed-role versus per-permission behavior and the staff creation/activation contract before wiring custom roles or temporary passwords. The README defines six system roles; the supplied screenshot shows five.

Only the mock adapter simulates status and counter updates. Production must return updated settings, counts, invitation state, permissions, and audit records from the backend.
No real invitation, credential email, authentication policy, or audit record is created by this preview. Temporary passwords are not stored by the mock adapter.
Mock changes survive navigation in the current browser session, but reset on a full reload.
