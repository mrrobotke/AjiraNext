import type { Meta, StoryObj } from "@storybook/react";
import { Eyebrow } from "@/design-system/atoms/Eyebrow";

const meta: Meta<typeof Eyebrow> = {
  title: "Atoms/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  argTypes: {
    asChip: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Eyebrow>;

export const Default: Story = { args: { children: "Precision Search" } };
export const Chip: Story = { args: { asChip: true, children: "Precision Search" } };
