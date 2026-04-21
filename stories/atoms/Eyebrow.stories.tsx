import type { Meta, StoryObj } from "@storybook/react";
import { Eyebrow } from "@/design-system/atoms/Eyebrow";
import { Chip } from "@/design-system/atoms/Chip";

const meta: Meta<typeof Eyebrow> = {
  title: "Atoms/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Eyebrow>;

export const Default: Story = { args: { children: "Precision Search" } };

export const InsideChip: Story = {
  render: () => (
    <Chip variant="muted">
      <Eyebrow>Precision Search</Eyebrow>
    </Chip>
  ),
};
