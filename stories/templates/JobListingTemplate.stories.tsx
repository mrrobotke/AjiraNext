import type { Meta, StoryObj } from "@storybook/react";
import { JobListingTemplate } from "@/design-system/templates/JobListingTemplate";

const meta: Meta<typeof JobListingTemplate> = {
  title: "Templates/JobListingTemplate",
  component: JobListingTemplate,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof JobListingTemplate>;

const mockJobs = [
  {
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
    featured: "Featured" as const,
    matchScore: 88,
  },
  {
    id: "j2",
    title: "Staff Fintech Engineer",
    companyName: "Paystack",
    companyLogo: "P",
    companyColor: "#00c3f7",
    location: "Lagos · Hybrid",
    type: "Full-time",
    level: "Staff",
    salary: "NGN 12M–16M",
    posted: "1d",
    featured: "New" as const,
    matchScore: 92,
  },
  {
    id: "j3",
    title: "Principal Designer",
    companyName: "M-Kopa",
    companyLogo: "M",
    companyColor: "#0a9a6a",
    location: "Nairobi",
    type: "Full-time",
    level: "Principal",
    salary: "KES 400k–520k",
    posted: "6h",
    featured: "Urgent" as const,
    matchScore: 75,
  },
];

export const Default: Story = {
  args: { jobs: mockJobs },
};
