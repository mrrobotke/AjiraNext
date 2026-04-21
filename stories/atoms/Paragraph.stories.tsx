import type { Meta, StoryObj } from "@storybook/react";
import { Paragraph } from "@/design-system/atoms/Paragraph";

const meta: Meta<typeof Paragraph> = {
  title: "Atoms/Paragraph",
  component: Paragraph,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "base", "lg"] },
    muted: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Paragraph>;

export const Default: Story = {
  args: { children: "This is a standard paragraph with muted color." },
};
export const Large: Story = {
  args: { size: "lg", children: "This is a large paragraph for hero sections." },
};
export const NotMuted: Story = {
  args: { muted: false, children: "This paragraph uses the foreground color." },
};
