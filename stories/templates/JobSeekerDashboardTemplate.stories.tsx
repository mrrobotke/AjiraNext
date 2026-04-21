import type { Meta, StoryObj } from "@storybook/react";
import { JobSeekerDashboardTemplate } from "@/design-system/templates/JobSeekerDashboardTemplate";
import { StatsRow } from "@/design-system/organisms/StatsRow";

const meta: Meta<typeof JobSeekerDashboardTemplate> = {
  title: "Templates/JobSeekerDashboardTemplate",
  component: JobSeekerDashboardTemplate,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof JobSeekerDashboardTemplate>;

export const Default: Story = {
  args: {
    activeTab: "overview",
    children: (
      <div>
        <h1 className="text-[1.875rem] font-extrabold text-[var(--fg)] mb-1">
          Overview
        </h1>
        <p className="text-[0.875rem] text-[var(--fg-muted)] mb-6">
          Your job search at a glance.
        </p>
        <StatsRow
          stats={[
            { label: "Profile Views", value: "128", icon: "Eye", trend: "up", trendLabel: "+12%" },
            { label: "Applications", value: "4", icon: "FileText" },
            { label: "Interviews", value: "2", icon: "MessageCircle", trend: "up", trendLabel: "+1" },
            { label: "Saved Jobs", value: "12", icon: "Bookmark" },
            { label: "Match Score", value: "88", icon: "Target" },
          ]}
        />
      </div>
    ),
  },
};
