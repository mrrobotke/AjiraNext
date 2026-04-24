/**
 * SEO helpers for the marketing surface.
 *
 * JSON-LD rendering uses `dangerouslySetInnerHTML` because Next.js prescribes
 * inline `<script type="application/ld+json">…</script>` tags for structured
 * data; `dangerouslySetInnerHTML` is the only React API that emits raw script
 * content. The risk is purely payload injection: if a user-supplied SEO
 * field ever contained a substring like `</script>`, or the Unicode line
 * separators U+2028 / U+2029 (which can break JSON parsing / cause
 * server-client divergence), the script tag could terminate early or produce
 * different bytes on the server vs. the client.
 *
 * Mitigation:
 *   1. Only plain JS objects are ever passed to `safeJsonLd` — never raw
 *      HTML, never user-authored strings treated as markup.
 *   2. `safeJsonLd` JSON-stringifies the object first (so no HTML can be
 *      embedded), then escapes `<`, `>`, `&`, U+2028, and U+2029 into their
 *      `\uXXXX` form. The output is therefore always a valid JSON string
 *      literal that cannot close the surrounding `<script>` tag.
 *
 * Every `dangerouslySetInnerHTML` call site carries an
 * `eslint-disable-next-line react/no-danger` with a comment pointing back
 * to this header.
 */
import type { Metadata } from "next";
import type { JSX } from "react";

import { apiPublicFetch } from "@/lib/api/public";
import type { PublicSeoSettings } from "@/lib/api/types";

export type MarketingSeoData = PublicSeoSettings;

/**
 * Shape of a single canonical marketing route.
 *
 * - `path` is a template literal so the leading `/` is enforced at compile
 *   time; any literal missing the slash fails `satisfies` below.
 * - `priority` is a closed union of the exact values we emit so the
 *   sitemap can't drift to an unintended weight.
 */
export type MarketingRoute = {
  readonly path: `/${string}`;
  readonly changeFrequency: "daily" | "weekly" | "monthly";
  readonly priority: 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
};

/**
 * Canonical marketing routes — the single source of truth for sitemap,
 * robots, and metadata builders. See Epic 0 #33.
 *
 * The path `/for-employers` is preferred over `/employers`; a permanent
 * redirect from `/employers` is configured in `next.config.ts`.
 *
 * The `as const satisfies` pairing preserves the literal types of each
 * entry while still validating the array against `MarketingRoute`.
 */
export const MARKETING_ROUTES = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/jobs", changeFrequency: "daily", priority: 0.9 },
  { path: "/for-employers", changeFrequency: "weekly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/help", changeFrequency: "monthly", priority: 0.5 },
  { path: "/legal", changeFrequency: "monthly", priority: 0.5 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
] as const satisfies readonly MarketingRoute[];

const DEFAULT_SEO_DATA: MarketingSeoData = {
  siteName: "Ajira Next",
  tagline: "The elite career platform for Africa",
  ga4MeasurementId: null,
  organizationName: "Ajira Next",
  organizationUrl: "https://ajira.next",
  organizationLogoUrl: "https://ajira.next/logo.png",
};

/**
 * Resolves the canonical public site URL.
 *
 * - Reads `NEXT_PUBLIC_SITE_URL` and strips any trailing slash.
 * - In development (non-production), falls back to `http://localhost:3000`
 *   so local builds don't require the env var.
 * - In production (`NODE_ENV==='production'` or `VERCEL_ENV==='production'`)
 *   the variable is required and the function throws if missing.
 */
export function requireSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw && raw.length > 0) {
    return raw.replace(/\/$/, "");
  }
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production";
  if (isProd) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SITE_URL",
    );
  }
  return "http://localhost:3000";
}

/**
 * Fetches marketing SEO settings from the public API.
 *
 * PR-1 preserves the existing silent-fallback behaviour; PR-2 replaces this
 * with a hardened fetch client that throws `MarketingFetchError` on failure.
 */
export async function getMarketingSeoData(): Promise<MarketingSeoData> {
  try {
    const data = await apiPublicFetch<PublicSeoSettings>(
      "/public/seo-settings",
      {
        next: { revalidate: 3600 },
      },
    );
    return data;
  } catch {
    return DEFAULT_SEO_DATA;
  }
}

/**
 * Normalizes a marketing path so the canonical URL is stable.
 *
 * - The root path `"/"` is preserved as `"/"` so the canonical ends in a
 *   trailing slash (`https://host/`).
 * - Any other path has trailing slashes stripped; empty results collapse
 *   back to `"/"`.
 */
function normalizeTrailingSlash(path: string): string {
  if (path === "/") {
    return "/";
  }
  const stripped = path.replace(/\/+$/, "");
  return stripped.length === 0 ? "/" : stripped;
}

export type BuildMetadataInput = {
  title: string;
  description?: string;
  path: string;
  locale: "en" | "sw";
  openGraph?: Partial<NonNullable<Metadata["openGraph"]>>;
  twitter?: Partial<NonNullable<Metadata["twitter"]>>;
};

/**
 * Builds a Next.js `Metadata` object for a marketing page.
 *
 * - The root layout owns the title template (`"%s | Ajira Next"`), so this
 *   helper sets `title` to the raw input.
 * - `alternates.languages` currently maps every locale to the same
 *   canonical URL because next-intl is cookie-based in v1. When URL-based
 *   locale routing lands (Epic 2+), emit per-locale URLs here.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const siteUrl = requireSiteUrl();
  const canonical = `${siteUrl}${normalizeTrailingSlash(input.path)}`;
  const description = input.description ?? DEFAULT_SEO_DATA.tagline;
  const ogLocale = input.locale === "sw" ? "sw_KE" : "en_KE";

  const languages: NonNullable<
    NonNullable<Metadata["alternates"]>["languages"]
  > = {
    "en-KE": canonical,
    "sw-KE": canonical,
    "x-default": canonical,
  };

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    type: "website",
    siteName: "Ajira Next",
    locale: ogLocale,
    url: canonical,
    title: input.title,
    description,
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
    ...input.openGraph,
  };

  const twitter: NonNullable<Metadata["twitter"]> = {
    card: "summary_large_image",
    title: input.title,
    description,
    ...input.twitter,
  };

  return {
    title: input.title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph,
    twitter,
  };
}

/**
 * JSON-stringifies `obj` and escapes characters that could terminate a
 * `<script>` tag or break client/server JSON parity.
 *
 * Only accepts objects — never raw HTML. See the top-of-file comment for
 * the threat model.
 */
// U+2028 (LINE SEPARATOR) and U+2029 (PARAGRAPH SEPARATOR) are constructed
// from code points because JavaScript treats them as line terminators inside
// source code, making literal occurrences a syntax hazard.
const LINE_SEPARATOR = String.fromCodePoint(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCodePoint(0x2029);

/**
 * A JSON-serialisable value. This is the only shape `safeJsonLd` accepts
 * so that `undefined`, functions, symbols, and bigints (which either
 * serialise to `undefined` or throw) cannot reach the escape pipeline.
 *
 * Exported because callers constructing JSON-LD payloads benefit from the
 * same constraint (see `JsonLdScript` below and any future JSON-LD
 * helpers).
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export function safeJsonLd(obj: JsonValue): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replaceAll(LINE_SEPARATOR, "\\u2028")
    .replaceAll(PARAGRAPH_SEPARATOR, "\\u2029");
}

/**
 * Private helper that renders a `<script type="application/ld+json">` tag
 * with the given JSON-LD payload. The single place in the codebase that
 * spells the `dangerouslySetInnerHTML` escape hatch, so the security
 * rationale and ESLint disable comment live here.
 *
 * Callers (like `OrganizationJsonLd` and `WebSiteJsonLd` below) must
 * provide a `JsonValue` — see the top-of-file comment for the threat
 * model.
 */
function JsonLdScript({ payload }: { payload: JsonValue }): JSX.Element {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- safeJsonLd() escapes <,>,&,U+2028,U+2029; only JSON-serialized objects embedded. See top-of-file comment.
      dangerouslySetInnerHTML={{ __html: safeJsonLd(payload) }}
    />
  );
}

/**
 * Renders an Organization JSON-LD `<script>` tag.
 *
 * Accepts `MarketingSeoData` and emits a schema.org Organization payload
 * safe for SSR via `JsonLdScript`.
 */
export function OrganizationJsonLd({
  data,
}: {
  data: MarketingSeoData;
}): JSX.Element {
  const payload: JsonValue = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.organizationName,
    url: data.organizationUrl,
    logo: data.organizationLogoUrl,
  };
  return <JsonLdScript payload={payload} />;
}

/**
 * Renders a WebSite JSON-LD `<script>` tag with a sitewide SearchAction,
 * delegating to `JsonLdScript` for the (escaped) inline script emission.
 */
export function WebSiteJsonLd({
  data,
}: {
  data: MarketingSeoData;
}): JSX.Element {
  const payload: JsonValue = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.siteName,
    url: data.organizationUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${data.organizationUrl}/jobs?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return <JsonLdScript payload={payload} />;
}
