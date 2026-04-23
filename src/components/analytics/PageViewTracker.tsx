"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function sendPageView(gaId: string, path: string) {
  if (
    typeof window === "undefined" ||
    !(window as Window & { gtag?: unknown }).gtag
  )
    return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag("config", gaId, { page_path: path });
}

export function PageViewTracker({ gaId }: { gaId: string | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId) return;
    const path =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    sendPageView(gaId, path);
  }, [pathname, searchParams, gaId]);

  if (!gaId) return null;

  return (
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
  );
}
