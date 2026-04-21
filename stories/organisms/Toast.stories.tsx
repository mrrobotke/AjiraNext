import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "@/design-system/organisms/Toast";

const meta: Meta<typeof Toast> = {
  title: "Organisms/Toast",
  component: Toast,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: { message: "Application submitted successfully!", visible: true },
};
