import { EmployerDashboardTemplate } from "@/design-system/templates/EmployerDashboardTemplate";
import { StatsRow } from "@/design-system/organisms/StatsRow";

const sidebarGroups = [
  {
    links: [
      {
        icon: "LayoutDashboard" as const,
        label: "Dashboard",
        href: "/employer",
        active: true,
      },
      {
        icon: "Briefcase" as const,
        label: "My Jobs",
        href: "/employer?tab=jobs",
        count: 6,
      },
      {
        icon: "FileText" as const,
        label: "Candidates",
        href: "/employer?tab=candidates",
        count: 24,
      },
      {
        icon: "MessageCircle" as const,
        label: "Messages",
        href: "/employer?tab=messages",
      },
      {
        icon: "BarChart" as const,
        label: "Analytics",
        href: "/employer?tab=analytics",
      },
      {
        icon: "CreditCard" as const,
        label: "Billing",
        href: "/employer?tab=billing",
      },
      {
        icon: "Settings" as const,
        label: "Settings",
        href: "/employer?tab=settings",
      },
    ],
  },
];

export default function EmployerPage() {
  return (
    <EmployerDashboardTemplate
      activeTab="dashboard"
      user={{ name: "Fatima El-Amin", role: "Employer Owner" }}
      sidebarGroups={sidebarGroups}
    >
      <h1 className="text-3xl font-extrabold text-fg mb-1">Dashboard</h1>
      <p className="text-sm text-fg-muted mb-6">
        Manage your jobs and candidates.
      </p>
      <StatsRow
        stats={[
          { label: "Active Jobs", value: "6", icon: "Briefcase" },
          {
            label: "Total Applicants",
            value: "124",
            icon: "Users",
            trend: "up",
            trendLabel: "+18",
          },
          { label: "Interviews", value: "8", icon: "MessageCircle" },
          {
            label: "Hires",
            value: "3",
            icon: "Award",
            trend: "up",
            trendLabel: "+1",
          },
        ]}
      />
    </EmployerDashboardTemplate>
  );
}
