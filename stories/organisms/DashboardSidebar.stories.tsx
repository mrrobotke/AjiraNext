import type { Meta, StoryObj } from "@storybook/react";
import { DashboardSidebar } from "@/design-system/organisms/DashboardSidebar";

const meta: Meta<typeof DashboardSidebar> = {
  title: "Organisms/DashboardSidebar",
  component: DashboardSidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DashboardSidebar>;

export const Default: Story = {
  args: {
    groups: [
      {
        links: [
          { icon: "LayoutDashboard", label: "Overview", href: "#", active: true },
          { icon: "Target", label: "Matches", href: "#", count: 12 },
          { icon: "FileText", label: "Applications", href: "#", count: 4 },
          { icon: "File", label: "Resume", href: "#" },
          { icon: "MessageCircle", label: "Interview Prep", href: "#" },
        ],
      },
    ],
    user: { name: "Amina Okafor", role: "Job Seeker" },
  },
};

export const Light: Story = {
  ...Default,
  globals: { theme: "light" },
};
