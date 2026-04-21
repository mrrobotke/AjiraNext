import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon, type IconProps } from "./Icon";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all duration-150",
  {
    variants: {
      variant: {
        default: "bg-card border border-border text-fg hover:bg-surface",
        ghost: "bg-transparent text-fg-muted hover:bg-surface hover:text-fg",
        primary: "bg-primary text-primary-fg hover:brightness-110",
      },
      size: {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconProps["name"];
  iconSize?: number;
  variant?: "default" | "ghost" | "primary";
  size?: "sm" | "md" | "lg";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      iconSize = 16,
      variant = "default",
      size = "md",
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          iconButtonVariants({ variant, size }),
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          className,
        )}
        {...rest}
      >
        <Icon name={icon} size={iconSize} />
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
