import type { Meta, StoryObj } from "@storybook/react";
import { EmployerDashboardTemplate } from "@/design-system/templates/EmployerDashboardTemplate";
import { StatsRow } from "@/design-system/organisms/StatsRow";

const meta: Meta<typeof EmployerDashboardTemplate> = {
  title: "Templates/EmployerDashboardTemplate",
  component: EmployerDashboardTemplate,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof EmployerDashboardTemplate>;

export const Default: Story = {
  args: {
    activeTab: "dashboard",
    children: (
      <div>
        <h1 className="text-[1.875rem] font-extrabold text-[var(--fg)] mb-1">
          Dashboard
        </h1>
        <p className="text-[0.875rem] text-[var(--fg-muted)] mb-6">
          Manage your jobs and candidates.
        </p>
        <StatsRow
          stats={[
            { label: "Active Jobs", value: "6", icon: "Briefcase" },
            { label: "Total Applicants", value: "124", icon: "Users", trend: "up", trendLabel: "+18" },
            { label: "Interviews", value: "8", icon: "MessageCircle" },
            { label: "Hires", value: "3", icon: "Award", trend: "up", trendLabel: "+1" },
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
