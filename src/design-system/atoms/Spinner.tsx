import React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className,
  ...rest
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div
      className={cn(
        "inline-block rounded-full border-current border-t-transparent animate-spin",
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label="Loading"
      {...rest}
    />
  );
};

Spinner.displayName = "Spinner";
