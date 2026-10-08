# Platform Content Settings

Route: `/settings/platform-content`. Its Server Component imports the client feature page. The settings overview links directly to this route.

## Data Boundary

Inject a `ContentSettingsAdapter` into `PlatformContentSettingsPage`. Map real backend contracts into the screen snapshot at this boundary. The existing TanStack Query pattern handles load/save, caching, pending/error states and retry. Give each tenant/environment a distinct cache key.

The mock adapter clones incoming/outgoing snapshots and persists the configuration only in memory. RHF/Zod holds one settings draft. Category add/edit/delete and document editor dialogs stage changes; their Cancel buttons discard local edits. The page Save Changes persists the draft, and Discard Changes restores the last saved snapshot. Disabling either blog visibility or blog enablement requires confirmation and changes only that selected setting. Existing content is never deleted.

Stats, module counts, public-page statuses/timestamps, and activity remain supplied snapshot values. Saving settings does not publish/unpublish/archive/schedule production content, alter counts, or generate audit records. Blog and banner management reuse their existing routes. FAQ, help article, taxonomy and public-page management are local preview catalogs; replace with agreed production workflows when available. Public/legal page bodies are placeholder preview copy, not approved legal policies. No production rich-text markup is generated or rendered.

## Requirements To Confirm

The full PRD v2.0 is not available locally. README confirms banner rules and blog defaults. Other visibility, publishing, approval, taxonomy, catalog and permission settings are screenshot-based presentation models, not assumed API contracts. Confirm status/permission policy, related entity IDs, deletion restrictions, review workflows and publishing actions with the backend before integration. The frontend `canManage` flag is not a security boundary. Production changes to legal text require the platform's normal review process.

The content page uses the existing settings confirmation dialog and theme tokens; draft warning badges use the corrected pale-yellow surface. Tests cover cloning, configuration saves, numeric/category validation, unchanged audit/aggregate data, and read-only writes. Verify 1280px+ layout and category validation, blog-disable cancellation, public-page edits, and Save/Discard before introducing a real adapter.
