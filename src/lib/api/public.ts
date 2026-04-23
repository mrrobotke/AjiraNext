import { ApiError } from "./errors";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.replace(/\/$/, "");
}

export interface ApiPublicFetchOptions extends RequestInit {
  next?: { revalidate?: number | false; tags?: string[] };
}

export async function apiPublicFetch<T>(
  path: string,
  opts: ApiPublicFetchOptions = {},
): Promise<T> {
  const baseUrl = requireEnv("NEXT_PUBLIC_API_BASE_URL");
  const url = `${baseUrl}${path}`;

  const isServer = typeof window === "undefined";

  const fetchOpts: RequestInit & { next?: unknown } = {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...opts.headers,
    },
  };

  if (!isServer) {
    delete fetchOpts.next;
  } else if (opts.next) {
    fetchOpts.next = {
      revalidate: opts.next.revalidate ?? 60,
      tags: opts.next.tags,
    };
  }

  const response = await fetch(url, fetchOpts);

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text().catch(() => null);
    }
    throw new ApiError(
      `API error: ${response.status} ${response.statusText}`,
      response.status,
      body,
    );
  }

  return response.json() as Promise<T>;
}
