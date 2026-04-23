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
          "bg-primary text-primary-fg hover:brightness-110 hover:shadow-md active:scale-97",
        secondary:
          "bg-surface text-fg border border-border hover:bg-card active:scale-97",
        ghost:
          "bg-transparent text-fg-muted hover:bg-surface hover:text-fg active:scale-97",
        outline:
          "bg-transparent text-fg border-2 border-border rounded-xl hover:bg-primary hover:text-primary-fg hover:border-primary",
        danger: "bg-danger text-white hover:brightness-110 active:scale-97",
      },
      size: {
        sm: "px-3.5 py-2 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant, size, loading, disabled, children, className, asChild, ...rest },
    ref,
  ) => {
    const classes = cn(
      buttonVariants({ variant, size }),
      (disabled || loading) && "opacity-50 cursor-not-allowed",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      className,
    );

    if (asChild && React.isValidElement(children)) {
      const childProps = children.props as {
        className?: string;
        ref?: React.Ref<unknown>;
      };
      return React.cloneElement(
        children as React.ReactElement<{
          className?: string;
          ref?: React.Ref<unknown>;
        }>,
        {
          className: cn(classes, childProps.className),
          ref,
          ...rest,
        } as Record<string, unknown>,
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...rest}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
