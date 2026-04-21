import type { Meta, StoryObj } from "@storybook/react";
import { SearchBar } from "@/design-system/molecules/SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Molecules/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: { placeholder: "Search jobs..." },
};

export const InNarrowContainer: Story = {
  render: () => (
    <div className="w-80">
      <SearchBar placeholder="Search..." />
    </div>
  ),
};
