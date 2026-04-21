import type { Meta, StoryObj } from "@storybook/react";
import { Marquee } from "@/design-system/organisms/Marquee";

const meta: Meta<typeof Marquee> = {
  title: "Organisms/Marquee",
  component: Marquee,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Marquee>;

export const Default: Story = {
  args: {
    items: [
      "Paystack",
      "Andela",
      "M-Kopa",
      "Safaricom",
      "Flutterwave",
      "Jumia",
      "Twiga Foods",
      "Absa Group",
    ],
  },
};

export const Light: Story = {
  ...Default,
  globals: { theme: "light" },
};
