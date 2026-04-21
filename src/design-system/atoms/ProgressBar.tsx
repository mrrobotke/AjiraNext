import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = "sm",
  className,
  ...rest
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
  };

  return (
    <div
      className={cn(
        "w-full bg-surface rounded-full overflow-hidden",
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      <div
        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
};

ProgressBar.displayName = "ProgressBar";
