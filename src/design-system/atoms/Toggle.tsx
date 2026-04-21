import React from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, className, ...rest }, ref) => {
    return (
      <label className={cn("inline-flex items-center gap-3 cursor-pointer", className)}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...rest}
          />
          <div className="w-10 h-6 bg-[var(--surface)] border border-[var(--border)] rounded-full peer-checked:bg-[var(--primary)] transition-colors duration-200" />
          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-4" />
        </div>
        {label && (
          <span className="text-[0.875rem] text-[var(--fg)] font-medium">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";
