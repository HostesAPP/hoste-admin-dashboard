import Link from "next/link";
import { SettingsConfiguration } from "@/features/settings/components/settings.configuration";
import { Toaster } from "@/components/ui/sonner";

export default function ConfigurationPage() {
  return (
    <>
      <Link
        href="/settings"
        className="mx-6 mt-6 inline-block text-sm text-primary hover:underline"
      >
        Back to Settings
      </Link>
      <SettingsConfiguration />
      <Toaster />
    </>
  );
}
