import React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  href = "/",
  className,
  ...rest
}) => {
  return (
    <a
      href={href}
      className={cn(
        "inline-block text-xl font-black tracking-tight text-fg whitespace-nowrap flex-shrink-0",
        className
      )}
      {...rest}
    >
      Ajira Nex<span className="text-primary">t.</span>
    </a>
  );
};

Logo.displayName = "Logo";
