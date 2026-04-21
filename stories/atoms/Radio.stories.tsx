import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "@/design-system/atoms/Radio";

const meta: Meta<typeof Radio> = {
  title: "Atoms/Radio",
  component: Radio,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
