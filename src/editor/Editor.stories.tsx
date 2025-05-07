import type { Meta, StoryObj } from "@storybook/react";
import { Editor } from ".";

const meta: Meta = {
  title: "Components/Editor",
  component: Editor,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
    id: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Editor>;

export const Default: Story = {
  args: {},
};
