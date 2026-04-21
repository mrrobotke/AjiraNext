import React from "react";
import { cn } from "@/lib/utils";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, className, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-card border border-border rounded-xl px-3.5 py-3 text-sm text-fg outline-none transition-all duration-150 resize-y min-h-24",
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

TextArea.displayName = "TextArea";
