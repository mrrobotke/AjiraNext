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
        "inline-block text-[0.6875rem] font-extrabold uppercase tracking-[0.18em]",
        asChip
          ? "bg-[var(--card)] border border-[var(--border)] text-[var(--fg)] px-[14px] py-[6px] rounded-full"
          : "text-[var(--fg-muted)]",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

Eyebrow.displayName = "Eyebrow";
