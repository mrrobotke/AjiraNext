"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconProps } from "@/design-system/atoms/Icon";

export interface DropdownItem {
  icon?: IconProps["name"];
  label?: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  separator?: boolean;
}

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = "right",
  className,
  ...rest
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      const focusableItems = itemRefs.current.filter(Boolean);
      const currentIndex = focusableItems.findIndex(
        (el) => el === document.activeElement,
      );

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex =
          currentIndex + 1 < focusableItems.length ? currentIndex + 1 : 0;
        focusableItems[nextIndex]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : focusableItems.length - 1;
        focusableItems[prevIndex]?.focus();
      } else if (e.key === "Tab") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleTriggerClick = () => setOpen((prev) => !prev);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
    }
  };

  const triggerProps = {
    ref: triggerRef,
    onClick: handleTriggerClick,
    onKeyDown: handleTriggerKeyDown,
    "aria-expanded": open,
    "aria-haspopup": "menu" as const,
  };

  const triggerNode = React.isValidElement(trigger) ? (
    React.cloneElement(trigger, triggerProps)
  ) : (
    <button type="button" {...triggerProps}>
      {trigger}
    </button>
  );

  return (
    <div ref={ref} className={cn("relative", className)} {...rest}>
      {triggerNode}
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-[calc(100%+8px)] z-dropdown w-64 bg-card border border-border rounded-2xl shadow-lg p-2",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div
                key={i}
                className="border-t border-border my-1.5"
                role="separator"
              />
            ) : (
              <a
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitem"
                href={item.href || "#"}
                tabIndex={-1}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-fg hover:bg-surface hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {item.icon && <Icon name={item.icon} size={18} />}
                <div>
                  <div>{item.label}</div>
                  {item.description && (
                    <span className="block text-2xs text-fg-muted font-medium mt-0.5">
                      {item.description}
                    </span>
                  )}
                </div>
              </a>
            ),
          )}
        </div>
      )}
    </div>
  );
};

DropdownMenu.displayName = "DropdownMenu";
