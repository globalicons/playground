# BuilderKit

A powerful library for building drag and drop website experiences.

## Installation

```bash
npm install playground
# or
yarn add playground
```

## Features

- Drag and drop components
- Easy-to-use API for building website editors
- Fully customizable UI components
- TypeScript support
- Storybook documentation

## Usage

```jsx
import { Editor } from 'playground';

function MyEditor() {
  const handleDrop = (event) => {
    console.log('Item dropped!', event);
    // Handle the drop event
  };

  return (
    <div className="editor">
      <DragContainer 
        droppable={true} 
        onDrop={handleDrop}
        className="drop-zone"
      >
        <p>Drag components here</p>
      </DragContainer>
      
      <div className="components-panel">
        <DragContainer draggable={true} id="button-component">
          Button Component
        </DragContainer>
        
        <DragContainer draggable={true} id="text-component">
          Text Component
        </DragContainer>
      </div>
    </div>
  );
}
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run Storybook
npm run storybook
```

### Building

```bash
# Build the library
npm run build

# Build Storybook documentation
npm run build-storybook
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## License

ISC