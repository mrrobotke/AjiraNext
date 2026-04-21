import React from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconProps } from "@/design-system/atoms/Icon";
import { Link } from "@/design-system/atoms/Link";

export interface NavItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: IconProps["name"];
  active?: boolean;
  count?: number;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  active,
  count,
  children,
  className,
  ...rest
}) => {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full text-[0.875rem] font-semibold transition-all duration-150",
        active
          ? "text-[var(--fg)] bg-[var(--surface)]"
          : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]",
        className
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={cn(
            "ml-auto text-[0.625rem] font-extrabold rounded-full px-2 py-px",
            active
              ? "bg-[var(--primary)] text-[var(--primary-fg)]"
              : "bg-[var(--surface)] text-[var(--fg-muted)]"
          )}
        >
          {count}
        </span>
      )}
    </a>
  );
};

NavItem.displayName = "NavItem";
