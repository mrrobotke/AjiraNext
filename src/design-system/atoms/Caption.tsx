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
    default: "text-fg-muted",
    error: "text-danger",
    success: "text-success",
  };

  return (
    <span
      className={cn(
        "text-xs font-medium leading-normal",
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
