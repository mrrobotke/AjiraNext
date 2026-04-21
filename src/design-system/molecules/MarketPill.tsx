import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/design-system/atoms/Icon";

export interface MarketPillProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  flag: string;
  currency: string;
}

export const MarketPill: React.FC<MarketPillProps> = ({
  flag,
  currency,
  className,
  ...rest
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[0.6875rem] font-bold text-[var(--fg)] cursor-pointer hover:border-[var(--primary)] transition-colors",
        className
      )}
      {...rest}
    >
      <span>{flag}</span>
      <span>{currency}</span>
      <Icon name="ChevronDown" size={12} className="opacity-60" />
    </button>
  );
};

MarketPill.displayName = "MarketPill";
