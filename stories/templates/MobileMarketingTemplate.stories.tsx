import type { Meta, StoryObj } from "@storybook/react";
import { MobileMarketingTemplate } from "@/design-system/templates/MobileMarketingTemplate";

const meta: Meta<typeof MobileMarketingTemplate> = {
  title: "Templates/MobileMarketingTemplate",
  component: MobileMarketingTemplate,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export default meta;
type Story = StoryObj<typeof MobileMarketingTemplate>;

export const Default: Story = {
  args: {
    children: <div className="p-4">Page content goes here</div>,
  },
};

export const Authenticated: Story = {
  args: {
    children: <div className="p-4">Page content goes here</div>,
    user: { email: "user@example.com" },
    dashboardHref: "/seeker",
  },
};
