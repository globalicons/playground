import type { Meta, StoryObj } from "@storybook/react";
import { Renderer } from ".";

const meta: Meta = {
  title: "Components/Renderer",
  component: Renderer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    
  },
};

export default meta;
type Story = StoryObj<typeof Renderer>;

export const Default: Story = {
  args: {
    data: JSON.parse("{\"content\":[{\"type\":\"Text\",\"props\":{\"id\":\"Text-0a1c4806-63c9-4ee6-b6fd-29a06e6065ed\",\"text\":\"Hello, this is a test of the renderer\",\"fontWeight\":\"normal\",\"fontSize\":20}}],\"root\":{\"props\":{}},\"zones\":{}}")
  },
};
