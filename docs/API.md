# API Reference

Complete API documentation for the EazyEd Builder Kit.

## Table of Contents

- [Core Components](#core-components)
- [Interfaces](#interfaces)
- [Component Configuration](#component-configuration)
- [Utility Functions](#utility-functions)
- [Event Handlers](#event-handlers)
- [CSS Classes](#css-classes)

## Core Components

### Editor

The main editing interface component built on top of Puck.

```typescript
function Editor(props: EditorProps): JSX.Element
```

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `any` | ✅ | - | Initial content data. Accepts Puck JSON, HTML strings, or plain text |
| `onPublish` | `(data: any) => void` | ✅ | - | Callback function called when user publishes content |

#### Data Format Support

The Editor component automatically detects and handles multiple data formats:

**1. Puck JSON Format**
```typescript
interface PuckData {
  content: ComponentInstance[];
  root: { props: Record<string, any> };
  zones: Record<string, ComponentInstance[]>;
}

interface ComponentInstance {
  type: string;
  props: Record<string, any>;
  readOnly?: boolean;
}
```

**2. HTML String**
```typescript
type HTMLString = string; // Detected by HTML tag presence
```

**3. Plain Text**
```typescript
type PlainText = string; // Fallback for non-HTML strings
```

#### Usage Examples

```tsx
import { Editor } from 'playground';

// Basic usage
<Editor 
  data={null}
  onPublish={(data) => console.log('Published:', data)}
/>

// With existing data
<Editor 
  data={existingPuckData}
  onPublish={handlePublish}
/>

// With HTML content
<Editor 
  data="<h1>Title</h1><p>Content</p>"
  onPublish={handlePublish}
/>
```

### Renderer

Static content rendering component without editing capabilities.

```typescript
function Renderer(props: RendererProps): JSX.Element
```

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `any` | ✅ | - | Content data to render (same formats as Editor) |

#### Usage Examples

```tsx
import { Renderer } from 'playground';

// Render Puck data
<Renderer data={puckData} />

// Render HTML string
<Renderer data="<h1>Hello World</h1>" />

// Render with empty data (shows empty state)
<Renderer data={null} />
```

### EmptyEditor

Customizable editor for advanced use cases with custom component configurations.

```typescript
function EmptyEditor(props: EmptyEditorProps): JSX.Element
```

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `any` | ✅ | - | Initial content data |
| `config` | `PuckConfig` | ✅ | - | Custom Puck configuration with components |
| `onPublish` | `(data: any) => void` | ✅ | - | Publish callback |

#### Usage Examples

```tsx
import { EmptyEditor, rawComponents } from 'playground';

const customConfig = {
  components: {
    ...rawComponents,
    CustomButton: {
      name: "CustomButton",
      config: { text: { type: "text" } },
      render: ({ text }) => <button>{text}</button>
    }
  }
};

<EmptyEditor 
  data={data}
  config={customConfig}
  onPublish={handlePublish}
/>
```

## Interfaces

### EditorProps

```typescript
interface EditorProps {
  data: any;
  onPublish: (data: any) => void;
}
```

### RendererProps

```typescript
interface RendererProps {
  data: any;
}
```

### EmptyEditorProps

```typescript
interface EmptyEditorProps extends EditorProps {
  config: PuckConfig;
}
```

### ComponentProps

Base interface for all component definitions.

```typescript
interface ComponentProps {
  name: string;
  config: ComponentConfig;
  render: (props?: any) => React.ReactElement;
}
```

### ComponentConfig

Configuration object for component fields.

```typescript
interface ComponentConfig {
  [fieldName: string]: FieldConfig;
}

type FieldConfig = 
  | TextFieldConfig
  | RadioFieldConfig
  | CustomFieldConfig;

interface TextFieldConfig {
  type: "text";
  label?: string;
  default?: string;
}

interface RadioFieldConfig {
  type: "radio";
  options: Array<{ label: string; value: any }>;
  default?: any;
}

interface CustomFieldConfig {
  type: "custom";
  render: (props: CustomFieldProps) => React.ReactElement;
}

interface CustomFieldProps {
  name: string;
  onChange: (value: any) => void;
  value: any;
}
```

## Component Configuration

### Built-in Components

#### Text Component

```typescript
const TextComponent: ComponentProps = {
  name: "Text",
  config: {
    text: { type: "text" },
    fontWeight: { 
      type: "radio", 
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Bold', value: 'bold' }
      ]
    },
    fontSize: { 
      type: "radio", 
      options: [
        { label: '16', value: 16 },
        { label: '20', value: 20 },
        { label: '24', value: 24 }
      ]
    }
  },
  render: ({ text, fontWeight, fontSize }) => (
    <p style={{ fontWeight, fontSize }}>{text}</p>
  )
};
```

#### RichText Component

```typescript
const RichTextComponent: ComponentProps = {
  name: "RichText",
  config: {
    content: {
      type: "custom",
      render: ({ onChange, value }) => (
        <RichTextEditor
          content={value}
          onChangeContent={onChange}
          extensions={[BaseKit, Heading, Bold, Italic, TextUnderline, Mathematics]}
        />
      )
    }
  },
  render: ({ content }) => (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  )
};
```

#### LaTeX Component

```typescript
const LatexComponent: ComponentProps = {
  name: "Latex",
  config: {
    formula: { type: "text" },
    display: {
      type: "radio",
      options: [
        { label: "Inline", value: "inline" },
        { label: "Block", value: "block" }
      ],
      default: "block"
    },
    fontSize: {
      type: "radio",
      options: [
        { label: "16", value: 16 },
        { label: "20", value: 20 },
        { label: "24", value: 24 }
      ],
      default: 20
    }
  },
  render: ({ formula, fontSize }) => (
    <div 
      className="markdown-latex"
      style={{ fontSize }}
      dangerouslySetInnerHTML={{ __html: md.render(formula) }}
    />
  )
};
```

#### Image Component

```typescript
const ImageComponent: ComponentProps = {
  name: "Image",
  config: {
    imageUrl: {
      type: "custom",
      render: ({ onChange, value }) => (
        <div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const objectUrl = URL.createObjectURL(file);
                onChange(objectUrl);
              }
            }}
          />
          {value && <img src={value} alt="Preview" />}
        </div>
      )
    }
  },
  render: ({ imageUrl }) => (
    <div style={{ textAlign: "center", margin: "1em 0" }}>
      {imageUrl && <img src={imageUrl} alt="Rendered" />}
    </div>
  )
};
```

#### HTML Component

```typescript
const HTMLComponent: ComponentProps = {
  name: "HTML",
  config: {
    content: {
      type: "text",
      label: "HTML Content",
      default: ""
    }
  },
  render: ({ content }) => (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  )
};
```

## Utility Functions

### compileComponent

Compiles a raw component definition into a Puck-compatible component.

```typescript
function compileComponent(component: ComponentProps): PuckComponent
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `component` | `ComponentProps` | Raw component definition |

#### Returns

| Type | Description |
|------|-------------|
| `PuckComponent` | Compiled component for use in Puck config |

#### Usage

```typescript
import { compileComponent } from 'playground/utils';

const RawMyComponent = {
  name: "MyComponent",
  config: { text: { type: "text" } },
  render: ({ text }) => <div>{text}</div>
};

const MyComponent = compileComponent(RawMyComponent);
```

### migrate

Migrates content from various formats to Puck data structure.

```typescript
function migrate(content: string, componentType: string): PuckData
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `content` | `string` | Content to migrate |
| `componentType` | `string` | Target component type ('Text', 'HTML', etc.) |

#### Returns

| Type | Description |
|------|-------------|
| `PuckData` | Puck-compatible data structure |

#### Usage

```typescript
import { migrate } from 'playground/utils';

// Migrate HTML content
const puckData = migrate('<h1>Title</h1>', 'HTML');

// Migrate plain text
const puckData = migrate('Hello World', 'Text');
```

### Data Type Detection Utilities

#### isHtmlString

```typescript
function isHtmlString(str: string): boolean
```

Detects if a string contains HTML tags.

#### isPuckObject

```typescript
function isPuckObject(data: any): boolean
```

Determines if data is already a valid Puck object.

## Event Handlers

### onPublish

Called when the user publishes content from the editor.

```typescript
type OnPublishHandler = (data: PuckData) => void;
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `data` | `PuckData` | The complete Puck data structure |

#### Usage

```typescript
const handlePublish = (data) => {
  // Validate data
  if (!data.content || data.content.length === 0) {
    console.warn('No content to publish');
    return;
  }

  // Save to backend
  fetch('/api/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => console.log('Saved:', result))
  .catch(error => console.error('Save failed:', error));
};
```

## CSS Classes

### Component Classes

| Class | Description |
|-------|-------------|
| `.markdown-latex` | Applied to LaTeX component containers |
| `.puck-editor` | Main editor container |
| `.puck-component` | Individual component wrapper |

### Custom CSS Variables

```css
:root {
  /* Editor Colors */
  --puck-color-primary: #007bff;
  --puck-color-secondary: #6c757d;
  --puck-color-success: #28a745;
  --puck-color-danger: #dc3545;
  
  /* Spacing */
  --puck-spacing-xs: 0.25rem;
  --puck-spacing-sm: 0.5rem;
  --puck-spacing-md: 1rem;
  --puck-spacing-lg: 1.5rem;
  --puck-spacing-xl: 2rem;
  
  /* Border Radius */
  --puck-border-radius: 4px;
  --puck-border-radius-lg: 8px;
  
  /* Typography */
  --puck-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --puck-font-size-sm: 0.875rem;
  --puck-font-size-md: 1rem;
  --puck-font-size-lg: 1.125rem;
}
```

## Error Handling

### Common Error Types

```typescript
// Type definitions for error handling
interface BuilderError extends Error {
  component?: string;
  field?: string;
  value?: any;
}

interface ValidationError extends BuilderError {
  type: 'validation';
  rule: string;
}

interface MigrationError extends BuilderError {
  type: 'migration';
  sourceFormat: string;
  targetFormat: string;
}
```

### Error Boundaries

```typescript
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class BuilderErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Builder Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="builder-error">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Version Compatibility

### Supported Versions

| Package | Version Range | Notes |
|---------|---------------|-------|
| React | ^18.0.0 \|\| ^19.0.0 | Peer dependency |
| React DOM | ^18.0.0 \|\| ^19.0.0 | Peer dependency |
| @measured/puck | ^0.18.3 | Core dependency |
| TypeScript | ^4.9.0+ | For TypeScript projects |

### Migration Guides

See [MIGRATION.md](./MIGRATION.md) for version-specific migration instructions.

## Performance Considerations

### Bundle Size

| Component | Gzipped Size | Notes |
|-----------|--------------|-------|
| Editor (full) | ~45KB | Includes all components |
| Renderer only | ~12KB | Minimal rendering |
| Individual components | ~2-5KB each | Tree-shakeable |

### Optimization Tips

1. **Tree Shaking**: Import only needed components
2. **Lazy Loading**: Use dynamic imports for editor
3. **Memoization**: Wrap in React.memo for performance
4. **Debouncing**: Implement for auto-save functionality

```typescript
// Optimized imports
import { Renderer } from 'playground/renderer';
import { Text, RichText } from 'playground/components';

// Lazy loading
const Editor = lazy(() => import('playground/editor'));
```