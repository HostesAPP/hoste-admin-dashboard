"use client";

import { useState } from "react";
import Link from "next/link";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SettingsHeader } from "./settings.header";
import { SettingsSection } from "./settings.section";
import { NotificationConfirmDialog as SettingsConfirmDialog } from "./notifications.settings.dialogs";
import {
  ContentCategoriesDialog,
  ContentDocumentEditor,
} from "./content.settings.dialogs";
import {
  ContentActivityTable,
  ContentDocumentsTable,
  ContentNumber,
  ContentToggleRows,
} from "./content.settings.sections";
import { CONTENT_CONTROL_GROUPS } from "../data/settings.content.data";
import { contentSettingsSchema } from "../schemas/settings.content.schema";
import { mockContentSettingsAdapter } from "../settings.content.adapter";
import { useContentSettings } from "../hooks/settings.content.hooks";
import type {
  ContentDocument,
  ContentSettings,
  ContentSettingsAdapter,
  ContentSettingsSnapshot,
} from "../settings.content.types";

type DocumentCollection = "publicPages" | "faqs" | "helpArticles";
const COLLECTION_LABELS: Record<DocumentCollection, string> = {
  publicPages: "Public & Legal Pages",
  faqs: "Frequently Asked Questions",
  helpArticles: "Help & Support Knowledge Base",
};
const LINK_CLASS =
  "inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline";

export function PlatformContentSettingsPage({
  adapter = mockContentSettingsAdapter,
}: {
  adapter?: ContentSettingsAdapter;
}) {
  const query = useContentSettings(adapter);
  if (query.isPending)
    return (
      <div
        role="status"
        aria-label="Loading platform content settings"
        className="space-y-5 p-8"
      >
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  if (query.isError)
    return (
      <div role="alert" className="p-8">
        <h1 className="text-xl font-semibold">
          Unable to load platform content settings
        </h1>
        <p className="my-3 text-sm text-muted-foreground">
          {query.error.message}
        </p>
        <Button onClick={() => query.refetch()}>Try Again</Button>
      </div>
    );
  return (
    <PlatformContentSettingsForm
      snapshot={query.data}
      saving={query.isSaving}
      onSave={query.save}
    />
  );
}

function PlatformContentSettingsForm({
  snapshot,
  saving,
  onSave,
}: {
  snapshot: ContentSettingsSnapshot;
  saving: boolean;
  onSave: ContentSettingsAdapter["save"];
}) {
  const form = useForm<ContentSettings>({
    resolver: zodResolver(contentSettingsSchema),
    defaultValues: snapshot.settings,
  });
  const categoryGroups = useWatch({
    control: form.control,
    name: "categoryGroups",
  });
  const publicPages = useWatch({ control: form.control, name: "publicPages" });
  const [search, setSearch] = useState("");
  const [categoriesIndex, setCategoriesIndex] = useState<number | null>(null);
  const [catalog, setCatalog] = useState<DocumentCollection | null>(null);
  const [editor, setEditor] = useState<{
    collection: DocumentCollection;
    document: ContentDocument;
  } | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<{
    title: string;
    description: string;
    action: string;
    cancelLabel?: string;
    destructive?: boolean;
    confirm: () => void;
  } | null>(null);
  const disabled = !snapshot.canManage || saving;
  const matches = (text: string) =>
    text.toLowerCase().includes(search.trim().toLowerCase());
  const group = (id: string) =>
    CONTENT_CONTROL_GROUPS.find((item) => item.id === id)!;
  const groupMatches = (id: string) => {
    const item = group(id);
    return matches(
      `${item.title} ${item.fields.map((field) => field.label).join(" ")}`,
    );
  };
  const confirmDisable = (apply: () => void) =>
    setConfirmation({
      title: "Disable Blog on Platform?",
      description:
        "The Blog section will no longer be visible to platform users. Existing posts remain saved and can be enabled again later.",
      action: "Disable Blog",
      destructive: true,
      confirm: apply,
    });
  const discard = () =>
    setConfirmation({
      title: "Discard Changes?",
      description:
        "You have unsaved configuration changes in Platform Content settings. Are you sure you want to leave without saving?",
      action: "Discard Changes",
      cancelLabel: "Keep Editing",
      confirm: () => {
        form.reset(snapshot.settings);
        setError("");
      },
    });
  const save = form.handleSubmit(async (values) => {
    setError("");
    try {
      const response = await onSave(values);
      form.reset(response.settings);
      toast.success("Changes saved successfully in preview.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save content settings.",
      );
    }
  });
  const controls = (id: string) => (
    <ContentToggleRows
      group={group(id)}
      disabled={disabled}
      onDisableBlog={confirmDisable}
    />
  );
  const editDocument = (
    collection: DocumentCollection,
    document: ContentDocument,
  ) => {
    setCatalog(null);
    setEditor({ collection, document });
  };
  const actionFor = (id: string) =>
    id === "faqs" ? "faqs" : id === "help" ? "helpArticles" : "publicPages";

  return (
    <FormProvider {...form}>
      <div className="min-w-[1024px] tracking-normal">
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "!rounded-full !border-secondary !bg-secondary !text-secondary-foreground",
            },
          }}
        />
        <SettingsHeader search={search} onSearch={setSearch} />
        <form
          onSubmit={save}
          className="mx-auto max-w-[1440px] space-y-5 px-8 pb-8 pt-7 [&_section]:rounded-lg"
        >
          <header className="flex items-center justify-between gap-5">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">
                <Link href="/settings" className="hover:underline">
                  Settings
                </Link>{" "}
                / Platform Content
              </p>
              <h1 className="text-2xl font-bold">Platform Content Settings</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Manage platform content, visibility, publishing preferences, and
                public-facing information
              </p>
            </div>
            <Button
              type="submit"
              disabled={disabled || !form.formState.isDirty}
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Changes
            </Button>
          </header>
          {!snapshot.canManage && (
            <p className="text-xs text-muted-foreground">
              You have view-only access to platform content settings.
            </p>
          )}
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          <div className="grid grid-cols-6 gap-3">
            {snapshot.stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="text-[11px] text-muted-foreground">
                  {stat.label}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-xl font-bold">{stat.value}</p>
                  {stat.tone && (
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full ${stat.tone === "warning" ? "bg-yellow" : "bg-secondary"}`}
                    />
                  )}
                </div>
                <div className="mt-2 text-right">
                  {stat.id.includes("blog") || stat.id === "banners" ? (
                    <Link
                      href={stat.id === "banners" ? "/banners" : "/blog"}
                      className={LINK_CLASS}
                    >
                      {stat.id === "published-blog" ? "View" : "Manage"}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={LINK_CLASS}
                      onClick={() => setCatalog(actionFor(stat.id))}
                    >
                      {stat.id === "faqs" ? "Manage" : "View"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {snapshot.modules.some((module) => matches(module.title)) && (
            <div>
              <h2 className="mb-3 text-sm font-semibold">
                Content Management Modules
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {snapshot.modules
                  .filter((module) => matches(module.title))
                  .map((module) => (
                    <div
                      key={module.id}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <h3 className="text-sm font-semibold">{module.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {module.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-[11px] font-medium">
                          {module.summary}
                        </p>
                        {module.id === "blog" || module.id === "banners" ? (
                          <Link
                            href={module.id === "blog" ? "/blog" : "/banners"}
                            className="rounded-md bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/15"
                          >
                            {module.action}
                          </Link>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="bg-primary/10 text-xs text-primary"
                            onClick={() => setCatalog(actionFor(module.id))}
                          >
                            {module.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {groupMatches("visibility") && (
            <SettingsSection title={group("visibility").title}>
              <p className="mb-3 text-xs text-muted-foreground">
                {group("visibility").description}
              </p>
              {controls("visibility")}
            </SettingsSection>
          )}
          <div className="grid grid-cols-2 items-start gap-5">
            {(groupMatches("banners") || matches("Maximum Active Banners")) && (
              <SettingsSection title={group("banners").title}>
                <p className="mb-3 text-xs text-muted-foreground">
                  {group("banners").description}
                </p>
                <ContentToggleRows
                  group={{
                    ...group("banners"),
                    fields: group("banners").fields.slice(0, 1),
                  }}
                  disabled={disabled}
                  onDisableBlog={confirmDisable}
                />
                <ContentNumber
                  name="maxActiveBanners"
                  label="Maximum Active Banners"
                  disabled={disabled}
                />
                <ContentToggleRows
                  group={{
                    ...group("banners"),
                    fields: group("banners").fields.slice(1),
                  }}
                  disabled={disabled}
                  onDisableBlog={confirmDisable}
                />
                <Link href="/banners" className={`${LINK_CLASS} mt-4`}>
                  Manage Banners Flow
                  <ArrowRight className="size-3" />
                </Link>
              </SettingsSection>
            )}
            {(groupMatches("blog") || matches("Posts per Page")) && (
              <SettingsSection title={group("blog").title}>
                <p className="mb-3 text-xs text-muted-foreground">
                  {group("blog").description}
                </p>
                {controls("blog")}
                <ContentNumber
                  name="postsPerPage"
                  label="Posts per Page"
                  disabled={disabled}
                />
                <Link href="/blog" className={`${LINK_CLASS} mt-4`}>
                  Manage Blog Flow
                  <ArrowRight className="size-3" />
                </Link>
              </SettingsSection>
            )}
          </div>
          <div className="grid grid-cols-2 items-start gap-5">
            {groupMatches("help") && (
              <SettingsSection title={group("help").title}>
                {controls("help")}
                <div className="mt-4 flex gap-4">
                  <button
                    type="button"
                    className={LINK_CLASS}
                    onClick={() => setCatalog("faqs")}
                  >
                    Manage FAQs
                  </button>
                  <span className="text-muted-foreground">|</span>
                  <button
                    type="button"
                    className={LINK_CLASS}
                    onClick={() => setCatalog("helpArticles")}
                  >
                    Manage Help Content
                  </button>
                </div>
              </SettingsSection>
            )}
            {matches("Content Taxonomy Categories Blog FAQ Help Center") && (
              <SettingsSection title="Content Taxonomy & Categories">
                <p className="mb-4 text-xs text-muted-foreground">
                  Organize tags across content knowledge bases.
                </p>
                <div className="space-y-3">
                  {categoryGroups.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2"
                    >
                      <div>
                        <h3 className="text-xs font-semibold">{item.label}</h3>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {item.categories.length} categories actively used
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        onClick={() => setCategoriesIndex(index)}
                      >
                        Manage
                      </Button>
                    </div>
                  ))}
                  {!categoryGroups.length && (
                    <p className="text-xs text-muted-foreground">
                      No content categories configured.
                    </p>
                  )}
                </div>
              </SettingsSection>
            )}
          </div>
          {matches(
            "Public Legal Pages About Terms Conditions Privacy Cancellation Refund Contact",
          ) && (
            <SettingsSection
              title="Public & Legal Pages"
              action={
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="bg-primary/10 text-xs text-primary"
                  onClick={() => setCatalog("publicPages")}
                >
                  Manage Pages
                </Button>
              }
            >
              <p className="mb-4 text-xs text-muted-foreground">
                Static system content and compliance declarations.
              </p>
              {publicPages.length ? (
                <ContentDocumentsTable
                  documents={publicPages}
                  disabled={disabled}
                  onEdit={(document) => editDocument("publicPages", document)}
                />
              ) : (
                <p className="py-5 text-xs text-muted-foreground">
                  No public pages available.
                </p>
              )}
            </SettingsSection>
          )}
          {groupMatches("publishing") && (
            <SettingsSection title={group("publishing").title}>
              <p className="mb-3 text-xs text-muted-foreground">
                {group("publishing").description}
              </p>
              {controls("publishing")}
            </SettingsSection>
          )}
          <div className="grid grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] items-start gap-5">
            {matches("Recent Content Activity Log") && (
              <SettingsSection title="Recent Content Activity Log">
                {snapshot.activity.length ? (
                  <ContentActivityTable activity={snapshot.activity} />
                ) : (
                  <p className="py-5 text-xs text-muted-foreground">
                    No content activity recorded.
                  </p>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="mt-5 text-xs text-primary"
                  onClick={() => setActivityOpen(true)}
                >
                  View Full Activity Audit Trail
                  <ArrowRight className="size-3" />
                </Button>
              </SettingsSection>
            )}
            <SettingsSection title="Quick Actions">
              <p className="mb-4 text-xs text-muted-foreground">
                Content management
              </p>
              <div className="space-y-2">
                <Link
                  href="/blog"
                  className="block rounded-md border border-border bg-muted/30 px-3 py-2.5 text-center text-xs font-semibold hover:bg-muted"
                >
                  Manage Blog Posts
                </Link>
                <Link
                  href="/banners"
                  className="block rounded-md border border-border bg-muted/30 px-3 py-2.5 text-center text-xs font-semibold hover:bg-muted"
                >
                  Manage Banners
                </Link>
                {(["faqs", "helpArticles", "publicPages"] as const).map(
                  (collection) => (
                    <Button
                      key={collection}
                      type="button"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => setCatalog(collection)}
                    >
                      {collection === "faqs"
                        ? "Manage FAQs"
                        : collection === "helpArticles"
                          ? "Manage Help Content"
                          : "Manage Public Pages"}
                    </Button>
                  ),
                )}
              </div>
            </SettingsSection>
          </div>
          {search &&
            !snapshot.modules.some((module) => matches(module.title)) &&
            !CONTENT_CONTROL_GROUPS.some((item) => groupMatches(item.id)) &&
            !matches(
              "Content Taxonomy Categories Blog FAQ Help Center Public Legal Pages About Terms Conditions Privacy Cancellation Refund Contact Recent Content Activity Log Maximum Active Banners Posts per Page",
            ) && (
              <p className="py-5 text-center text-sm text-muted-foreground">
                No content settings match your search.
              </p>
            )}
          <footer className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={disabled || !form.formState.isDirty}
              onClick={discard}
            >
              Discard Changes
            </Button>
          </footer>
          {form.formState.isDirty && (
            <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-lg">
              <span className="text-xs text-muted-foreground">
                You have unsaved platform content settings.
              </span>
              <Button type="submit" disabled={disabled}>
                {saving && <Loader2 className="size-4 animate-spin" />}Save
                Changes
              </Button>
            </div>
          )}
        </form>
        {categoriesIndex !== null && (
          <ContentCategoriesDialog
            group={categoryGroups[categoriesIndex]}
            onClose={() => setCategoriesIndex(null)}
            onApply={(categories) => {
              form.setValue(
                `categoryGroups.${categoriesIndex}.categories`,
                categories,
                { shouldDirty: true, shouldValidate: true },
              );
              setCategoriesIndex(null);
            }}
          />
        )}
        {catalog && (
          <Dialog
            open
            onOpenChange={(open) => {
              if (!open) setCatalog(null);
            }}
          >
            <DialogContent className="tracking-normal sm:max-w-[1000px]">
              <DialogHeader>
                <DialogTitle>{COLLECTION_LABELS[catalog]}</DialogTitle>
                <DialogDescription>Manage platform content.</DialogDescription>
              </DialogHeader>
              {form.getValues(catalog).length ? (
                <ContentDocumentsTable
                  documents={form.getValues(catalog)}
                  disabled={disabled}
                  onEdit={(document) => editDocument(catalog, document)}
                />
              ) : (
                <p className="text-xs text-muted-foreground">
                  No content available.
                </p>
              )}
            </DialogContent>
          </Dialog>
        )}
        {editor && (
          <ContentDocumentEditor
            document={editor.document}
            onClose={() => setEditor(null)}
            onApply={(document) => {
              form.setValue(
                editor.collection,
                form
                  .getValues(editor.collection)
                  .map((item) => (item.id === document.id ? document : item)),
                { shouldDirty: true, shouldValidate: true },
              );
              setEditor(null);
            }}
          />
        )}
        {activityOpen && (
          <Dialog open onOpenChange={setActivityOpen}>
            <DialogContent className="tracking-normal sm:max-w-[1000px]">
              <DialogHeader>
                <DialogTitle>Content Activity Audit Trail</DialogTitle>
                <DialogDescription>
                  Recent administrative content activity.
                </DialogDescription>
              </DialogHeader>
              {snapshot.activity.length ? (
                <ContentActivityTable activity={snapshot.activity} />
              ) : (
                <p className="text-xs text-muted-foreground">
                  No content activity recorded.
                </p>
              )}
              <Link href="/audit-logs" className={LINK_CLASS}>
                View All Audit Logs
                <ArrowRight className="size-3" />
              </Link>
            </DialogContent>
          </Dialog>
        )}
        {confirmation && (
          <SettingsConfirmDialog
            {...confirmation}
            onClose={() => setConfirmation(null)}
            onConfirm={confirmation.confirm}
          />
        )}
      </div>
    </FormProvider>
  );
}
