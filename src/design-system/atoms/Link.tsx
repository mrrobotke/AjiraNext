import React from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

function isExternal(href?: string) {
  return (
    !href ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  underline?: boolean;
  muted?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  underline = false,
  muted = false,
  className,
  children,
  href,
  ...rest
}) => {
  const classes = cn(
    "transition-colors duration-150",
    muted ? "text-fg-muted hover:text-primary" : "text-fg hover:text-primary",
    underline && "hover:underline",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    className,
  );

  if (isExternal(href)) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <NextLink className={classes} href={href ?? "#"} {...rest}>
      {children}
    </NextLink>
  );
};

Link.displayName = "Link";
