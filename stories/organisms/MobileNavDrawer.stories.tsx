import type { Meta, StoryObj } from "@storybook/react";
import { MobileNavDrawer } from "@/design-system/organisms/MobileNavDrawer";

const meta: Meta<typeof MobileNavDrawer> = {
  title: "Organisms/MobileNavDrawer",
  component: MobileNavDrawer,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export default meta;
type Story = StoryObj<typeof MobileNavDrawer>;

export const OpenAnonymous: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
};

export const OpenAuthenticated: Story = {
  args: {
    open: true,
    onClose: () => {},
    user: { email: "user@example.com" },
    dashboardHref: "/seeker",
  },
};
