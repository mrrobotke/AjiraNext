import { z } from "zod";

export const PlatformStatsSchema = z.object({
  activeJobs: z.number().int().nonnegative(),
  employers: z.number().int().nonnegative(),
  placedThisYear: z.number().int().nonnegative(),
  registeredUsers: z.number().int().nonnegative(),
});

export const TestimonialSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  quote: z.string().min(1),
});

export const FeaturedJobSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  type: z.string().min(1),
  postedAt: z.string().min(1),
});

export const PublicSeoSettingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().min(1),
  ga4MeasurementId: z.string().nullable(),
  organizationName: z.string().min(1),
  organizationUrl: z.string().url(),
  organizationLogoUrl: z.string().url(),
});

export const PaginatedMetaSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const ApiEnvelopeSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: PaginatedMetaSchema.optional(),
  });
