import React from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "w-4 h-4 rounded border border-border bg-card text-primary accent-primary cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          className,
        )}
        {...rest}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";
