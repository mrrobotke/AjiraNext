import React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        className={cn(
          "w-4 h-4 border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] accent-[var(--primary)] cursor-pointer",
          className
        )}
        {...rest}
      />
    );
  }
);

Radio.displayName = "Radio";
