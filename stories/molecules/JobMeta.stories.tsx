import type { Meta, StoryObj } from "@storybook/react";
import { JobMeta } from "@/design-system/molecules/JobMeta";

const meta: Meta<typeof JobMeta> = {
  title: "Molecules/JobMeta",
  component: JobMeta,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof JobMeta>;

export const Default: Story = {
  args: {
    items: [
      { icon: "MapPin", text: "Nairobi" },
      { icon: "Briefcase", text: "Full-time" },
      { icon: "BarChart", text: "Senior" },
    ],
  },
};

export const Single: Story = {
  args: {
    items: [{ icon: "DollarSign", text: "KES 320k–450k" }],
  },
};
