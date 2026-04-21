import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-extrabold uppercase tracking-wide",
  {
    variants: {
      variant: {
        accent:
          "bg-accent/10 text-accent border border-accent",
        green:
          "bg-primary/12 text-primary",
        muted:
          "bg-surface text-fg-muted border border-border",
        red: "bg-danger/12 text-danger",
        blue: "bg-info/12 text-info",
        yellow:
          "bg-warning/14 text-amber-700",
        pill:
          "px-3 py-1.5 font-bold rounded-full",
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
