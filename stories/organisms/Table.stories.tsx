import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "@/design-system/organisms/Table";
import { Chip } from "@/design-system/atoms/Chip";

const meta: Meta<typeof Table> = {
  title: "Organisms/Table",
  component: Table,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  args: {
    columns: [
      { key: "name", header: "Name" },
      { key: "role", header: "Role" },
      { key: "status", header: "Status" },
      { key: "joined", header: "Joined" },
    ],
    data: [
      { name: "Amina Okafor", role: "Job Seeker", status: <Chip variant="green">Active</Chip>, joined: "Mar 2025" },
      { name: "David Kimani", role: "Job Seeker", status: <Chip variant="green">Active</Chip>, joined: "Apr 2025" },
      { name: "Fatima El-Amin", role: "Employer", status: <Chip variant="accent">Owner</Chip>, joined: "Jan 2025" },
      { name: "Grace Wanjiru", role: "Admin", status: <Chip variant="blue">Super</Chip>, joined: "Oct 2024" },
    ],
  },
};

export const Light: Story = {
  ...Default,
  globals: { theme: "light" },
};
