# EazyEd Builder Kit

A powerful, enterprise-grade WYSIWYG content builder kit for React applications. Built on top of [Puck](https://puckeditor.com/), this library provides a comprehensive set of drag-and-drop components for creating rich, interactive content experiences.

## 🚀 Features

- **Drag & Drop Interface**: Intuitive visual editor powered by Puck
- **Rich Component Library**: Text, Rich Text, LaTeX Math, Images, and HTML components
- **TypeScript Support**: Full type safety and IntelliSense support
- **Flexible Data Handling**: Supports multiple input formats (JSON, HTML strings, plain text)
- **Responsive Design**: Built-in viewport controls for mobile-first development
- **Math Support**: Complete LaTeX/KaTeX integration for mathematical expressions
- **Rich Text Editing**: Advanced text editor with formatting and mathematical notation
- **Production Ready**: Enterprise-grade performance and reliability

## 📦 Installation

```bash
npm install playground
# or
yarn add playground
# or
pnpm add playground
```

### Peer Dependencies

Ensure you have the required peer dependencies installed:

```bash
npm install react@^18.0.0 react-dom@^18.0.0
```

## 🏗️ Architecture Overview

The Builder Kit consists of three main modules:

### 1. Editor
The visual editing interface that allows users to drag, drop, and configure components.

### 2. Renderer
The rendering engine that displays the final content without editing capabilities.

### 3. Components
A collection of pre-built components that can be used in both editor and renderer modes.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Editor      │    │    Renderer     │    │   Components    │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ • Text          │
│ │ Drag & Drop │ │    │ │ Read-only   │ │    │ • RichText      │
│ │ Interface   │ │    │ │ Display     │ │    │ • LaTeX         │
│ └─────────────┘ │    │ └─────────────┘ │    │ • Image         │
│                 │    │                 │    │ • HTML          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Basic Editor Setup

```jsx
import React from 'react';
import { Editor } from 'playground';

function MyApp() {
  const handlePublish = (data) => {
    console.log('Published content:', data);
    // Save to your backend
    fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
  };

  return (
    <div style={{ height: '100vh' }}>
      <Editor 
        data={null} // Start with empty content
        onPublish={handlePublish}
      />
    </div>
  );
}
```

### Basic Renderer Setup

```jsx
import React from 'react';
import { Renderer } from 'playground';

function ContentDisplay({ contentData }) {
  return (
    <div className="content-container">
      <Renderer data={contentData} />
    </div>
  );
}
```

## 📚 API Reference

### Editor Component

The main editing interface component.

```typescript
interface EditorProps {
  data: any;                    // Content data (JSON, HTML string, or plain text)
  onPublish: (data: any) => void; // Callback when content is published
}
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `any` | ✅ | Initial content data. Accepts Puck JSON, HTML strings, or plain text |
| `onPublish` | `(data: any) => void` | ✅ | Callback function called when user publishes content |

**Example:**

```jsx
import { Editor } from 'playground';

// With existing Puck data
const puckData = {
  content: [
    {
      type: "Text",
      props: { text: "Hello World", fontSize: 20 }
    }
  ],
  root: { props: {} },
  zones: {}
};

<Editor 
  data={puckData}
  onPublish={(data) => console.log(data)}
/>

// With HTML string
<Editor 
  data="<h1>Hello World</h1><p>This is a paragraph.</p>"
  onPublish={(data) => console.log(data)}
/>

// With plain text
<Editor 
  data="Hello World"
  onPublish={(data) => console.log(data)}
/>
```

### Renderer Component

Displays content without editing capabilities.

```typescript
interface RendererProps {
  data: any; // Content data to render
}
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `any` | ✅ | Content data to render (same formats as Editor) |

**Example:**

```jsx
import { Renderer } from 'playground';

// Render Puck data
<Renderer data={puckData} />

// Render HTML string
<Renderer data="<h1>Hello World</h1>" />

// Render plain text
<Renderer data="Hello World" />
```

### EmptyEditor Component

A customizable editor with your own component configuration.

```typescript
interface EmptyEditorProps extends EditorProps {
  config: any; // Custom Puck configuration
}
```

## 🧩 Components Reference

### Text Component

Simple text component with basic styling options.

**Props:**
- `text` (string): The text content
- `fontWeight` (string): Font weight ("normal" | "bold")
- `fontSize` (number): Font size (16 | 20 | 24)

**Example:**
```jsx
// In Puck data structure
{
  type: "Text",
  props: {
    text: "Hello World",
    fontWeight: "bold",
    fontSize: 24
  }
}
```

### RichText Component

Advanced rich text editor with formatting and math support.

**Features:**
- Bold, italic, underline formatting
- Headings (H1-H6)
- Mathematical expressions via KaTeX
- Extensible via Tiptap extensions

**Props:**
- `content` (string): HTML content from the rich text editor

**Example:**
```jsx
{
  type: "RichText",
  props: {
    content: "<h2>Welcome</h2><p>This is <strong>bold</strong> text with <em>math</em>: $E = mc^2$</p>"
  }
}
```

### LaTeX Component

Dedicated mathematical expression component using KaTeX.

**Props:**
- `formula` (string): LaTeX formula
- `display` (string): Display mode ("inline" | "block")
- `fontSize` (number): Font size (16 | 20 | 24)

**Example:**
```jsx
{
  type: "Latex",
  props: {
    formula: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}",
    display: "block",
    fontSize: 20
  }
}
```

### Image Component

Image upload and display component.

**Props:**
- `imageUrl` (string): Image URL (can be object URL from file upload)

**Features:**
- File upload with preview
- Automatic object URL generation
- Responsive image display

**Example:**
```jsx
{
  type: "Image",
  props: {
    imageUrl: "https://example.com/image.jpg"
  }
}
```

### HTML Component

Raw HTML content component for maximum flexibility.

**Props:**
- `content` (string): Raw HTML content

**Example:**
```jsx
{
  type: "HTML",
  props: {
    content: "<div class='custom-widget'><h3>Custom Content</h3><p>Any HTML here</p></div>"
  }
}
```

## 🔧 Integration Examples

### React Application Integration

```jsx
import React, { useState, useEffect } from 'react';
import { Editor, Renderer } from 'playground';

function ContentManagementSystem() {
  const [content, setContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load content from API
  useEffect(() => {
    fetch('/api/content/123')
      .then(res => res.json())
      .then(data => setContent(data));
  }, []);

  const handleSave = async (data) => {
    try {
      await fetch('/api/content/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setContent(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <div className="cms-container">
      <div className="toolbar">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="edit-toggle"
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </div>
      
      {isEditing ? (
        <Editor data={content} onPublish={handleSave} />
      ) : (
        <Renderer data={content} />
      )}
    </div>
  );
}
```

### Next.js Integration

```jsx
// pages/editor/[id].js
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues
const Editor = dynamic(() => import('playground').then(mod => mod.Editor), {
  ssr: false
});

export default function EditorPage({ id }) {
  const [content, setContent] = useState(null);

  const handlePublish = async (data) => {
    const response = await fetch(`/api/content/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      router.push(`/preview/${id}`);
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <Editor data={content} onPublish={handlePublish} />
    </div>
  );
}

// pages/preview/[id].js
import { Renderer } from 'playground';

export default function PreviewPage({ content }) {
  return (
    <div className="preview-container">
      <Renderer data={content} />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.API_URL}/content/${params.id}`);
  const content = await res.json();
  
  return { props: { content } };
}
```

### Custom Component Integration

```jsx
import { EmptyEditor } from 'playground';
import { rawComponents } from 'playground';

// Create custom component
const CustomButton = {
  name: "CustomButton",
  config: {
    text: { type: "text", default: "Click me" },
    variant: { 
      type: "radio", 
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" }
      ]
    }
  },
  render: ({ text, variant }) => (
    <button className={`btn btn-${variant}`}>
      {text}
    </button>
  )
};

// Custom configuration with built-in and custom components
const customConfig = {
  components: {
    ...rawComponents,
    CustomButton
  }
};

function CustomEditor({ data, onPublish }) {
  return (
    <EmptyEditor 
      data={data}
      config={customConfig}
      onPublish={onPublish}
    />
  );
}
```

## 🔄 Data Migration & Formats

The Builder Kit automatically handles different input formats:

### 1. Puck JSON Format (Native)

```javascript
const puckData = {
  content: [
    {
      type: "Text",
      props: { text: "Hello", fontSize: 20 }
    },
    {
      type: "RichText",
      props: { content: "<p>Rich <strong>content</strong></p>" }
    }
  ],
  root: { props: {} },
  zones: {}
};
```

### 2. HTML String Migration

```javascript
// HTML string is automatically converted to HTML component
const htmlString = `
  <h1>Welcome</h1>
  <p>This is a paragraph with <strong>bold</strong> text.</p>
  <img src="image.jpg" alt="Example" />
`;

// Automatically becomes:
{
  content: [{
    type: "HTML",
    props: { content: htmlString }
  }],
  root: { props: {} },
  zones: {}
}
```

### 3. Plain Text Migration

```javascript
// Plain text is automatically converted to Text component
const plainText = "Hello, this is plain text";

// Automatically becomes:
{
  content: [{
    type: "Text",
    props: { text: plainText }
  }],
  root: { props: {} },
  zones: {}
}
```

## 🎨 Styling and Customization

### CSS Variables

The components use CSS variables for easy theming:

```css
:root {
  --builder-primary-color: #007bff;
  --builder-secondary-color: #6c757d;
  --builder-border-radius: 4px;
  --builder-spacing: 1rem;
}
```

### Custom Styles

```css
/* Override component styles */
.markdown-latex {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: var(--builder-border-radius);
}

/* Customize editor interface */
.puck-editor {
  --puck-color-primary: #007bff;
  --puck-color-secondary: #6c757d;
}
```

## 🧪 Development & Testing

### Development Setup

```bash
# Install dependencies
npm install

# Start Storybook for component development
npm run storybook

# Build the library
npm run build

# Run tests
npm test
```

### Storybook Integration

View component documentation and examples:

```bash
npm run storybook
```

Access at `http://localhost:6006`

### Testing Components

```jsx
import { render, screen } from '@testing-library/react';
import { Renderer } from 'playground';

test('renders text component', () => {
  const data = {
    content: [{
      type: "Text",
      props: { text: "Hello World" }
    }],
    root: { props: {} },
    zones: {}
  };

  render(<Renderer data={data} />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});
```

## 🚀 Production Deployment

### Bundle Size Optimization

The library is built with tree-shaking support. Import only what you need:

```jsx
// Import only specific components
import { Editor } from 'playground/editor';
import { Renderer } from 'playground/renderer';

// Or import everything (not recommended for production)
import { Editor, Renderer } from 'playground';
```

### Performance Considerations

1. **Lazy Loading**: Use dynamic imports for better performance
2. **Memoization**: Wrap components in `React.memo` for frequent re-renders
3. **Debouncing**: Implement debounced save for auto-save functionality

```jsx
import { useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

function OptimizedEditor({ data, onSave }) {
  const debouncedSave = useCallback(
    debounce((data) => onSave(data), 1000),
    [onSave]
  );

  const memoizedData = useMemo(() => data, [data]);

  return (
    <Editor 
      data={memoizedData}
      onPublish={debouncedSave}
    />
  );
}
```

## 🔒 Security Considerations

### HTML Sanitization

When using HTML components or rich text, consider sanitizing content:

```jsx
import DOMPurify from 'dompurify';

// Sanitize HTML content before rendering
const sanitizedContent = DOMPurify.sanitize(htmlContent);
```

### Content Security Policy

Configure CSP headers for math rendering:

```
Content-Security-Policy: script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
```

## 📋 Troubleshooting

### Common Issues

**Issue: Math formulas not rendering**
```jsx
// Ensure KaTeX CSS is imported
import 'katex/dist/katex.min.css';
```

**Issue: Storybook not loading**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: TypeScript errors**
```bash
# Ensure peer dependencies are installed
npm install react@^18.0.0 react-dom@^18.0.0 @types/react@^18.0.0
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run the test suite: `npm test`
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support

- **Documentation**: [Link to full docs]
- **Issues**: [GitHub Issues](https://github.com/your-org/playground/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/playground/discussions)
- **Email**: support@eazyed.org

## 🗺️ Roadmap

- [ ] Additional component types (Video, Audio, Charts)
- [ ] Advanced theming system
- [ ] Plugin architecture for third-party components
- [ ] Collaborative editing support
- [ ] Advanced accessibility features
- [ ] Mobile-first component library

---

Built with ❤️ by the EazyEd team