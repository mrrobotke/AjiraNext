import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "@/design-system/atoms/Divider";

const meta: Meta<typeof Divider> = {
  title: "Atoms/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <Divider />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="h-16 flex items-center">
      <Divider orientation="vertical" />
    </div>
  ),
};
