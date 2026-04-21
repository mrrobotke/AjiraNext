import React from "react";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/design-system/organisms/DashboardSidebar";
import { SearchInput } from "@/design-system/atoms/SearchInput";
import { IconButton } from "@/design-system/atoms/IconButton";

export interface AdminDashboardTemplateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  activeTab?: string;
}

const sidebarGroups = [
  {
    links: [
      { icon: "LayoutDashboard" as const, label: "Dashboard", href: "/admin", active: true },
      { icon: "Users" as const, label: "Users", href: "/admin?tab=users" },
      { icon: "Briefcase" as const, label: "Jobs", href: "/admin?tab=jobs" },
      { icon: "Building" as const, label: "Employers", href: "/admin?tab=employers" },
      { icon: "FileText" as const, label: "Applications", href: "/admin?tab=applications" },
      { icon: "BarChart" as const, label: "Analytics", href: "/admin?tab=analytics" },
      { icon: "Settings" as const, label: "Settings", href: "/admin?tab=settings" },
    ],
  },
];

export const AdminDashboardTemplate: React.FC<
  AdminDashboardTemplateProps
> = ({ children, activeTab, className, ...rest }) => {
  return (
    <div className={cn("grid grid-cols-[auto_1fr] min-h-screen", className)} {...rest}>
      <DashboardSidebar
        groups={sidebarGroups.map((g) => ({
          ...g,
          links: g.links.map((l) => ({
            ...l,
            active: activeTab
              ? l.href.includes(activeTab)
              : l.active,
          })),
        }))}
        user={{ name: "Grace Wanjiru", role: "Super Admin" }}
      />
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-4 px-7 py-4 border-b border-border bg-bg sticky top-0 z-20">
          <SearchInput
            placeholder="Search users, jobs..."
            className="flex-1 max-w-xl"
          />
          <div className="flex items-center gap-2 ml-auto">
            <IconButton
              icon="Bell"
              size="sm"
              variant="default"
              aria-label="Notifications"
              className="relative"
            >
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent border-2 border-card" />
            </IconButton>
          </div>
        </div>
        <div className="p-7 flex-1">{children}</div>
      </div>
    </div>
  );
};

AdminDashboardTemplate.displayName = "AdminDashboardTemplate";
