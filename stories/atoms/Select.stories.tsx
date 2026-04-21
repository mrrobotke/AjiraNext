import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "@/design-system/atoms/Select";

const meta: Meta<typeof Select> = {
  title: "Atoms/Select",
  component: Select,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <option>Option A</option>
      <option>Option B</option>
      <option>Option C</option>
    </Select>
  ),
};

export const Error: Story = {
  render: () => (
    <Select error>
      <option>Invalid</option>
    </Select>
  ),
};
