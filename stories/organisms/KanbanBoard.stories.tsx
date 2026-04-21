import type { Meta, StoryObj } from "@storybook/react";
import { KanbanBoard } from "@/design-system/organisms/KanbanBoard";

const meta: Meta<typeof KanbanBoard> = {
  title: "Organisms/KanbanBoard",
  component: KanbanBoard,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  args: {
    columns: [
      {
        id: "submitted",
        label: "Submitted",
        items: [
          { id: "a1", title: "Senior PM @ Andela", subtitle: "Apr 16", status: "submitted" },
          { id: "a2", title: "Backend Eng @ Paystack", subtitle: "Apr 18", status: "submitted" },
        ],
      },
      {
        id: "review",
        label: "In Review",
        items: [
          { id: "a3", title: "Designer @ M-Kopa", subtitle: "Apr 15", status: "review" },
        ],
      },
      {
        id: "interview",
        label: "Interview",
        items: [
          { id: "a4", title: "Data Eng @ Safaricom", subtitle: "Apr 14", status: "interview" },
        ],
      },
      {
        id: "offer",
        label: "Offer",
        items: [
          { id: "a5", title: "PM @ Flutterwave", subtitle: "Apr 10", status: "offer" },
        ],
      },
      {
        id: "rejected",
        label: "Rejected",
        items: [],
      },
    ],
  },
};

export const Light: Story = {
  ...Default,
  globals: { theme: "light" },
};
