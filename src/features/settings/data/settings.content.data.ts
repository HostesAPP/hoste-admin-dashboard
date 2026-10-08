import type {
  ContentControlGroup,
  ContentDocument,
  ContentSettingsSnapshot,
} from "../settings.content.types";

export const CONTENT_CONTROL_GROUPS: ContentControlGroup[] = [
  {
    id: "visibility",
    title: "Content Visibility Settings",
    description:
      "Control public availability and section visibility across all user touchpoints.",
    fields: [
      {
        name: "showBlog",
        label: "Show Blog on Platform",
        description:
          "Expose the Hosté official blog and insights tab on mobile apps and website footer.",
      },
      {
        name: "showFaqs",
        label: "Show FAQs",
        description:
          "Display frequently asked questions during booking and on the landing page.",
      },
      {
        name: "showHelp",
        label: "Show Help Center",
        description:
          "Provide access to support guides, dispute policies, and search tools.",
      },
      {
        name: "showPromotions",
        label: "Show Promotional Banners & Announcements",
        description:
          "Enable promotional banners on host and customer dashboards.",
      },
    ],
  },
  {
    id: "banners",
    title: "Banner Configurations",
    description: "Detailed behavior and display rules for banners.",
    fields: [
      { name: "bannersEnabled", label: "Enable Promotional Banners" },
      { name: "autoExpireBanners", label: "Auto-Expire Expired Banners" },
      { name: "scheduledBanners", label: "Allow Scheduled Banners" },
      { name: "homepageBanners", label: "Show Banner on Homepage" },
      { name: "dashboardBanners", label: "Show Banner on User Dashboard" },
    ],
  },
  {
    id: "blog",
    title: "Blog Controls & Rules",
    description: "Platform-wide blog publishing and layout options.",
    fields: [
      { name: "blogEnabled", label: "Enable Blog" },
      { name: "scheduledPosts", label: "Allow Scheduled Publishing" },
      { name: "readerComments", label: "Allow Reader Comments" },
      { name: "blogApproval", label: "Require Admin Approval" },
      { name: "showAuthor", label: "Show Author Information" },
      { name: "showPublicationDate", label: "Show Publication Date" },
    ],
  },
  {
    id: "help",
    title: "FAQ & Help Center Settings",
    fields: [
      { name: "faqEnabled", label: "Enable FAQ Section" },
      { name: "helpEnabled", label: "Enable Help Center" },
      { name: "articleSearch", label: "Allow In-Article Search" },
      { name: "contactSupportCta", label: "Show Contact Support CTA Button" },
      { name: "relatedArticles", label: "Show Related Articles" },
    ],
  },
  {
    id: "publishing",
    title: "Content Publishing Controls",
    description:
      "Governance and security policies for content moderation and editorial pipelines.",
    fields: [
      {
        name: "publishingApproval",
        label: "Require Approval Before Publishing",
        description:
          "Route content edits through administrative review before production updates.",
      },
      {
        name: "scheduledPublishing",
        label: "Allow Scheduled Publishing",
        description:
          "Enable scheduled releases for announcements, blogs, and banners.",
      },
      {
        name: "allowUnpublish",
        label: "Allow Admins to Unpublish Live Content",
        description:
          "Allow authorized administrators to remove material from public view.",
      },
      {
        name: "archiveExpired",
        label:
          "Automatically Archive Expired Content & Show Drafts to Admins Only",
        description:
          "Keep unreleased work-in-progress material out of public indexing.",
      },
    ],
  },
];
const categories = (prefix: string, names: string[]) =>
  names.map((name, index) => ({ id: `${prefix}-${index + 1}`, name }));
const document = (
  id: string,
  title: string,
  status: ContentDocument["status"],
  updatedAt: string,
): ContentDocument => ({
  id,
  title,
  status,
  updatedAt,
  body: `Preview content for ${title}.`,
});

export const MOCK_CONTENT_SETTINGS: ContentSettingsSnapshot = {
  canManage: true,
  stats: [
    {
      id: "published-blog",
      label: "Published Blogs",
      value: "42",
      tone: "secondary",
    },
    { id: "draft-blog", label: "Draft Posts", value: "08", tone: "warning" },
    { id: "banners", label: "Active Banners", value: "05", tone: "secondary" },
    { id: "faqs", label: "FAQs", value: "64" },
    { id: "help", label: "Help Articles", value: "112" },
    { id: "pages", label: "Published Pages", value: "06" },
  ],
  modules: [
    {
      id: "blog",
      title: "Blog Management",
      description: "Create, edit, publish, and manage Hosté blog content.",
      summary: "Published: 42 | Drafts: 8 | Scheduled: 3",
      action: "Manage Blog",
    },
    {
      id: "banners",
      title: "Banner Management",
      description:
        "Manage promotional and informational banners displayed across the platform.",
      summary: "Active: 5 | Scheduled: 2 | Expired: 14",
      action: "Manage Banners",
    },
    {
      id: "faqs",
      title: "Frequently Asked Questions",
      description:
        "Manage frequently asked questions and answers available to users.",
      summary: "Published FAQs: 58 | Draft FAQs: 6",
      action: "Manage FAQs",
    },
    {
      id: "help",
      title: "Help & Support Knowledge Base",
      description:
        "Manage help articles and support information for customers and hosts.",
      summary: "Published: 104 | Drafts: 8",
      action: "Manage Help Content",
    },
  ],
  settings: {
    showBlog: true,
    showFaqs: true,
    showHelp: true,
    showPromotions: false,
    bannersEnabled: true,
    maxActiveBanners: 5,
    autoExpireBanners: true,
    scheduledBanners: true,
    homepageBanners: true,
    dashboardBanners: false,
    blogEnabled: true,
    scheduledPosts: true,
    readerComments: false,
    blogApproval: true,
    showAuthor: true,
    showPublicationDate: true,
    postsPerPage: 12,
    faqEnabled: true,
    helpEnabled: true,
    articleSearch: true,
    contactSupportCta: true,
    relatedArticles: true,
    publishingApproval: true,
    scheduledPublishing: true,
    allowUnpublish: true,
    archiveExpired: true,
    categoryGroups: [
      {
        id: "blog",
        label: "Blog Categories",
        categories: categories("blog", [
          "Student Housing Tips",
          "Campus Guides",
          "Hosté Stories",
          "Travel & Stays",
          "Booking Guides",
          "Platform News",
        ]),
      },
      {
        id: "faqs",
        label: "FAQ Categories",
        categories: categories("faq", [
          "Bookings",
          "Payments",
          "Refunds",
          "Accounts",
          "Verification",
          "Subscriptions",
          "Groups",
          "Referrals",
          "Safety",
          "Support",
        ]),
      },
      {
        id: "help",
        label: "Help Center Categories",
        categories: categories("help", [
          "Getting Started",
          "Customer Accounts",
          "Hosté Accounts",
          "Bookings",
          "Payment Methods",
          "Refunds",
          "Subscriptions",
          "Verification",
          "Groups",
          "Referrals",
          "Notifications",
          "Security",
          "Disputes",
          "Contact Support",
        ]),
      },
    ],
    publicPages: [
      document("about", "About Hosté", "Published", "Aug 14, 2026 · 10:12 AM"),
      document(
        "terms",
        "Terms & Conditions",
        "Published",
        "Jul 02, 2026 · 04:45 PM",
      ),
      document(
        "privacy",
        "Privacy Policy",
        "Published",
        "Aug 20, 2026 · 02:18 PM",
      ),
      document(
        "cancellation",
        "Cancellation Policy",
        "Draft",
        "Aug 22, 2026 · 11:30 AM",
      ),
      document(
        "refund-contact",
        "Refund Policy & Contact Us Page",
        "Published",
        "Jun 18, 2026 · 09:00 AM",
      ),
    ],
    faqs: [
      document(
        "faq-refund",
        "How to request refund?",
        "Draft",
        "Aug 22, 2026 · 09:40 AM",
      ),
      document(
        "faq-booking",
        "How do I view my bookings?",
        "Published",
        "Aug 21, 2026 · 11:20 AM",
      ),
    ],
    helpArticles: [
      document(
        "help-verification",
        "Host Verification Guide",
        "Published",
        "Aug 20, 2026 · 02:10 PM",
      ),
      document(
        "help-account",
        "Managing your account",
        "Draft",
        "Aug 19, 2026 · 10:00 AM",
      ),
    ],
  },
  activity: [
    {
      id: "content-1",
      title: "2026 Student Promo",
      type: "Banner",
      admin: "Sarah N.",
      date: "Aug 24, 11:20 AM",
      status: "Published",
    },
    {
      id: "content-2",
      title: "Top Accommodation Tips",
      type: "Blog",
      admin: "Alex M.",
      date: "Aug 23, 04:15 PM",
      status: "Updated",
    },
    {
      id: "content-3",
      title: "How to request refund?",
      type: "FAQ",
      admin: "Sarah N.",
      date: "Aug 22, 09:40 AM",
      status: "Draft",
    },
    {
      id: "content-4",
      title: "Host Verification Guide",
      type: "Help Art.",
      admin: "Dave K.",
      date: "Aug 20, 02:10 PM",
      status: "Unpublished",
    },
    {
      id: "content-5",
      title: "Privacy Policy v2",
      type: "Page",
      admin: "Sarah N.",
      date: "Aug 20, 02:18 PM",
      status: "Updated",
    },
  ],
};
