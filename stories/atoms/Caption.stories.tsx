import type { Meta, StoryObj } from "@storybook/react";
import { Caption } from "@/design-system/atoms/Caption";

const meta: Meta<typeof Caption> = {
  title: "Atoms/Caption",
  component: Caption,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "error", "success"] },
  },
};
export default meta;

type Story = StoryObj<typeof Caption>;

export const Default: Story = { args: { children: "Helper text" } };
export const Error: Story = { args: { variant: "error", children: "This field is required" } };
export const Success: Story = { args: { variant: "success", children: "Saved successfully" } };
