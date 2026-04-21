import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "@/design-system/atoms/SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Atoms/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: { placeholder: "Search jobs, companies..." },
};

export const WithValue: Story = {
  args: { defaultValue: "Product Manager", placeholder: "Search..." },
};

export const InContainer: Story = {
  render: () => (
    <div className="w-80">
      <SearchInput placeholder="Search..." />
    </div>
  ),
};
