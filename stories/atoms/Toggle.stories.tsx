import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "@/design-system/atoms/Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Atoms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = { args: { label: "Enable notifications" } };
export const Checked: Story = { args: { label: "Dark mode", defaultChecked: true } };
export const NoLabel: Story = { args: {} };
