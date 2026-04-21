import type { Meta, StoryObj } from "@storybook/react";
import { SkeletonLine } from "@/design-system/atoms/SkeletonLine";

const meta: Meta<typeof SkeletonLine> = {
  title: "Atoms/SkeletonLine",
  component: SkeletonLine,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SkeletonLine>;

export const Default: Story = {};
export const CustomSize: Story = {
  args: { width: "200px", height: "40px", rounded: "lg" },
};
export const CardSkeleton: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <SkeletonLine width="100%" height="120px" rounded="lg" />
      <SkeletonLine width="70%" height="20px" />
      <SkeletonLine width="50%" height="16px" />
    </div>
  ),
};
