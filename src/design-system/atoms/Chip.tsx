import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-[5px] px-2.5 py-1 rounded-full text-[0.6875rem] font-extrabold uppercase tracking-[0.08em]",
  {
    variants: {
      variant: {
        accent:
          "bg-[hsl(32_95%_60%/0.1)] text-[var(--accent)] border border-[var(--accent)]",
        green:
          "bg-[hsl(155_100%_42%/0.12)] text-[var(--primary)]",
        muted:
          "bg-[var(--surface)] text-[var(--fg-muted)] border border-[var(--border)]",
        red: "bg-[hsl(0_84%_65%/0.12)] text-[var(--aj-danger)]",
        blue: "bg-[hsl(217_91%_60%/0.12)] text-[hsl(217_91%_60%)]",
        yellow:
          "bg-[hsl(38_92%_60%/0.14)] text-[hsl(35_70%_40%)]",
        pill:
          "px-3 py-[5px] font-bold rounded-full",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

export const Chip: React.FC<ChipProps> = ({
  variant,
  className,
  children,
  ...rest
}) => {
  return (
    <span className={cn(chipVariants({ variant }), className)} {...rest}>
      {children}
    </span>
  );
};

Chip.displayName = "Chip";
