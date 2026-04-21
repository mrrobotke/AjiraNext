import type { Meta, StoryObj } from "@storybook/react";
import { AdminDashboardTemplate } from "@/design-system/templates/AdminDashboardTemplate";
import { StatsRow } from "@/design-system/organisms/StatsRow";

const meta: Meta<typeof AdminDashboardTemplate> = {
  title: "Templates/AdminDashboardTemplate",
  component: AdminDashboardTemplate,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AdminDashboardTemplate>;

const sidebarGroups = [
  {
    links: [
      {
        icon: "LayoutDashboard" as const,
        label: "Dashboard",
        href: "/admin",
        active: true,
      },
      { icon: "Users" as const, label: "Users", href: "/admin?tab=users" },
      { icon: "Briefcase" as const, label: "Jobs", href: "/admin?tab=jobs" },
      {
        icon: "Building" as const,
        label: "Employers",
        href: "/admin?tab=employers",
      },
      {
        icon: "FileText" as const,
        label: "Applications",
        href: "/admin?tab=applications",
      },
      {
        icon: "BarChart" as const,
        label: "Analytics",
        href: "/admin?tab=analytics",
      },
      {
        icon: "Settings" as const,
        label: "Settings",
        href: "/admin?tab=settings",
      },
    ],
  },
];

export const Default: Story = {
  args: {
    activeTab: "dashboard",
    user: { name: "Grace Wanjiru", role: "Super Admin" },
    sidebarGroups,
    children: (
      <div>
        <h1 className="text-[1.875rem] font-extrabold text-[var(--fg)] mb-1">
          Dashboard
        </h1>
        <p className="text-[0.875rem] text-[var(--fg-muted)] mb-6">
          Platform overview and key metrics.
        </p>
        <StatsRow
          stats={[
            {
              label: "Total Users",
              value: "50,240",
              icon: "Users",
              trend: "up",
              trendLabel: "+5%",
            },
            {
              label: "Active Jobs",
              value: "62",
              icon: "Briefcase",
              trend: "up",
              trendLabel: "+3",
            },
            { label: "Applications", value: "1,204", icon: "FileText" },
            {
              label: "Revenue",
              value: "$24k",
              icon: "DollarSign",
              trend: "up",
              trendLabel: "+12%",
            },
          ]}
        />
      </div>
    ),
  },
};

export const Light: Story = {
  ...Default,
  globals: { theme: "light" },
};
