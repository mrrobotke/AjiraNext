import React from "react";
import { cn } from "@/lib/utils";

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "base" | "lg";
  muted?: boolean;
}

export const Paragraph: React.FC<ParagraphProps> = ({
  size = "base",
  muted = true,
  className,
  children,
  ...rest
}) => {
  const sizeClasses = {
    sm: "text-[0.875rem] leading-[1.5]",
    base: "text-[1rem] leading-[1.6]",
    lg: "text-[1.125rem] leading-[1.6]",
  };

  return (
    <p
      className={cn(
        sizeClasses[size],
        muted ? "text-[var(--fg-muted)]" : "text-[var(--fg)]",
        className
      )}
      {...rest}
    >
      {children}
    </p>
  );
};

Paragraph.displayName = "Paragraph";
