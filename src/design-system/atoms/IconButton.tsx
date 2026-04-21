import React from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconProps } from "./Icon";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconProps["name"];
  iconSize?: number;
  variant?: "default" | "ghost" | "primary";
  size?: "sm" | "md" | "lg";
}

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps
>(
  (
    { icon, iconSize = 16, variant = "default", size = "md", className, ...rest },
    ref
  ) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    const variantClasses = {
      default:
        "bg-[var(--card)] border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--surface)]",
      ghost:
        "bg-transparent text-[var(--fg-muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)]",
      primary:
        "bg-[var(--primary)] text-[var(--primary-fg)] hover:brightness-110",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-150",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...rest}
      >
        <Icon name={icon} size={iconSize} />
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
