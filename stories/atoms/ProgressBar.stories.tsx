import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "@/design-system/atoms/ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Atoms/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["sm", "md"] },
  },
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Low: Story = { args: { value: 25 } };
export const Medium: Story = { args: { value: 50 } };
export const High: Story = { args: { value: 88 } };
export const MediumSize: Story = { args: { value: 60, size: "md" } };
