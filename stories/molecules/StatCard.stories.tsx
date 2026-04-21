import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "@/design-system/molecules/StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Molecules/StatCard",
  component: StatCard,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: { label: "Active Jobs", value: "62+", icon: "Briefcase" },
};

export const WithTrend: Story = {
  args: {
    label: "Placed This Year",
    value: "12k+",
    icon: "TrendingUp",
    trend: "up",
    trendLabel: "+8% from last month",
  },
};

export const NegativeTrend: Story = {
  args: {
    label: "Bounce Rate",
    value: "24%",
    trend: "down",
    trendLabel: "-2% from last week",
  },
};
