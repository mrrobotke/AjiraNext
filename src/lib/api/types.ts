export interface PlatformStats {
  activeJobs: number;
  employers: number;
  placedThisYear: number;
  registeredUsers: number;
}

export interface Testimonial {
  name: string;
  company: string;
  quote: string;
}

export interface FeaturedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
}

export interface Job {
  id: string;
  slug?: string;
}

export interface PublicSeoSettings {
  siteName: string;
  tagline: string;
  ga4MeasurementId: string | null;
  organizationName: string;
  organizationUrl: string;
  organizationLogoUrl: string;
}

export interface PaginatedMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  data: T;
  meta?: PaginatedMeta;
}

export type PaginatedJobs = ApiEnvelope<Job[]>;
