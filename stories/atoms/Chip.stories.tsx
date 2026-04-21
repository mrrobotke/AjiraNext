import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "@/design-system/atoms/Chip";

const meta: Meta<typeof Chip> = {
  title: "Atoms/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["accent", "green", "muted", "red", "blue", "yellow", "pill"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Accent: Story = { args: { variant: "accent", children: "Featured" } };
export const Green: Story = { args: { variant: "green", children: "New" } };
export const Muted: Story = { args: { variant: "muted", children: "Draft" } };
export const Red: Story = { args: { variant: "red", children: "Urgent" } };
export const Blue: Story = { args: { variant: "blue", children: "Info" } };
export const Yellow: Story = { args: { variant: "yellow", children: "Warning" } };

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="accent">Featured</Chip>
      <Chip variant="green">New</Chip>
      <Chip variant="muted">Draft</Chip>
      <Chip variant="red">Urgent</Chip>
      <Chip variant="blue">Info</Chip>
      <Chip variant="yellow">Warning</Chip>
    </div>
  ),
};
