import React from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { Icon, type IconProps } from "@/design-system/atoms/Icon";

function isExternal(href?: string) {
  return (
    !href ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export interface NavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
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
  href,
  ...rest
}) => {
  const classes = cn(
    "inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-150",
    active
      ? "text-fg bg-surface"
      : "text-fg-muted hover:text-fg hover:bg-surface",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    className,
  );

  const content = (
    <>
      {icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={cn(
            "ml-auto text-2xs font-extrabold rounded-full px-2 py-px",
            active ? "bg-primary text-primary-fg" : "bg-surface text-fg-muted",
          )}
        >
          {count}
        </span>
      )}
    </>
  );

  if (isExternal(href)) {
    return (
      <a className={classes} href={href} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <NextLink className={classes} href={href ?? "#"} {...rest}>
      {content}
    </NextLink>
  );
};

NavItem.displayName = "NavItem";
