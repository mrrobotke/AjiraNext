import React from "react";
import { cn } from "@/lib/utils";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3.5 py-3 text-[0.875rem] text-[var(--fg)] outline-none transition-all duration-150",
          "placeholder:text-[var(--fg-muted)]",
          "focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_hsl(155_100%_42%_/0.18)]",
          error && "border-[var(--aj-danger)] focus:border-[var(--aj-danger)] focus:shadow-[0_0_0_3px_hsl(0_84%_65%_/0.18)]",
          className
        )}
        {...rest}
      />
    );
  }
);

TextInput.displayName = "TextInput";
