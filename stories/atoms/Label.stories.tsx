import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/design-system/atoms/Label";

const meta: Meta<typeof Label> = {
  title: "Atoms/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    uppercase: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = { args: { children: "Email Address" } };
export const NoUppercase: Story = { args: { uppercase: false, children: "Full Name" } };
