import type { Meta, StoryObj } from "@storybook/react-vite";
import { Editor } from ".";

const meta: Meta = {
  title: "Components/Editor",
  component: Editor,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description: 'Can be a Puck object, HTML string, or plain text string',
      control: 'object',
    },
    onPublish: {
      description: 'Callback function when content is published',
      action: 'published'
    }
  },
};

export default meta;
type Story = StoryObj<typeof Editor>;

export const Default: Story = {
  args: {},
};

export const WithPuckObject: Story = {
  args: {
    data: {
      content: [
        {
          type: "Text",
          props: {
            id: "Text-0a1c4806-63c9-4ee6-b6fd-29a06e6065ed",
            text: "Hello, this is a test of the editor with a Puck object",
            fontWeight: "normal",
            fontSize: 20
          }
        }
      ],
      root: {props: {}},
      zones: {}
    }
  },
};

export const WithHtmlString: Story = {
  args: {
    data: "<h1>This is an HTML heading</h1><p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>"
  },
};

export const WithPlainText: Story = {
  args: {
    data: "This is just plain text without any HTML formatting."
  },
};

export const WithComplexPuckObject: Story = {
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
