import type { Meta, StoryObj } from "@storybook/react";
import { MarketPill } from "@/design-system/molecules/MarketPill";

const meta: Meta<typeof MarketPill> = {
  title: "Molecules/MarketPill",
  component: MarketPill,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof MarketPill>;

export const Kenya: Story = { args: { flag: "🇰🇪", currency: "KES" } };
export const Nigeria: Story = { args: { flag: "🇳🇬", currency: "NGN" } };
export const Remote: Story = { args: { flag: "🌐", currency: "USD" } };
