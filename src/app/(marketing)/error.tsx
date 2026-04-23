"use client";

import { useEffect } from "react";
import { Heading } from "@/design-system/atoms/Heading";
import { Paragraph } from "@/design-system/atoms/Paragraph";
import { Button } from "@/design-system/atoms/Button";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-8 text-center">
      <Heading as="h1" size="3xl" weight="bold" className="mb-4">
        Something went wrong
      </Heading>
      <Paragraph size="base" muted className="mb-8 max-w-md">
        We encountered an unexpected error. Please try again or contact support
        if the problem persists.
      </Paragraph>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
