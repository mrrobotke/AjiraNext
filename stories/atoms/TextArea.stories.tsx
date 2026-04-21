import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "@/design-system/atoms/TextArea";

const meta: Meta<typeof TextArea> = {
  title: "Atoms/TextArea",
  component: TextArea,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: { placeholder: "Write a cover letter..." },
};

export const WithValue: Story = {
  args: { defaultValue: "I am excited to apply for this role because..." },
};

export const Error: Story = {
  args: { error: true, defaultValue: "Too short" },
};
