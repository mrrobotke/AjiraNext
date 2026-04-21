import type { Meta, StoryObj } from "@storybook/react";
import { StatsRow } from "@/design-system/organisms/StatsRow";

const meta: Meta<typeof StatsRow> = {
  title: "Organisms/StatsRow",
  component: StatsRow,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof StatsRow>;

export const Default: Story = {
  args: {
    stats: [
      { label: "Active Jobs", value: "62+", icon: "Briefcase", trend: "up", trendLabel: "+3 this week" },
      { label: "Employers", value: "36+", icon: "Building", trend: "up", trendLabel: "+2 this week" },
      { label: "Placed", value: "12k+", icon: "TrendingUp", trend: "up", trendLabel: "+8%" },
      { label: "Users", value: "50k+", icon: "Users" },
    ],
  },
};
