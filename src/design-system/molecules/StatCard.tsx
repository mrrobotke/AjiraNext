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
    up: "text-[var(--primary)]",
    down: "text-[var(--aj-danger)]",
    neutral: "text-[var(--fg-muted)]",
  };

  return (
    <div
      className={cn(
        "bg-[var(--card)] border border-[var(--border)] rounded-[14px] p-4",
        className
      )}
      {...rest}
    >
      <Caption className="uppercase tracking-[0.12em] font-extrabold text-[0.625rem]">
        {label}
      </Caption>
      <div className="flex items-center gap-3 mt-1.5 mb-1">
        <Heading as="h3" size="2xl" weight="black">
          {value}
        </Heading>
        {icon && (
          <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)]">
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
