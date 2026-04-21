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
          ? "text-fg-muted hover:text-primary"
          : "text-fg hover:text-primary",
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
