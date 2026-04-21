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
        "inline-block text-[1.25rem] font-black tracking-[-0.03em] text-[var(--fg)] whitespace-nowrap flex-shrink-0",
        className
      )}
      {...rest}
    >
      Ajira Nex<span className="text-[var(--primary)]">t.</span>
    </a>
  );
};

Logo.displayName = "Logo";
