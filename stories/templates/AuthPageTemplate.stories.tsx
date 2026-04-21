import type { Meta, StoryObj } from "@storybook/react";
import { AuthPageTemplate } from "@/design-system/templates/AuthPageTemplate";
import { FormField } from "@/design-system/molecules/FormField";
import { TextInput } from "@/design-system/atoms/TextInput";
import { Button } from "@/design-system/atoms/Button";

const meta: Meta<typeof AuthPageTemplate> = {
  title: "Templates/AuthPageTemplate",
  component: AuthPageTemplate,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AuthPageTemplate>;

export const SignIn: Story = {
  args: {
    title: "Welcome back",
    subtitle: "Sign in to your Ajira Next account",
    children: (
      <div className="flex flex-col gap-4">
        <FormField label="Email">
          <TextInput type="email" placeholder="you@example.com" />
        </FormField>
        <FormField label="Password">
          <TextInput type="password" placeholder="••••••••" />
        </FormField>
        <Button className="w-full mt-2">Sign In</Button>
      </div>
    ),
  },
};

export const SignUp: Story = {
  args: {
    title: "Create your account",
    subtitle: "Join the elite career platform for Africa",
    children: (
      <div className="flex flex-col gap-4">
        <FormField label="Full Name">
          <TextInput placeholder="Amina Okafor" />
        </FormField>
        <FormField label="Email">
          <TextInput type="email" placeholder="you@example.com" />
        </FormField>
        <FormField label="Password">
          <TextInput type="password" placeholder="••••••••" />
        </FormField>
        <Button className="w-full mt-2">Create Account</Button>
      </div>
    ),
  },
};

export const Light: Story = {
  ...SignIn,
  globals: { theme: "light" },
};
