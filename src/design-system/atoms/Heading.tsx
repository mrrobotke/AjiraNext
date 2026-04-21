import React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "hero-b" | "hero-c" | "hero-a" | "7xl" | "5xl" | "4xl" | "3xl" | "2xl" | "xl" | "lg";
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
    "hero-b": "text-hero-b leading-none tracking-tighter",
    "hero-c": "text-hero-c leading-none tracking-tighter",
    "hero-a": "text-hero-a leading-none tracking-tighter",
    "7xl": "text-7xl leading-tight tracking-tighter",
    "5xl": "text-5xl leading-tight tracking-tight",
    "4xl": "text-4xl leading-snug tracking-tight",
    "3xl": "text-3xl leading-snug tracking-tight",
    "2xl": "text-2xl leading-snug",
    xl: "text-xl leading-snug",
    lg: "text-lg leading-relaxed",
  };

  const weightClasses = {
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  };

  return (
    <Component
      className={cn(
        "text-fg",
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
