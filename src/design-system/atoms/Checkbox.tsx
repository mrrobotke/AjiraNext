import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "w-4 h-4 rounded border border-border bg-card text-primary accent-primary cursor-pointer",
          className
        )}
        {...rest}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
