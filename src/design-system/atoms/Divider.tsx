import React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  className,
  ...rest
}) => {
  return (
    <hr
      className={cn(
        "border-border",
        orientation === "horizontal"
          ? "w-full border-t"
          : "h-full border-l",
        className
      )}
      {...rest}
    />
  );
};

Divider.displayName = "Divider";
