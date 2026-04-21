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
          "w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3.5 py-3 text-[0.875rem] text-[var(--fg)] outline-none transition-all duration-150 resize-y min-h-[100px]",
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

TextArea.displayName = "TextArea";
