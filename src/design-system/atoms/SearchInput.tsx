import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput = React.forwardRef<
  HTMLInputElement,
  SearchInputProps
>(({ className, ...rest }, ref) => {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Icon
        name="Search"
        size={16}
        className="absolute left-3 text-[var(--fg-muted)] pointer-events-none"
      />
      <input
        ref={ref}
        type="search"
        className={cn(
          "w-full bg-[var(--card)] border border-[var(--border)] rounded-xl pl-9 pr-3 py-2.5 text-[0.875rem] text-[var(--fg)] outline-none transition-all duration-150",
          "placeholder:text-[var(--fg-muted)]",
          "focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_hsl(155_100%_42%_/0.18)]"
        )}
        {...rest}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";
