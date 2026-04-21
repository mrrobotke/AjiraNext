import React from "react";
import { cn } from "@/lib/utils";

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        className={cn(
          "w-4 h-4 border border-border bg-card text-primary accent-primary cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          className,
        )}
        {...rest}
      />
    );
  },
);

Radio.displayName = "Radio";
