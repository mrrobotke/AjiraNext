import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "@/design-system/molecules/DropdownMenu";
import { Button } from "@/design-system/atoms/Button";

const meta: Meta<typeof DropdownMenu> = {
  title: "Molecules/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  args: {
    trigger: <Button>Options ▾</Button>,
    items: [
      { icon: "User", label: "Profile", description: "View your profile" },
      { icon: "Settings", label: "Settings", description: "Account settings" },
      { separator: true },
      { icon: "LogOut", label: "Sign out" },
    ],
  },
};
