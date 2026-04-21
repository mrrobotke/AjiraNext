import React from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/design-system/atoms/Heading";
import { IconButton } from "@/design-system/atoms/IconButton";

export interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "md" | "lg" | "xl";
  open?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  size = "md",
  open = true,
}) => {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    md: "max-w-[560px]",
    lg: "max-w-[900px]",
    xl: "max-w-[1100px]",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[hsl(216_60%_10%_/0.5)] backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-lg w-[calc(100%-48px)] max-h-[90vh] overflow-y-auto p-7 animate-[popIn_0.2s_ease-out]",
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4 mb-5">
          {title ? (
            <Heading as="h3" size="xl" weight="extrabold">
              {title}
            </Heading>
          ) : (
            <div />
          )}
          <IconButton
            icon="X"
            size="sm"
            variant="ghost"
            onClick={onClose}
            aria-label="Close modal"
            className="bg-[var(--surface)]"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

Modal.displayName = "Modal";
