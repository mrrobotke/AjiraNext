import type { Meta, StoryObj } from "@storybook/react";
import { NavItem } from "@/design-system/molecules/NavItem";

const meta: Meta<typeof NavItem> = {
  title: "Molecules/NavItem",
  component: NavItem,
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean" },
    count: { control: "number" },
  },
};
export default meta;

type Story = StoryObj<typeof NavItem>;

export const Default: Story = {
  args: { icon: "LayoutDashboard", children: "Dashboard" },
};

export const Active: Story = {
  args: { icon: "LayoutDashboard", children: "Dashboard", active: true },
};

export const WithCount: Story = {
  args: { icon: "FileText", children: "Applications", count: 4 },
};

export const ActiveWithCount: Story = {
  args: { icon: "FileText", children: "Applications", active: true, count: 4 },
};
