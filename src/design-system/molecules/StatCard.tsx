import React from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconProps } from "@/design-system/atoms/Icon";
import { Heading } from "@/design-system/atoms/Heading";
import { Caption } from "@/design-system/atoms/Caption";

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  icon?: IconProps["name"];
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendLabel,
  className,
  ...rest
}) => {
  const trendClasses = {
    up: "text-primary",
    down: "text-danger",
    neutral: "text-fg-muted",
  };

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-4",
        className
      )}
      {...rest}
    >
      <Caption className="uppercase tracking-wide font-extrabold text-2xs">
        {label}
      </Caption>
      <div className="flex items-center gap-3 mt-1.5 mb-1">
        <Heading as="h3" size="2xl" weight="black">
          {value}
        </Heading>
        {icon && (
          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-fg-muted">
            <Icon name={icon} size={14} />
          </div>
        )}
      </div>
      {trend && trendLabel && (
        <Caption className={cn("font-semibold", trendClasses[trend])}>
          {trendLabel}
        </Caption>
      )}
    </div>
  );
};

StatCard.displayName = "StatCard";
