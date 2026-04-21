import React from "react";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/design-system/organisms/DashboardSidebar";
import { SearchInput } from "@/design-system/atoms/SearchInput";
import { IconButton } from "@/design-system/atoms/IconButton";

export interface JobSeekerDashboardTemplateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  activeTab?: string;
}

const sidebarGroups = [
  {
    links: [
      { icon: "LayoutDashboard" as const, label: "Overview", href: "/seeker", active: true },
      { icon: "Target" as const, label: "Matches", href: "/seeker?tab=matches", count: 12 },
      { icon: "FileText" as const, label: "Applications", href: "/seeker?tab=applications", count: 4 },
      { icon: "File" as const, label: "Resume", href: "/seeker?tab=resume" },
      { icon: "MessageCircle" as const, label: "Interview Prep", href: "/seeker?tab=prep" },
      { icon: "TrendingUp" as const, label: "Career Paths", href: "/seeker?tab=paths" },
      { icon: "User" as const, label: "Profile", href: "/seeker?tab=profile" },
      { icon: "CreditCard" as const, label: "Billing", href: "/seeker?tab=billing" },
    ],
  },
];

export const JobSeekerDashboardTemplate: React.FC<
  JobSeekerDashboardTemplateProps
> = ({ children, activeTab, className, ...rest }) => {
  return (
    <div className={cn("grid grid-cols-[260px_1fr] min-h-screen", className)} {...rest}>
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
        user={{ name: "Amina Okafor", role: "Job Seeker" }}
      />
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-4 px-7 py-4 border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 z-20">
          <SearchInput
            placeholder="Search..."
            className="flex-1 max-w-[520px]"
          />
          <div className="flex items-center gap-2 ml-auto">
            <IconButton
              icon="Bell"
              size="sm"
              variant="default"
              aria-label="Notifications"
              className="relative"
            >
              <span className="absolute top-[7px] right-[7px] w-2 h-2 rounded-full bg-[var(--accent)] border-2 border-[var(--card)]" />
            </IconButton>
            <IconButton
              icon="Settings"
              size="sm"
              variant="default"
              aria-label="Settings"
            />
          </div>
        </div>
        <div className="p-7 flex-1">{children}</div>
      </div>
    </div>
  );
};

JobSeekerDashboardTemplate.displayName = "JobSeekerDashboardTemplate";
