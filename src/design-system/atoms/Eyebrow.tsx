import React from "react";
import { cn } from "@/lib/utils";

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChip?: boolean;
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  asChip = false,
  className,
  children,
  ...rest
}) => {
  return (
    <span
      className={cn(
        "inline-block text-2xs font-extrabold uppercase tracking-widest",
        asChip
          ? "bg-card border border-border text-fg px-3.5 py-1.5 rounded-full"
          : "text-fg-muted",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

Eyebrow.displayName = "Eyebrow";
