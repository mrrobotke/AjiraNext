import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap transition-all duration-150 rounded-full",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-[var(--primary-fg)] hover:brightness-110 hover:shadow-md active:scale-[0.97]",
        secondary:
          "bg-[var(--surface)] text-[var(--fg)] border border-[var(--border)] hover:bg-[var(--card)] active:scale-[0.97]",
        ghost:
          "bg-transparent text-[var(--fg-muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)] active:scale-[0.97]",
        outline:
          "bg-transparent text-[var(--fg)] border-2 border-[var(--border)] rounded-xl hover:bg-[var(--primary)] hover:text-[var(--primary-fg)] hover:border-[var(--primary)]",
        danger:
          "bg-[var(--aj-danger)] text-white hover:brightness-110 active:scale-[0.97]",
      },
      size: {
        sm: "px-3.5 py-2 text-[0.75rem]",
        md: "px-5 py-2.5 text-[0.875rem]",
        lg: "px-7 py-3.5 text-[0.875rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, disabled, children, className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({ variant, size }),
          (disabled || loading) && "opacity-50 cursor-not-allowed",
          className
        )}
        {...rest}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
