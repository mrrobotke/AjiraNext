import type { Meta, StoryObj } from "@storybook/react";
import { JobDetailHeader } from "@/design-system/organisms/JobDetailHeader";

const meta: Meta<typeof JobDetailHeader> = {
  title: "Organisms/JobDetailHeader",
  component: JobDetailHeader,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof JobDetailHeader>;

export const Default: Story = {
  args: {
    title: "Senior Product Strategist",
    companyName: "Andela",
    companyLogo: "A",
    companyColor: "#3c78d8",
    location: "Nairobi",
    type: "Full-time",
    level: "Senior",
    salary: "KES 320k–450k",
    posted: "2d ago",
    featured: "Featured",
  },
};

export const Light: Story = {
  ...Default,
  globals: { theme: "light" },
};
