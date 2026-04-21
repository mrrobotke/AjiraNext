import type { Meta, StoryObj } from "@storybook/react";
import { JobCard } from "@/design-system/organisms/JobCard";

const meta: Meta<typeof JobCard> = {
  title: "Organisms/JobCard",
  component: JobCard,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof JobCard>;

const baseJob = {
  id: "j1",
  title: "Senior Product Strategist",
  companyName: "Andela",
  companyLogo: "A",
  companyColor: "#3c78d8",
  location: "Nairobi",
  type: "Full-time",
  level: "Senior",
  salary: "KES 320k–450k",
  posted: "2d",
  matchScore: 88,
};

export const Default: Story = {
  args: { job: baseJob },
};

export const Featured: Story = {
  args: {
    job: { ...baseJob, featured: "Featured" as const },
  },
};

export const New: Story = {
  args: {
    job: { ...baseJob, featured: "New" as const },
  },
};

export const Urgent: Story = {
  args: {
    job: { ...baseJob, featured: "Urgent" as const },
  },
};
