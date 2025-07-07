import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyEditor } from ".";

const meta: Meta = {
  title: "Components/EmptyEditor",
  component: EmptyEditor,
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
type Story = StoryObj<typeof EmptyEditor>;

export const Default: Story = {
  args: {},
};
