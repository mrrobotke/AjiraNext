# Marketing Architecture

This document describes the foundational marketing layer implemented in Epic 0 (GitHub issues #24–#32).

## Route Group Topology

Marketing pages live under `src/app/(marketing)/` — a route group that does not affect the URL path. The group owns:

- `layout.tsx` — async Server Component that fetches auth state, SEO settings, and i18n messages, then renders both desktop and mobile template subtrees.
- `page.tsx` — homepage (no longer wraps itself in `MarketingPageTemplate`; the layout provides the shell).
- `jobs/page.tsx`, `employers/page.tsx`, `about/page.tsx`, `contact/page.tsx` — stubbed server components for sitemap and smoke-test targets.
- `error.tsx` — client error boundary with reset button.
- `loading.tsx` — server loading state using `<Spinner />`.

## Desktop / Mobile CSS Fork

To avoid `window.matchMedia` hydration hazards, the layout renders **both** desktop and mobile trees and uses CSS visibility toggles:

```tsx
<div className="hidden md:block">
  <MarketingPageTemplate …>{children}</MarketingPageTemplate>
</div>
<div className="md:hidden">
  <MobileMarketingTemplate …>{children}</MobileMarketingTemplate>
</div>
```

- `MarketingPageTemplate` — sticky header with NavItem molecules + footer.
- `MobileMarketingTemplate` — hamburger header + slide-out drawer + footer.

Both receive auth props (`user`, `dashboardHref`) from the layout.

## Theme System

- `ThemeBootstrapScript` — inline IIFE in `<head>` that reads `aj:theme` from `localStorage`, resolves `system` via `matchMedia`, and sets `document.documentElement.dataset.theme` before first paint.
- `ThemeProvider` — client React Context with `useTheme()` hook. Values: `light | dark | system`. Persists to `aj:theme` and subscribes to system preference changes.
- Root `layout.tsx` wraps children in `<ThemeProvider>` and keeps `suppressHydrationWarning` on `<html>`.

## SEO Strategy

- `src/lib/seo.ts` exports `getMarketingSeoData()` (server-only, fetches `/public/seo-settings` with 1-hour revalidation), `buildMarketingMetadata(page)`, `buildOrganizationJsonLd()`, and `buildWebSiteJsonLd()`.
- Each marketing page exports `generateMetadata`.
- Root `layout.tsx` defines `title.template: "%s | Ajira Next"`.
- `JsonLd` component renders `<script type="application/ld+json">` tags.
- `sitemap.ts` — static routes + dynamic job URLs fetched from `/jobs?page_size=1000`. Falls back to static only on API error.
- `robots.ts` — blocks everything in non-production; in production allows marketing and blocks `/admin`, `/api`, `/seeker`, `/employer`, `/onboarding`, `/auth` plus common AI crawlers.

## Internationalization (i18n)

- `next-intl` v4 with `NextIntlClientProvider`.
- Messages are loaded server-side in the marketing layout based on the `aj-locale` cookie (default `en`).
- Supported locales: `en` (English), `sw` (Swahili).
- No `middleware.ts`; locale is read from cookies in the async layout.

## API Client

- `src/lib/api/public.ts` — `apiPublicFetch<T>(path, opts?)` for public (unauthenticated) API calls.
- Injects `next.revalidate` only during SSR.
- Throws `ApiError` on non-2xx responses.
- Zod schemas in `src/lib/api/schemas.ts` mirror confirmed BE shapes.

## Analytics

- `@vercel/analytics/react` `<Analytics />` mounted in the marketing layout.
- `PageViewTracker` client component loads GA4 gtag script when `ga4MeasurementId` is present and fires `config` events on route changes.

## Quality Gates

- `pnpm lint` — ESLint (gating)
- `pnpm typecheck` — TypeScript `--noEmit` (gating)
- `pnpm test:run` — Storybook-integrated Vitest (gating)
- `pnpm test:unit` — Unit tests via Vitest (gating)
- `pnpm build` — Next.js build (gating)
- `pnpm test:e2e` — Playwright smoke tests (informational until #30 merges; gating thereafter)
- `pnpm build-storybook` — informational
