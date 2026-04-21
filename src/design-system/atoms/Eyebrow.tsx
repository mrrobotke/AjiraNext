import React from "react";
import { cn } from "@/lib/utils";

export type EyebrowProps = React.HTMLAttributes<HTMLSpanElement>;

export const Eyebrow: React.FC<EyebrowProps> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <span
      className={cn(
        "inline-block text-2xs font-extrabold uppercase tracking-widest text-fg-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

Eyebrow.displayName = "Eyebrow";
