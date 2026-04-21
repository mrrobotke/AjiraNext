import type { Meta, StoryObj } from "@storybook/react";
import { AuthPageTemplate } from "@/design-system/templates/AuthPageTemplate";
import { AuthForm } from "@/design-system/organisms/AuthForm";
import { AuthSidebar } from "@/design-system/organisms/AuthSidebar";

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
    sidebar: <AuthSidebar />,
    children: (
      <AuthForm
        mode="signin"
        onModeChange={(mode) => console.log("mode:", mode)}
        onSocialSignIn={(provider) => console.log("social:", provider)}
        onSubmit={(data) => console.log("submit:", data)}
      />
    ),
  },
};

export const SignUp: Story = {
  args: {
    sidebar: <AuthSidebar />,
    children: (
      <AuthForm
        mode="signup"
        role="seeker"
        onModeChange={(mode) => console.log("mode:", mode)}
        onSocialSignIn={(provider) => console.log("social:", provider)}
        onSubmit={(data) => console.log("submit:", data)}
      />
    ),
  },
};

export const ResetPassword: Story = {
  args: {
    sidebar: <AuthSidebar />,
    children: (
      <AuthForm
        mode="reset"
        onModeChange={(mode) => console.log("mode:", mode)}
        onSubmit={(data) => console.log("submit:", data)}
      />
    ),
  },
};

export const Light: Story = {
  ...SignIn,
  globals: { theme: "light" },
};
