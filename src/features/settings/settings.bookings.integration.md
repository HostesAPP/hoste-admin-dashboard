# Bookings & Groups Settings Integration

The page uses `useBookingsSettings` and an injectable `BookingsSettingsAdapter`. Replace the mock `load` / `save` implementation using the project's API client once endpoint contracts are confirmed. Map backend configuration and statistics into the screen models, return the canonical saved snapshot, and use a distinct cache key.

`canManage` must come from authenticated capabilities. UI checks are not a security boundary; the backend must authorize every settings mutation.

Mock data follows the supplied screenshots and survives browser navigation, but resets on full reload. No refunds, commission calculations, assignment decisions, notifications, group permissions, or booking status transitions run in the frontend. Disabling groups and booking types stages configuration only.

PRD v2.0 was not available locally. Screenshot commission percentages, cancellation fee (USD 25), timing options, and group limits are illustrative values, not confirmed production financial rules. Confirm these against the PRD and API before integration. The existing README documents NGN/USD/GBP and a different production fee structure.
