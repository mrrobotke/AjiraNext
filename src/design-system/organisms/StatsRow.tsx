import React from "react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/design-system/molecules/StatCard";

export interface StatsRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  stats: Array<{
    label: string;
    value: string;
    icon?: React.ComponentProps<typeof StatCard>["icon"];
    trend?: "up" | "down" | "neutral";
    trendLabel?: string;
  }>;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  stats,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5",
        className
      )}
      {...rest}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          trendLabel={stat.trendLabel}
        />
      ))}
    </div>
  );
};

StatsRow.displayName = "StatsRow";
