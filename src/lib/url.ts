import { config } from "./config";

/**
 * Validates a redirect URL to prevent open-redirect attacks.
 * Only allows relative paths or URLs matching the application's base URL.
 */
export function validateRedirectUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;

  try {
    // Check if it's a relative URL (starts with / but not //)
    if (url.startsWith("/") && !url.startsWith("//")) {
      return url;
    }

    const targetUrl = new URL(url);
    const baseUrl = new URL(config.baseUrl);

    // Only allow if origins match
    if (targetUrl.origin === baseUrl.origin) {
      return targetUrl.pathname + targetUrl.search + targetUrl.hash;
    }
  } catch {
    // If URL parsing fails, it's likely invalid or relative
    // We already handled relative above, so this is just for safety
  }

  return null;
}
