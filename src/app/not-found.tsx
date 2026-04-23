import { Heading } from "@/design-system/atoms/Heading";
import { Paragraph } from "@/design-system/atoms/Paragraph";
import { Button } from "@/design-system/atoms/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <Heading as="h1" size="5xl" weight="black" className="mb-4">
        404
      </Heading>
      <Paragraph size="lg" muted className="mb-8 max-w-md">
        We could not find the page you were looking for. It might have been
        moved, deleted, or the URL may be incorrect.
      </Paragraph>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
