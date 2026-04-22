// src/lib/config.ts
export const config = {
  baseUrl: (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ).replace(/\/$/, ""),
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "AjiraNext",
  apiUrl: (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085/v1"
  ).replace(/\/$/, ""),
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
} as const;
