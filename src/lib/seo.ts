import type { Metadata } from "next";
import { apiPublicFetch } from "@/lib/api/public";
import type { PublicSeoSettings } from "@/lib/api/types";

export type MarketingSeoData = PublicSeoSettings;

const DEFAULT_SEO_DATA: MarketingSeoData = {
  siteName: "Ajira Next",
  tagline: "The elite career platform for Africa",
  ga4MeasurementId: null,
  organizationName: "Ajira Next",
  organizationUrl: "https://ajira.next",
  organizationLogoUrl: "https://ajira.next/logo.png",
};

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

export interface MarketingMetadataInput {
  title: string;
  description?: string;
}

export function buildMarketingMetadata(
  input: MarketingMetadataInput,
): Metadata {
  return {
    title: input.title,
    description: input.description ?? DEFAULT_SEO_DATA.tagline,
  };
}

export function buildOrganizationJsonLd(data: MarketingSeoData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.organizationName,
    url: data.organizationUrl,
    logo: data.organizationLogoUrl,
  };
}

export function buildWebSiteJsonLd(data: MarketingSeoData) {
  return {
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
}
