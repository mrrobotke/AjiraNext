import React from "react";
import { cn } from "@/lib/utils";

export type ToggleProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "role" | "aria-checked"
> & {
  label?: string;
} & ({ label: string } | { "aria-label": string });

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, className, checked, defaultChecked, ...rest }, ref) => {
    return (
      <label
        className={cn(
          "inline-flex items-center gap-3 cursor-pointer",
          className,
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            aria-checked={checked ?? defaultChecked ?? false}
            className="sr-only peer"
            checked={checked}
            defaultChecked={defaultChecked}
            {...rest}
          />
          <div className="w-10 h-6 bg-surface border border-border rounded-full peer-checked:bg-primary transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg" />
          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-4" />
        </div>
        {label && <span className="text-sm text-fg font-medium">{label}</span>}
      </label>
    );
  },
);

Toggle.displayName = "Toggle";
