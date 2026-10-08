import type { z } from "zod";
import type {
  contentSettingsSchema,
  contentDocumentSchema,
  contentCategorySchema,
} from "./schemas/settings.content.schema";

export type ContentSettings = z.infer<typeof contentSettingsSchema>;
export type ContentDocument = z.infer<typeof contentDocumentSchema>;
export type ContentCategory = z.infer<typeof contentCategorySchema>;
export type ContentToggleName = {
  [Key in keyof ContentSettings]: ContentSettings[Key] extends boolean
    ? Key
    : never;
}[keyof ContentSettings];
export type ContentControlGroup = {
  id: string;
  title: string;
  description?: string;
  fields: readonly {
    name: ContentToggleName;
    label: string;
    description?: string;
  }[];
};
export type ContentSettingsSnapshot = {
  canManage: boolean;
  settings: ContentSettings;
  stats: {
    id: string;
    label: string;
    value: string;
    tone?: "secondary" | "warning";
  }[];
  modules: {
    id: string;
    title: string;
    description: string;
    summary: string;
    action: string;
  }[];
  activity: {
    id: string;
    title: string;
    type: string;
    admin: string;
    date: string;
    status: "Published" | "Updated" | "Draft" | "Unpublished";
  }[];
};
export type ContentSettingsAdapter = {
  cacheKey: string;
  load: () => Promise<ContentSettingsSnapshot>;
  save: (settings: ContentSettings) => Promise<ContentSettingsSnapshot>;
};
