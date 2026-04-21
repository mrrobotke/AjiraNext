import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, children, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full bg-card border border-border rounded-xl px-3.5 py-3 text-sm text-fg outline-none transition-all duration-150 appearance-none",
          "focus:border-primary focus:shadow-focus",
          error && "border-danger focus:border-danger focus:shadow-focus-danger",
          className
        )}
        {...rest}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
