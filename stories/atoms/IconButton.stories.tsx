import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "@/design-system/atoms/IconButton";

const meta: Meta<typeof IconButton> = {
  title: "Atoms/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: "select", options: ["Search", "Bell", "Settings", "X", "Menu"] },
    variant: { control: "select", options: ["default", "ghost", "primary"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = { args: { icon: "Search" } };
export const Ghost: Story = { args: { icon: "Bell", variant: "ghost" } };
export const Primary: Story = { args: { icon: "Settings", variant: "primary" } };
export const Small: Story = { args: { icon: "X", size: "sm" } };
export const Large: Story = { args: { icon: "Menu", size: "lg" } };
