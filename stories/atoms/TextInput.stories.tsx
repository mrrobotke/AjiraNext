import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "@/design-system/atoms/TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Atoms/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  argTypes: {
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: { placeholder: "Enter your name" },
};

export const WithValue: Story = {
  args: { defaultValue: "Amina Okafor", placeholder: "Enter your name" },
};

export const Error: Story = {
  args: { error: true, defaultValue: "invalid", placeholder: "Email" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Disabled input" },
};
