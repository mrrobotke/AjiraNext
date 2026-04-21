import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@/design-system/atoms/Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    initials: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Small: Story = { args: { size: "sm", initials: "AO" } };
export const Medium: Story = { args: { size: "md", initials: "AO" } };
export const Large: Story = { args: { size: "lg", initials: "AO" } };
export const WithImage: Story = {
  args: { size: "md", initials: "AO", src: "/assets/av-m1.jpg" },
};
