import React from "react";
import { cn } from "@/lib/utils";

export interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "error" | "success";
}

export const Caption: React.FC<CaptionProps> = ({
  variant = "default",
  className,
  children,
  ...rest
}) => {
  const variantClasses = {
    default: "text-[var(--fg-muted)]",
    error: "text-[var(--aj-danger)]",
    success: "text-[var(--aj-success)]",
  };

  return (
    <span
      className={cn(
        "text-[0.75rem] font-medium leading-[1.5]",
        variantClasses[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

Caption.displayName = "Caption";
