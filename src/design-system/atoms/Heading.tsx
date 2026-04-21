import React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "7xl" | "5xl" | "4xl" | "3xl" | "2xl" | "xl" | "lg";
  weight?: "bold" | "extrabold" | "black";
}

export const Heading: React.FC<HeadingProps> = ({
  as: Component = "h2",
  size = "2xl",
  weight = "bold",
  className,
  children,
  ...rest
}) => {
  const sizeClasses = {
    "7xl": "text-[4.5rem] leading-[1.05] tracking-[-0.025em]",
    "5xl": "text-[3rem] leading-[1.1] tracking-[-0.02em]",
    "4xl": "text-[2.25rem] leading-[1.15] tracking-[-0.015em]",
    "3xl": "text-[1.875rem] leading-[1.25] tracking-[-0.01em]",
    "2xl": "text-[1.5rem] leading-[1.3] tracking-[-0.005em]",
    xl: "text-[1.25rem] leading-[1.4]",
    lg: "text-[1.125rem] leading-[1.5]",
  };

  const weightClasses = {
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  };

  return (
    <Component
      className={cn(
        "text-[var(--fg)]",
        sizeClasses[size],
        weightClasses[weight],
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};

Heading.displayName = "Heading";
