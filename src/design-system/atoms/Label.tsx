import React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  uppercase?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  uppercase = true,
  className,
  children,
  ...rest
}) => {
  return (
    <label
      className={cn(
        "block text-[0.75rem] font-extrabold tracking-[0.1em] text-[var(--fg-muted)]",
        uppercase && "uppercase",
        className
      )}
      {...rest}
    >
      {children}
    </label>
  );
};

Label.displayName = "Label";
