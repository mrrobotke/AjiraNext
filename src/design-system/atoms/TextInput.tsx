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
          "w-full bg-card border border-border rounded-xl px-3.5 py-3 text-sm text-fg outline-none transition-all duration-150",
          "placeholder:text-fg-muted",
          "focus:border-primary focus:shadow-focus",
          error && "border-danger focus:border-danger focus:shadow-focus-danger",
          className
        )}
        {...rest}
      />
    );
  }
);

TextInput.displayName = "TextInput";
