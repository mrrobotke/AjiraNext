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

export interface DropdownMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
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

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)} {...rest}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute top-[calc(100%+8px)] z-40 w-64 bg-card border border-border rounded-2xl shadow-lg p-2",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div
                key={i}
                className="border-t border-border my-1.5"
              />
            ) : (
              <a
                key={i}
                href={item.href || "#"}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-fg hover:bg-surface hover:text-primary transition-colors"
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
            )
          )}
        </div>
      )}
    </div>
  );
};

DropdownMenu.displayName = "DropdownMenu";
