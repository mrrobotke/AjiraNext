import type { Meta, StoryObj } from "@storybook/react";
import { MobileMarketingHeader } from "@/design-system/organisms/MobileMarketingHeader";

const meta: Meta<typeof MobileMarketingHeader> = {
  title: "Organisms/MobileMarketingHeader",
  component: MobileMarketingHeader,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export default meta;
type Story = StoryObj<typeof MobileMarketingHeader>;

export const Default: Story = {
  args: {
    menuOpen: false,
  },
};

export const MenuOpen: Story = {
  args: {
    menuOpen: true,
  },
};

export const Authenticated: Story = {
  args: {
    user: { email: "user@example.com" },
    dashboardHref: "/seeker",
  },
};
