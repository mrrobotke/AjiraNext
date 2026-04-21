import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "@/design-system/atoms/Heading";

const meta: Meta<typeof Heading> = {
  title: "Atoms/Heading",
  component: Heading,
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["h1", "h2", "h3", "h4", "h5", "h6"] },
    size: { control: "select", options: ["7xl", "5xl", "4xl", "3xl", "2xl", "xl", "lg"] },
    weight: { control: "select", options: ["bold", "extrabold", "black"] },
  },
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = { args: { as: "h1", size: "7xl", children: "Display Heading" } };
export const H2: Story = { args: { as: "h2", size: "3xl", children: "Section Heading" } };
export const H3: Story = { args: { as: "h3", size: "2xl", children: "Card Heading" } };
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading size="7xl">7xl — Display</Heading>
      <Heading size="5xl">5xl — Hero</Heading>
      <Heading size="4xl">4xl — Major</Heading>
      <Heading size="3xl">3xl — Section</Heading>
      <Heading size="2xl">2xl — Subsection</Heading>
      <Heading size="xl">xl — Card Title</Heading>
      <Heading size="lg">lg — Small Title</Heading>
    </div>
  ),
};
