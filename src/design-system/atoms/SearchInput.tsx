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
        className="absolute left-3 text-fg-muted pointer-events-none"
      />
      <input
        ref={ref}
        type="search"
        className={cn(
          "w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-fg outline-none transition-all duration-150",
          "placeholder:text-fg-muted",
          "focus:border-primary focus:shadow-focus"
        )}
        {...rest}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";
