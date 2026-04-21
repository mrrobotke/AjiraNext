import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "@/design-system/molecules/FormField";
import { TextInput } from "@/design-system/atoms/TextInput";

const meta: Meta<typeof FormField> = {
  title: "Molecules/FormField",
  component: FormField,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: () => (
    <FormField label="Email" hint="We will never share your email.">
      <TextInput placeholder="you@example.com" />
    </FormField>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormField label="Email" error="Please enter a valid email address.">
      <TextInput defaultValue="invalid" error />
    </FormField>
  ),
};
