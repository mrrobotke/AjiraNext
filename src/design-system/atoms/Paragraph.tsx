import React from "react";
import { cn } from "@/lib/utils";

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "base" | "lg";
  muted?: boolean;
}

export const Paragraph: React.FC<ParagraphProps> = ({
  size = "base",
  muted = false,
  className,
  children,
  ...rest
}) => {
  const sizeClasses = {
    sm: "text-sm leading-normal",
    base: "text-base leading-base",
    lg: "text-lg leading-base",
  };

  return (
    <p
      className={cn(
        sizeClasses[size],
        muted ? "text-fg-muted" : "text-fg",
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
};

Paragraph.displayName = "Paragraph";
