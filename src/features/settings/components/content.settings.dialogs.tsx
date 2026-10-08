"use client";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NotificationConfirmDialog as SettingsConfirmDialog } from "./notifications.settings.dialogs";
import {
  contentCategoriesSchema,
  contentDocumentSchema,
} from "../schemas/settings.content.schema";
import type {
  ContentCategory,
  ContentDocument,
  ContentSettings,
} from "../settings.content.types";

export function ContentCategoriesDialog({
  group,
  onClose,
  onApply,
}: {
  group: ContentSettings["categoryGroups"][number];
  onClose: () => void;
  onApply: (categories: ContentCategory[]) => void;
}) {
  const form = useForm<{ categories: ContentCategory[] }>({
    resolver: zodResolver(contentCategoriesSchema),
    defaultValues: { categories: group.categories },
  });
  const array = useFieldArray({
    control: form.control,
    name: "categories",
    keyName: "formKey",
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent className="tracking-normal sm:max-w-[560px]">
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((value) => onApply(value.categories))}
          >
            <DialogHeader>
              <DialogTitle className="text-base">
                Manage {group.label}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Edit, add, or remove content categories.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {array.fields.map((category, index) => (
                <div
                  key={category.formKey}
                  className="flex items-start gap-2 rounded-md bg-muted/40 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    {editing === category.id ? (
                      <Input
                        {...form.register(`categories.${index}.name`)}
                        aria-label={`Category ${index + 1} name`}
                        className="h-8 text-xs"
                      />
                    ) : (
                      <p className="py-1.5 text-xs font-semibold">
                        {form.getValues(`categories.${index}.name`)}
                      </p>
                    )}
                    {form.formState.errors.categories?.[index]?.name && (
                      <p role="alert" className="text-xs text-destructive">
                        {form.formState.errors.categories[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-xs text-primary"
                    onClick={() =>
                      setEditing(editing === category.id ? null : category.id)
                    }
                  >
                    {editing === category.id ? "Done" : "Edit"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-xs text-destructive"
                    onClick={() => setDeleting(index)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              {!array.fields.length && (
                <p className="py-4 text-xs text-muted-foreground">
                  No categories configured.
                </p>
              )}
            </div>
            {form.formState.errors.categories?.root && (
              <p role="alert" className="text-xs text-destructive">
                {form.formState.errors.categories.root.message}
              </p>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => {
                const id = crypto.randomUUID();
                array.append({ id, name: "" });
                setEditing(id);
              }}
            >
              <Plus className="size-3.5" />
              Add New Category
            </Button>
            <footer className="flex justify-end gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
      {deleting !== null && (
        <SettingsConfirmDialog
          title="Delete Category?"
          description="This removes the category from this configuration draft. Existing content is not deleted."
          action="Delete Category"
          destructive
          onClose={() => setDeleting(null)}
          onConfirm={() => array.remove(deleting)}
        />
      )}
    </>
  );
}

export function ContentDocumentEditor({
  document,
  onClose,
  onApply,
}: {
  document: ContentDocument;
  onClose: () => void;
  onApply: (document: ContentDocument) => void;
}) {
  const form = useForm<ContentDocument>({
    resolver: zodResolver(contentDocumentSchema),
    defaultValues: document,
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="tracking-normal sm:max-w-[640px]">
        <form className="space-y-5" onSubmit={form.handleSubmit(onApply)}>
          <DialogHeader>
            <DialogTitle>Edit {document.title}</DialogTitle>
            <DialogDescription>Edit the page content.</DialogDescription>
          </DialogHeader>
          <label className="block space-y-1.5 text-xs">
            <span className="font-semibold">Title</span>
            <Input
              {...form.register("title")}
              aria-invalid={!!form.formState.errors.title}
            />
            {form.formState.errors.title && (
              <span role="alert" className="text-destructive">
                {form.formState.errors.title.message}
              </span>
            )}
          </label>
          <label className="block space-y-1.5 text-xs">
            <span className="font-semibold">Content</span>
            <Textarea
              {...form.register("body")}
              className="min-h-48 text-xs"
              aria-invalid={!!form.formState.errors.body}
            />
            {form.formState.errors.body && (
              <span role="alert" className="text-destructive">
                {form.formState.errors.body.message}
              </span>
            )}
          </label>
          <footer className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Apply Changes</Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}
