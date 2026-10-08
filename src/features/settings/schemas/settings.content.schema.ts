import { z } from "zod";

export const contentCategorySchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Enter a category name."),
});
export const contentCategoriesSchema = z
  .object({ categories: z.array(contentCategorySchema) })
  .refine(
    (value) =>
      new Set(value.categories.map((category) => category.name.toLowerCase()))
        .size === value.categories.length,
    { path: ["categories"], message: "Category names must be unique." },
  );
export const contentDocumentSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Enter a title."),
  body: z.string().trim().min(1, "Enter content."),
  status: z.enum(["Published", "Draft"]),
  updatedAt: z.string(),
});
export const contentSettingsSchema = z
  .object({
    showBlog: z.boolean(),
    showFaqs: z.boolean(),
    showHelp: z.boolean(),
    showPromotions: z.boolean(),
    bannersEnabled: z.boolean(),
    maxActiveBanners: z.number().int().min(1),
    autoExpireBanners: z.boolean(),
    scheduledBanners: z.boolean(),
    homepageBanners: z.boolean(),
    dashboardBanners: z.boolean(),
    blogEnabled: z.boolean(),
    scheduledPosts: z.boolean(),
    readerComments: z.boolean(),
    blogApproval: z.boolean(),
    showAuthor: z.boolean(),
    showPublicationDate: z.boolean(),
    postsPerPage: z.number().int().min(1),
    faqEnabled: z.boolean(),
    helpEnabled: z.boolean(),
    articleSearch: z.boolean(),
    contactSupportCta: z.boolean(),
    relatedArticles: z.boolean(),
    publishingApproval: z.boolean(),
    scheduledPublishing: z.boolean(),
    allowUnpublish: z.boolean(),
    archiveExpired: z.boolean(),
    categoryGroups: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        categories: z.array(contentCategorySchema),
      }),
    ),
    publicPages: z.array(contentDocumentSchema),
    faqs: z.array(contentDocumentSchema),
    helpArticles: z.array(contentDocumentSchema),
  })
  .superRefine((settings, context) => {
    settings.categoryGroups.forEach((group, index) => {
      if (
        new Set(group.categories.map((category) => category.name.toLowerCase()))
          .size !== group.categories.length
      )
        context.addIssue({
          code: "custom",
          path: ["categoryGroups", index, "categories"],
          message: "Category names must be unique.",
        });
    });
  });
