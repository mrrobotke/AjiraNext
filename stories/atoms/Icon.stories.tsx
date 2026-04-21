import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "@/design-system/atoms/Icon";

const meta: Meta<typeof Icon> = {
  title: "Atoms/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: ["Search", "Bell", "Settings", "User", "Check", "X"],
    },
    size: { control: "number" },
    strokeWidth: { control: "number" },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = { args: { name: "Search", size: 24 } };
export const Large: Story = { args: { name: "Bell", size: 32 } };
export const Thick: Story = { args: { name: "Check", size: 24, strokeWidth: 3 } };
export const All: Story = {
  render: () => (
    <div className="flex gap-4 text-fg">
      <Icon name="Search" size={20} />
      <Icon name="Bell" size={20} />
      <Icon name="Settings" size={20} />
      <Icon name="User" size={20} />
      <Icon name="Check" size={20} />
      <Icon name="X" size={20} />
    </div>
  ),
};
