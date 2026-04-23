import { describe, it, expect } from "vitest";
import {
  PlatformStatsSchema,
  TestimonialSchema,
  FeaturedJobSchema,
  PublicSeoSettingsSchema,
  PaginatedMetaSchema,
  ApiEnvelopeSchema,
} from "./schemas";

describe("PlatformStatsSchema", () => {
  it("parses valid stats", () => {
    const data = {
      activeJobs: 62,
      employers: 36,
      placedThisYear: 12000,
      registeredUsers: 50000,
    };
    expect(PlatformStatsSchema.parse(data)).toEqual(data);
  });

  it("rejects negative numbers", () => {
    expect(() =>
      PlatformStatsSchema.parse({
        activeJobs: -1,
        employers: 0,
        placedThisYear: 0,
        registeredUsers: 0,
      }),
    ).toThrow();
  });
});

describe("TestimonialSchema", () => {
  it("parses valid testimonial", () => {
    const data = { name: "Alice", company: "Acme", quote: "Great!" };
    expect(TestimonialSchema.parse(data)).toEqual(data);
  });

  it("rejects empty strings", () => {
    expect(() =>
      TestimonialSchema.parse({ name: "", company: "Acme", quote: "Great!" }),
    ).toThrow();
  });
});

describe("FeaturedJobSchema", () => {
  it("parses valid job", () => {
    const data = {
      id: "job-1",
      title: "Engineer",
      company: "Acme",
      location: "Nairobi",
      type: "Full-time",
      postedAt: "2024-01-01",
    };
    expect(FeaturedJobSchema.parse(data)).toEqual(data);
  });
});

describe("PublicSeoSettingsSchema", () => {
  it("parses valid settings", () => {
    const data = {
      siteName: "Ajira Next",
      tagline: "Elite careers",
      ga4MeasurementId: "G-XXXXXXXXXX",
      organizationName: "Ajira Next Inc",
      organizationUrl: "https://ajira.next",
      organizationLogoUrl: "https://ajira.next/logo.png",
    };
    expect(PublicSeoSettingsSchema.parse(data)).toEqual(data);
  });

  it("accepts null ga4MeasurementId", () => {
    const data = {
      siteName: "Ajira Next",
      tagline: "Elite careers",
      ga4MeasurementId: null,
      organizationName: "Ajira Next Inc",
      organizationUrl: "https://ajira.next",
      organizationLogoUrl: "https://ajira.next/logo.png",
    };
    expect(PublicSeoSettingsSchema.parse(data)).toEqual(data);
  });

  it("rejects invalid URL", () => {
    const data = {
      siteName: "Ajira Next",
      tagline: "Elite careers",
      ga4MeasurementId: null,
      organizationName: "Ajira Next Inc",
      organizationUrl: "not-a-url",
      organizationLogoUrl: "https://ajira.next/logo.png",
    };
    expect(() => PublicSeoSettingsSchema.parse(data)).toThrow();
  });
});

describe("PaginatedMetaSchema", () => {
  it("parses valid meta", () => {
    const data = { page: 1, pageSize: 10, total: 100, totalPages: 10 };
    expect(PaginatedMetaSchema.parse(data)).toEqual(data);
  });
});

describe("ApiEnvelopeSchema", () => {
  it("parses single object envelope", () => {
    const schema = ApiEnvelopeSchema(PublicSeoSettingsSchema);
    const data = {
      data: {
        siteName: "Ajira Next",
        tagline: "Elite careers",
        ga4MeasurementId: null,
        organizationName: "Ajira Next Inc",
        organizationUrl: "https://ajira.next",
        organizationLogoUrl: "https://ajira.next/logo.png",
      },
    };
    expect(schema.parse(data)).toEqual(data);
  });

  it("parses paginated envelope", () => {
    const schema = ApiEnvelopeSchema(FeaturedJobSchema.array());
    const data = {
      data: [
        {
          id: "1",
          title: "Eng",
          company: "A",
          location: "N",
          type: "F",
          postedAt: "2024-01-01",
        },
      ],
      meta: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
    };
    expect(schema.parse(data)).toEqual(data);
  });
});
