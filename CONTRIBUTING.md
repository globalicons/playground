# Contributing to EazyEd Builder Kit

We welcome contributions to the EazyEd Builder Kit! This guide will help you get started with contributing to our project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Component Development](#component-development)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [support@eazyed.org](mailto:support@eazyed.org).

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Git

### Development Environment

1. **Fork the repository**
   ```bash
   gh repo fork eazyed-org/playground
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/playground.git
   cd playground
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development**
   ```bash
   npm run storybook
   ```

## Development Setup

### Local Development

```bash
# Install dependencies
npm install

# Start Storybook for component development
npm run storybook

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the library
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

### Environment Variables

Create a `.env.local` file for local development:

```bash
# .env.local
STORYBOOK_PORT=6006
NODE_ENV=development
```

## Project Structure

```
playground/
├── src/
│   ├── components/          # Core components
│   │   ├── Text/           # Text component
│   │   ├── RichText/       # Rich text component
│   │   ├── Latex/          # LaTeX component
│   │   ├── Image/          # Image component
│   │   └── Html/           # HTML component
│   ├── editor/             # Editor implementation
│   ├── renderer/           # Renderer implementation
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── style.css           # Global styles
├── docs/                   # Documentation
├── .storybook/             # Storybook configuration
├── tests/                  # Test files
└── examples/               # Example implementations
```

### Key Files

- `src/index.ts` - Main export file
- `src/components/index.tsx` - Component exports
- `package.json` - Package configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.cjs` - ESLint configuration

## Coding Standards

### TypeScript

We use TypeScript for type safety. All new code should be written in TypeScript.

**Interface Naming**
```typescript
// ✅ Good
interface EditorProps {
  data: any;
  onPublish: (data: any) => void;
}

// ❌ Bad
interface editorProps {
  data: any;
  onPublish: (data: any) => void;
}
```

**Component Props**
```typescript
// ✅ Good - Explicit prop types
interface TextComponentProps {
  text: string;
  fontWeight?: 'normal' | 'bold';
  fontSize?: number;
}

// ❌ Bad - Any types
interface TextComponentProps {
  text: any;
  fontWeight?: any;
  fontSize?: any;
}
```

### React Components

**Functional Components**
```typescript
// ✅ Good
const TextComponent: React.FC<TextComponentProps> = ({ text, fontWeight, fontSize }) => {
  return <p style={{ fontWeight, fontSize }}>{text}</p>;
};

// ❌ Bad
function TextComponent(props: any) {
  return <p>{props.text}</p>;
}
```

**Component Structure**
```typescript
// Component template
const ComponentName: React.FC<ComponentNameProps> = (props) => {
  // 1. Destructure props
  const { prop1, prop2, prop3 } = props;
  
  // 2. State and hooks
  const [state, setState] = useState(initialValue);
  
  // 3. Event handlers
  const handleEvent = useCallback(() => {
    // handler logic
  }, [dependencies]);
  
  // 4. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);
  
  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### CSS and Styling

**CSS Classes**
```css
/* ✅ Good - BEM naming */
.component-name {}
.component-name__element {}
.component-name--modifier {}

/* ❌ Bad - Generic names */
.button {}
.text {}
.container {}
```

**CSS Variables**
```css
/* ✅ Good - Use CSS variables for theming */
.component {
  color: var(--color-text);
  font-size: var(--font-size-base);
}

/* ❌ Bad - Hardcoded values */
.component {
  color: #333;
  font-size: 16px;
}
```

### ESLint Rules

We follow these key ESLint rules:

```javascript
// .eslintrc.cjs
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // Enforce prop types
    'react/prop-types': 'error',
    
    // Prevent unused variables
    '@typescript-eslint/no-unused-vars': 'error',
    
    // Enforce consistent naming
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase']
      }
    ]
  }
};
```

## Testing

### Test Structure

```typescript
// ✅ Good test structure
describe('TextComponent', () => {
  it('should render text correctly', () => {
    const props = { text: 'Hello World' };
    render(<TextComponent {...props} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should apply font weight', () => {
    const props = { text: 'Bold Text', fontWeight: 'bold' };
    render(<TextComponent {...props} />);
    const element = screen.getByText('Bold Text');
    expect(element).toHaveStyle('font-weight: bold');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test TextComponent.test.tsx
```

### Test Categories

1. **Unit Tests** - Test individual components
2. **Integration Tests** - Test component interactions
3. **E2E Tests** - Test full user workflows
4. **Visual Tests** - Test component appearance (Storybook)

### Writing Tests

**Component Testing**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Editor } from '../Editor';

describe('Editor', () => {
  const mockOnPublish = jest.fn();

  beforeEach(() => {
    mockOnPublish.mockClear();
  });

  it('should call onPublish when content is published', () => {
    const testData = { content: [] };
    render(<Editor data={testData} onPublish={mockOnPublish} />);
    
    // Simulate publish action
    fireEvent.click(screen.getByRole('button', { name: /publish/i }));
    
    expect(mockOnPublish).toHaveBeenCalledWith(testData);
  });
});
```

## Submitting Changes

### Branch Naming

```bash
# ✅ Good branch names
feature/add-video-component
fix/latex-rendering-issue
docs/update-api-reference
chore/upgrade-dependencies

# ❌ Bad branch names
new-feature
fix
update
```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# ✅ Good commit messages
feat: add video component with playback controls
fix: resolve LaTeX formula rendering issue
docs: update component API documentation
chore: upgrade React to v18.2.0

# ❌ Bad commit messages
add new feature
fix bug
update docs
```

### Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our standards
   - Add tests for new functionality
   - Update documentation

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use our PR template
   - Provide clear description
   - Link related issues
   - Add screenshots if applicable

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Manual testing completed

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings or errors
```

## Component Development

### Creating a New Component

1. **Create component directory**
   ```bash
   mkdir src/components/NewComponent
   ```

2. **Component structure**
   ```
   NewComponent/
   ├── index.tsx           # Main component
   ├── NewComponent.test.tsx # Tests
   ├── NewComponent.stories.tsx # Storybook stories
   └── README.md           # Component documentation
   ```

3. **Component template**
   ```typescript
   // src/components/NewComponent/index.tsx
   import React from 'react';

   const name = "NewComponent";

   interface NewComponentProps {
     // Define your props here
   }

   const config = {
     // Component configuration for Puck
   };

   const render: React.FC<NewComponentProps> = (props) => {
     // Component implementation
     return <div>New Component</div>;
   };

   export default {
     name,
     config,
     render
   } as ComponentProps;
   ```

4. **Add to component index**
   ```typescript
   // src/components/index.tsx
   import RawNewComponent from "./NewComponent";
   
   export const NewComponent = compileComponent(RawNewComponent);
   
   export const rawComponents = {
     // ... existing components
     NewComponent: RawNewComponent
   };
   
   export default {
     // ... existing components
     ...NewComponent
   };
   ```

### Component Guidelines

**Props Interface**
```typescript
interface ComponentProps {
  // Required props first
  content: string;
  
  // Optional props with defaults
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  
  // Event handlers
  onChange?: (value: string) => void;
}
```

**Configuration Object**
```typescript
const config = {
  // Text input
  content: { 
    type: "text", 
    label: "Content",
    default: "" 
  },
  
  // Radio buttons
  fontSize: {
    type: "radio",
    options: [
      { label: "Small", value: 14 },
      { label: "Medium", value: 16 },
      { label: "Large", value: 20 }
    ],
    default: 16
  },
  
  // Custom field
  customField: {
    type: "custom",
    render: ({ onChange, value }) => (
      <CustomInput value={value} onChange={onChange} />
    )
  }
};
```

## Documentation

### Storybook Stories

```typescript
// Component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './index';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: 'Description of the component'
      }
    }
  },
  argTypes: {
    prop1: {
      control: 'text',
      description: 'Description of prop1'
    }
  }
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    prop1: 'default value'
  }
};

export const Variant: Story = {
  args: {
    prop1: 'variant value'
  }
};
```

### Component README

```markdown
# ComponentName

Brief description of the component.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `prop1` | `string` | ✅ | - | Description of prop1 |
| `prop2` | `number` | ❌ | `16` | Description of prop2 |

## Usage

```jsx
import { ComponentName } from 'playground';

<ComponentName 
  prop1="value"
  prop2={20}
/>
```

## Examples

### Basic Usage
[Example code]

### Advanced Usage
[Example code]
```

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Release Steps

1. **Update version**
   ```bash
   npm version patch|minor|major
   ```

2. **Update changelog**
   ```bash
   # Update CHANGELOG.md with new features and fixes
   ```

3. **Create release PR**
   ```bash
   git checkout -b release/v1.2.3
   git push origin release/v1.2.3
   ```

4. **Merge and tag**
   ```bash
   # After PR is merged
   git tag v1.2.3
   git push origin v1.2.3
   ```

5. **Publish**
   ```bash
   npm publish
   ```

## Getting Help

- **Discord**: [Join our Discord](https://discord.gg/eazyed)
- **GitHub Issues**: [Create an issue](https://github.com/eazyed-org/playground/issues)
- **Email**: [support@eazyed.org](mailto:support@eazyed.org)
- **Documentation**: [docs.eazyed.org](https://docs.eazyed.org)

## Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project README
- Annual contributor highlights

Thank you for contributing to EazyEd Builder Kit! 🎉