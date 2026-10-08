"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Link2,
  Globe,
  Info,
  Camera,
  Building2,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { SettingsHeader } from "./settings.header";
import {
  generalSettingsSchema,
  type GeneralSettingsValues,
} from "../schemas/settings.general.schema";

function SettingsSection({
  title,
  description,
  search,
  keywords = "",
  children,
}: {
  title: string;
  description: string;
  search: string;
  keywords?: string;
  children: ReactNode;
}) {
  const visible = `${title} ${description} ${keywords}`
    .toLowerCase()
    .includes(search.trim().toLowerCase());
  return (
    <section
      hidden={!visible}
      className="grid grid-cols-[240px_minmax(0,1fr)] gap-12 border-t border-border py-7"
    >
      <div>
        <h2 className="text-sm font-bold">{title}</h2>
        <p className="mt-2 max-w-56 text-xs leading-4 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function GeneralSettings({
  initialValues,
}: {
  initialValues: GeneralSettingsValues;
}) {
  const [search, setSearch] = useState("");
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: initialValues,
  });
  const values = useWatch({ control });

  useEffect(() => {
    const theme = getComputedStyle(document.documentElement);
    reset({
      ...initialValues,
      primaryColor:
        initialValues.primaryColor ||
        theme.getPropertyValue("--primary").trim(),
      secondaryColor:
        initialValues.secondaryColor ||
        theme.getPropertyValue("--secondary").trim(),
    });
  }, [initialValues, reset]);

  const save = (data: GeneralSettingsValues) => {
    reset(data);
    toast.success("General settings saved for this preview only.");
  };

  const upload = (name: "logo" | "favicon", file?: File) => {
    if (!file) return;
    const allowed = name === "logo" ? /\.(png|jpe?g|svg)$/i : /\.(png|ico)$/i;
    if (!allowed.test(file.name)) {
      toast.error(
        name === "logo"
          ? "Choose a PNG, JPG, or SVG logo."
          : "Choose a PNG or ICO favicon.",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string")
        setValue(name, reader.result, { shouldDirty: true });
    };
    reader.onerror = () =>
      toast.error("Unable to read this image. Please try again.");
    reader.readAsDataURL(file);
  };

  const inputClass = "h-10 rounded-md bg-card text-xs shadow-none";
  const textField = (
    name:
      | "platformName"
      | "businessAddress"
      | "supportEmail"
      | "supportPhone"
      | "websiteUrl"
      | "instagramUrl"
      | "facebookUrl"
      | "twitterUrl"
      | "linkedinUrl",
    label: string,
    icon?: typeof Mail,
    required = false,
  ) => {
    const Icon = icon;
    const error = errors[name];
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name} className="text-xs font-semibold">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        <div className="relative">
          {Icon && (
            <Icon
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
          )}
          <Input
            id={name}
            {...register(name)}
            type={
              name === "supportEmail"
                ? "email"
                : name === "supportPhone"
                  ? "tel"
                  : "text"
            }
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={`${inputClass} ${Icon ? "pl-9" : ""}`}
          />
        </div>
        {error && (
          <p
            role="alert"
            id={`${name}-error`}
            className="text-xs text-destructive"
          >
            {error.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-w-[1024px] font-normal tracking-normal">
      <SettingsHeader search={search} onSearch={setSearch} />
      <form
        noValidate
        onSubmit={handleSubmit(save, () => setSearch(""))}
        className="mx-auto max-w-[1440px] px-8 pb-12 pt-7"
      >
        <div className="mb-8 flex items-center justify-between gap-6">
          <div>
            <nav aria-label="Breadcrumb" className="mb-1 flex gap-2 text-xs">
              <Link
                href="/settings"
                className="text-muted-foreground hover:underline"
              >
                Settings
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold text-primary">
                General Settings
              </span>
            </nav>
            <h1 className="text-2xl font-bold">General Settings</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Manage your platform information, branding, and general
              preferences
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={!isDirty || isSubmitting}
              onClick={() => reset()}
              className="text-xs"
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="text-xs"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <SettingsSection
          title="Platform Information"
          description="Update the core details of the Hosté platform used in transactional emails and legal documents."
          search={search}
          keywords="platform name description business address"
        >
          {textField("platformName", "Platform Name", undefined, true)}
          <div className="space-y-1.5">
            <Label
              htmlFor="platformDescription"
              className="text-xs font-semibold"
            >
              Platform Description<span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="platformDescription"
              {...register("platformDescription")}
              aria-required
              aria-invalid={!!errors.platformDescription}
              aria-describedby={
                errors.platformDescription ? "description-error" : undefined
              }
              className="min-h-20 resize-y rounded-md bg-card text-xs shadow-none"
            />
            {errors.platformDescription && (
              <p
                role="alert"
                id="description-error"
                className="text-xs text-destructive"
              >
                {errors.platformDescription.message}
              </p>
            )}
          </div>
          {textField("businessAddress", "Business Address")}
        </SettingsSection>

        <SettingsSection
          title="Contact & Social"
          description="Publicly visible contact information and social media links displayed in the footer of the main website."
          search={search}
          keywords="support email phone website URL instagram facebook twitter linkedin"
        >
          <div className="grid grid-cols-2 gap-5">
            {textField("supportEmail", "Support Email", Mail, true)}
            {textField("supportPhone", "Support Phone Number", Phone)}
          </div>
          {textField("websiteUrl", "Website URL", Globe)}
          <div className="grid grid-cols-2 gap-5">
            {textField("instagramUrl", "Instagram", Camera)}
            {textField("facebookUrl", "Facebook", Link2)}
            {textField("twitterUrl", "X / Twitter", X)}
            {textField("linkedinUrl", "LinkedIn", Building2)}
          </div>
        </SettingsSection>

        <SettingsSection
          title="Regional Settings"
          description="Set the default region, currency, and timezone for the platform and new user registrations."
          search={search}
          keywords="country currency timezone language"
        >
          <div className="grid grid-cols-2 gap-5">
            {(
              [
                {
                  name: "country",
                  label: "Default Country",
                  options: [{ value: "NG", label: "Nigeria" }],
                },
                {
                  name: "currency",
                  label: "Default Currency",
                  options: [
                    { value: "NGN", label: "Nigerian Naira (₦)" },
                    { value: "USD", label: "US Dollar ($)" },
                    { value: "GBP", label: "British Pound (£)" },
                  ],
                },
                {
                  name: "timezone",
                  label: "Platform Timezone",
                  options: [
                    { value: "Africa/Lagos", label: "Africa/Lagos (GMT+1)" },
                  ],
                },
                {
                  name: "language",
                  label: "Default Language",
                  options: [{ value: "en-GB", label: "English (UK)" }],
                },
              ] as const
            ).map((field) => (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  {field.label}
                </Label>
                <select
                  id={field.name}
                  {...register(field.name)}
                  className="h-10 w-full rounded-md border border-input bg-card px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection
          title="Platform Branding"
          description="Update the visual identity of the platform including logos, icons, and primary brand colors."
          search={search}
          keywords="logo favicon primary secondary color"
        >
          <div>
            <Label className="text-xs font-semibold">Platform Logo</Label>
            <div className="mt-2 flex items-center gap-4">
              <Avatar className="size-24 shrink-0 rounded-lg border-[10px] border-muted-foreground/50 bg-card">
                <AvatarImage
                  src={values.logo || undefined}
                  alt="Platform logo preview"
                  className="object-contain"
                />
                <AvatarFallback className="rounded-none bg-card text-xs font-bold text-primary">
                  HOSTÉ
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <label className="relative cursor-pointer rounded-md border border-input bg-card px-4 py-2.5 text-xs font-semibold focus-within:ring-2 focus-within:ring-ring">
                    Upload New Logo
                    <input
                      aria-label="Upload New Logo"
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg"
                      onChange={(event) => {
                        upload("logo", event.target.files?.[0]);
                        event.target.value = "";
                      }}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-xs text-primary"
                    disabled={!values.logo}
                    onClick={() => setValue("logo", "", { shouldDirty: true })}
                  >
                    Remove
                  </Button>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Recommended size: 512×512px (PNG, SVG, or JPG)
                </p>
              </div>
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold">Favicon</Label>
            <div className="mt-2 flex items-center gap-4">
              <Avatar className="size-12 rounded-md border border-dashed border-input">
                <AvatarImage
                  src={values.favicon || undefined}
                  alt="Favicon preview"
                  className="object-contain"
                />
                <AvatarFallback className="rounded-none bg-transparent text-primary">
                  {values.favicon ? "" : "H"}
                </AvatarFallback>
              </Avatar>
              <label className="relative cursor-pointer rounded-md border border-input bg-card px-4 py-2.5 text-xs font-semibold focus-within:ring-2 focus-within:ring-ring">
                Change Favicon
                <input
                  aria-label="Change Favicon"
                  type="file"
                  accept=".png,.ico"
                  onChange={(event) => {
                    upload("favicon", event.target.files?.[0]);
                    event.target.value = "";
                  }}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
              <span className="text-[11px] text-muted-foreground">
                32×32px .ico or .png
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {(
              [
                { name: "primaryColor", label: "Primary Brand Color" },
                { name: "secondaryColor", label: "Secondary Brand Color" },
              ] as const
            ).map((field) => (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  {field.label}
                </Label>
                <div className="flex h-10 items-center gap-2 rounded-md border border-input bg-card px-2">
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: colorField }) => (
                      <input
                        type="color"
                        aria-label={`Choose ${field.label}`}
                        value={
                          /^#[0-9a-f]{6}$/i.test(colorField.value)
                            ? colorField.value
                            : ""
                        }
                        onChange={colorField.onChange}
                        className="h-7 w-7 cursor-pointer border-0 bg-transparent p-0"
                      />
                    )}
                  />
                  <Input
                    id={field.name}
                    {...register(field.name)}
                    aria-invalid={!!errors[field.name]}
                    aria-describedby={
                      errors[field.name] ? `${field.name}-error` : undefined
                    }
                    className="h-8 border-0 bg-transparent px-0 text-xs shadow-none"
                  />
                </div>
                {errors[field.name] && (
                  <p
                    id={`${field.name}-error`}
                    role="alert"
                    className="text-xs text-destructive"
                  >
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection
          title="Platform Preferences"
          description="Manage high-level access and general operational modes for the entire Hosté infrastructure."
          search={search}
          keywords="maintenance mode new user registrations signups"
        >
          <div>
            <div className="flex items-center justify-between gap-5">
              <div>
                <Label
                  htmlFor="maintenanceMode"
                  className="text-xs font-semibold"
                >
                  Maintenance Mode
                </Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Temporarily disable public access to the platform for updates
                  or fixes.
                </p>
              </div>
              <Controller
                name="maintenanceMode"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="maintenanceMode"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
            <p className="mt-3 flex items-center gap-2 rounded-md border border-warning-border bg-warning-surface px-3 py-2.5 text-xs text-warning">
              <Info aria-hidden="true" className="size-4 shrink-0" />
              Administrators will still have dashboard access.
            </p>
          </div>
          <div className="flex items-center justify-between gap-5 border-t border-border pt-4">
            <div>
              <Label
                htmlFor="allowNewRegistrations"
                className="text-xs font-semibold"
              >
                Allow New User Registrations
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Allow new users to register on the platform.
              </p>
            </div>
            <Controller
              name="allowNewRegistrations"
              control={control}
              render={({ field }) => (
                <Switch
                  id="allowNewRegistrations"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className={field.value ? "bg-secondary" : undefined}
                />
              )}
            />
          </div>
        </SettingsSection>
      </form>
      <Toaster />
    </div>
  );
}
