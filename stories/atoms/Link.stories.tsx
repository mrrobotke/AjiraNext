import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "@/design-system/atoms/Link";

const meta: Meta<typeof Link> = {
  title: "Atoms/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    muted: { control: "boolean" },
    underline: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = { args: { children: "Learn more", href: "#" } };
export const Muted: Story = { args: { children: "Muted link", href: "#", muted: true } };
export const Underline: Story = { args: { children: "Underlined", href: "#", underline: true } };
