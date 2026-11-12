import type { BannerItem } from "@/features/banners/types/banners.types";

const STORAGE_KEY = "hoste_banner_management_banners";
const UPDATE_EVENT = "hoste-banners-updated";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Read all banners saved in localStorage.
 */
export function getStoredBanners(): BannerItem[] {
  if (!isBrowser()) return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed as BannerItem[];
  } catch (error) {
    console.error("Unable to read saved banners:", error);
    return [];
  }
}

/**
 * Save all banners and notify pages that the data has changed.
 */
export function saveStoredBanners(banners: BannerItem[]): boolean {
  if (!isBrowser()) return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));

    window.dispatchEvent(new Event(UPDATE_EVENT));

    return true;
  } catch (error) {
    console.error("Unable to save banners:", error);
    return false;
  }
}

/**
 * Create a banner or update an existing banner with the same ID.
 */
export function saveBanner(banner: BannerItem): boolean {
  if (!banner.id) {
    console.error("Unable to save banner: banner ID is required.");
    return false;
  }

  const banners = getStoredBanners();

  const exists = banners.some((item) => String(item.id) === String(banner.id));

  const updatedBanners = exists
    ? banners.map((item) =>
        String(item.id) === String(banner.id) ? banner : item,
      )
    : [...banners, banner];

  return saveStoredBanners(updatedBanners);
}

/**
 * Find one banner by its ID.
 */
export function getBannerById(id: string): BannerItem | undefined {
  return getStoredBanners().find((banner) => String(banner.id) === String(id));
}

/**
 * Delete a banner by its ID.
 */
export function deleteBanner(id: string): boolean {
  const banners = getStoredBanners();

  const updatedBanners = banners.filter(
    (banner) => String(banner.id) !== String(id),
  );

  if (updatedBanners.length === banners.length) {
    return false;
  }

  return saveStoredBanners(updatedBanners);
}

/**
 * Subscribe to banner changes on the current page.
 * Call the returned function to stop listening.
 */
export function subscribeToBannerUpdates(callback: () => void): () => void {
  if (!isBrowser()) return () => {};

  const handleUpdate = () => callback();

  window.addEventListener(UPDATE_EVENT, handleUpdate);
  window.addEventListener("storage", handleUpdate);

  return () => {
    window.removeEventListener(UPDATE_EVENT, handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}
