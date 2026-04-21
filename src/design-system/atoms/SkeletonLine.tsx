import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonLineProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  width = "100%",
  height = "1rem",
  rounded = "md",
  className,
  style,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-surface",
        rounded === "sm" && "rounded-sm",
        rounded === "md" && "rounded-md",
        rounded === "lg" && "rounded-lg",
        rounded === "full" && "rounded-full",
        className
      )}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
};

SkeletonLine.displayName = "SkeletonLine";
