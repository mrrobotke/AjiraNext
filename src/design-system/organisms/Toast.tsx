import React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  visible?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  visible = true,
  className,
  ...rest
}) => {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-toast",
        "bg-fg text-bg px-6 py-3 rounded-full",
        "text-sm font-bold shadow-lg",
        "animate-pop-in",
        className,
      )}
      role="status"
      {...rest}
    >
      {message}
    </div>
  );
};

Toast.displayName = "Toast";
