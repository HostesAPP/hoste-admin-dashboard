import type { GeneralSettingsValues } from "../schemas/settings.general.schema";

// Screenshot defaults for the form preview; this is not an API contract.
export const DEFAULT_GENERAL_SETTINGS: GeneralSettingsValues = {
  platformName: "Hosté",
  platformDescription:
    "The premier platform for booking unique stays, shortlets, and experiences across Nigeria.",
  businessAddress:
    "42 Trans Amadi Industrial Layout, Port Harcourt, Rivers State",
  supportEmail: "support@hoste.com",
  supportPhone: "+234 800 000 0000",
  websiteUrl: "https://hoste.com",
  instagramUrl: "https://instagram.com/hoste_africa",
  facebookUrl: "https://facebook.com/hosteafrica",
  twitterUrl: "https://x.com/hoste_africa",
  linkedinUrl: "https://linkedin.com/company/hoste-africa",
  country: "NG",
  currency: "NGN",
  timezone: "Africa/Lagos",
  language: "en-GB",
  logo: "",
  favicon: "",
  primaryColor: "",
  secondaryColor: "",
  maintenanceMode: false,
  allowNewRegistrations: true,
};
