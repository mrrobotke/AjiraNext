import React from "react";
import { cn } from "@/lib/utils";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  underline?: boolean;
  muted?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  underline = false,
  muted = false,
  className,
  children,
  ...rest
}) => {
  return (
    <a
      className={cn(
        "transition-colors duration-150",
        muted
          ? "text-[var(--fg-muted)] hover:text-[var(--primary)]"
          : "text-[var(--fg)] hover:text-[var(--primary)]",
        underline && "hover:underline",
        className
      )}
      {...rest}
    >
      {children}
    </a>
  );
};

Link.displayName = "Link";
