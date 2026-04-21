import React from "react";
import { cn } from "@/lib/utils";
import { NavItem } from "@/design-system/molecules/NavItem";
import { UserProfileSnippet } from "@/design-system/molecules/UserProfileSnippet";
import { Divider } from "@/design-system/atoms/Divider";

export interface SidebarLink {
  icon: React.ComponentProps<typeof NavItem>["icon"];
  label: string;
  href: string;
  active?: boolean;
  count?: number;
}

export interface DashboardSidebarProps
  extends React.HTMLAttributes<HTMLElement> {
  groups: Array<{
    label?: string;
    links: SidebarLink[];
  }>;
  user: {
    name: string;
    role: string;
    avatarSrc?: string;
  };
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  groups,
  user,
  className,
  ...rest
}) => {
  return (
    <aside
      className={cn(
        "w-[260px] bg-[var(--card)] border-r border-[var(--border)] p-5 flex flex-col gap-4 sticky top-0 h-screen overflow-y-auto",
        className
      )}
      {...rest}
    >
      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.label && (
            <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.14em] text-[var(--fg-muted)] px-2.5 pb-1.5 pt-1">
              {group.label}
            </span>
          )}
          {group.links.map((link) => (
            <NavItem
              key={link.label}
              href={link.href}
              icon={link.icon}
              active={link.active}
              count={link.count}
              className="rounded-lg"
            >
              {link.label}
            </NavItem>
          ))}
        </div>
      ))}
      <div className="mt-auto pt-4">
        <Divider className="mb-4" />
        <UserProfileSnippet
          name={user.name}
          role={user.role}
          avatarSrc={user.avatarSrc}
        />
      </div>
    </aside>
  );
};

DashboardSidebar.displayName = "DashboardSidebar";
