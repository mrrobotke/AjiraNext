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
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]",
        "bg-[var(--fg)] text-[var(--bg)] px-6 py-3 rounded-full",
        "text-[0.8125rem] font-bold shadow-lg",
        "animate-[popIn_0.25s_ease-out]",
        className
      )}
      role="status"
      {...rest}
    >
      {message}
    </div>
  );
};

Toast.displayName = "Toast";
