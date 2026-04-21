import React from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconProps } from "./Icon";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leadingIcon?: IconProps["name"];
  trailingIcon?: IconProps["name"];
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, className, leadingIcon, trailingIcon, ...rest }, ref) => {
    const input = (
      <input
        ref={ref}
        className={cn(
          "w-full bg-card border border-border rounded-xl text-sm text-fg outline-none transition-all duration-150",
          "placeholder:text-fg-muted",
          "focus:border-primary focus:shadow-focus",
          error &&
            "border-danger focus:border-danger focus:shadow-focus-danger",
          leadingIcon ? "pl-9" : "pl-3.5",
          trailingIcon ? "pr-9" : "pr-3.5",
          "py-3",
          className,
        )}
        {...rest}
      />
    );

    if (!leadingIcon && !trailingIcon) {
      return input;
    }

    return (
      <div className="relative flex items-center">
        {leadingIcon && (
          <Icon
            name={leadingIcon}
            size={16}
            className="absolute left-3 text-fg-muted pointer-events-none"
          />
        )}
        {input}
        {trailingIcon && (
          <Icon
            name={trailingIcon}
            size={16}
            className="absolute right-3 text-fg-muted pointer-events-none"
          />
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
