/**
 * Resolves a user-supplied redirect target into a same-origin path, or returns
 * the fallback when the input is missing, cross-origin, or suspicious.
 *
 * The input is parsed against a sentinel origin; if the parsed URL's origin
 * differs from the sentinel, the input pointed to an external (or protocol)
 * URL and must be rejected. Raw and URL-encoded control characters plus the
 * backslash are rejected outright because some browsers treat them as path
 * separators, which can be used to smuggle cross-origin redirects.
 */
export function resolveSafeRedirect(
  input: string | null | undefined,
  fallback = "/",
): string {
  if (!input) return fallback;

  // Reject raw control characters and backslash in the input string.
  if (/[\\\t\r\n\f\v]/.test(input)) return fallback;
  // Reject URL-encoded forms of those same characters (tab, LF/VT/FF/CR, backslash).
  if (/%(09|0a|0b|0c|0d|5c)/i.test(input)) return fallback;

  try {
    const sentinel = "https://app.internal";
    const resolved = new URL(input, sentinel);
    if (resolved.origin !== sentinel) return fallback;
    if (!resolved.pathname.startsWith("/")) return fallback;
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return fallback;
  }
}
