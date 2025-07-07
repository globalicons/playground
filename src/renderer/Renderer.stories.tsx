import type { Meta, StoryObj } from "@storybook/react-vite";
import { Renderer } from ".";

const meta: Meta = {
  title: "Components/Renderer",
  component: Renderer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description: 'Can be a Puck object, HTML string, or plain text string',
      control: 'object',
    }
  },
};

export default meta;
type Story = StoryObj<typeof Renderer>;

export const Default: Story = {
  args: {
    data: JSON.parse("{\"content\":[{\"type\":\"Text\",\"props\":{\"id\":\"Text-0a1c4806-63c9-4ee6-b6fd-29a06e6065ed\",\"text\":\"Hello, this is a test of the renderer\",\"fontWeight\":\"normal\",\"fontSize\":20}}],\"root\":{\"props\":{}},\"zones\":{}}")
  },
};

export const HtmlString: Story = {
  args: {
    data: "<h1>This is an HTML heading</h1><p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>"
  },
};

export const PlainText: Story = {
  args: {
    data: "This is just plain text without any HTML formatting."
  },
};

export const ComplexPuckObject: Story = {
  args: {
    data: {
      content: [
        {
          type: "RichText",
          props: {
            id: "RichText-1234",
            content: "<h2>Rich Text Component</h2><p>This is content inside a RichText component.</p>"
          }
        },
        {
          type: "Text",
          props: {
            id: "Text-5678",
            text: "Regular Text Component",
            fontWeight: "bold",
            fontSize: 24
          }
        }
      ],
      root: { props: {} },
      zones: {}
    }
  },
};
