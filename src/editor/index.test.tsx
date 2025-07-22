import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Editor, EmptyEditor } from './index';
import type { PuckData, EditorProps, EmptyEditorProps, CompiledComponent } from '../types';

// Mock the Puck component since we're testing our wrapper logic
jest.mock('@measured/puck', () => ({
  Puck: jest.fn(({ data, config, onPublish, viewports }) => (
    <div data-testid="mock-puck">
      <div data-testid="puck-data">{JSON.stringify(data)}</div>
      <div data-testid="puck-config">{JSON.stringify(config)}</div>
      <div data-testid="puck-viewports">{JSON.stringify(viewports)}</div>
      <button 
        data-testid="publish-button" 
        onClick={() => onPublish && onPublish(data)}
      >
        Publish
      </button>
    </div>
  ))
}));

// Mock the migrate utility
jest.mock('../utils/migrate', () => ({
  migrate: jest.fn((content: string, type: string) => {
    if (type === 'Text') {
      return {
        content: [{
          type: 'Text',
          props: { id: 'text-mock-id', text: content }
        }],
        root: { props: {} },
        zones: {}
      };
    }
    if (type === 'Html') {
      return {
        content: [{
          type: 'Html',
          props: { id: 'html-mock-id', content }
        }],
        root: { props: {} },
        zones: {}
      };
    }
    return content;
  }),
  isPuckData: jest.fn((value: unknown) => {
    return (
      typeof value === 'object' &&
      value !== null &&
      'content' in value &&
      'root' in value &&
      'zones' in value &&
      Array.isArray((value as any).content)
    );
  })
}));

// Mock components
jest.mock('../components', () => ({
  __esModule: true,
  default: {
    Text: { fields: { text: { type: 'text' } }, render: () => React.createElement('div') },
    Html: { fields: { content: { type: 'text' } }, render: () => React.createElement('div') }
  }
}));

// Mock CSS import
jest.mock('@measured/puck/puck.css', () => ({}));

describe('Editor', () => {
  const mockOnPublish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Data processing', () => {
    it('should render with default empty data when no data provided', () => {
      // Arrange
      const props: EditorProps = {
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      expect(screen.getByTestId('mock-puck')).toBeInTheDocument();
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData).toEqual({
        content: [],
        root: { props: {} },
        zones: {}
      });
    });

    it('should process valid PuckData directly', () => {
      // Arrange
      const validPuckData: PuckData = {
        content: [
          {
            type: 'Text',
            props: { id: 'text-1', text: 'Hello World' }
          }
        ],
        root: { props: { title: 'Test Page' } },
        zones: { main: ['text-1'] }
      };
      
      const props: EditorProps = {
        data: validPuckData,
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData).toEqual(validPuckData);
    });

    it('should migrate plain text to Text component', () => {
      // Arrange
      const plainText = 'Hello World';
      const props: EditorProps = {
        data: plainText,
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData.content[0]).toEqual({
        type: 'Text',
        props: { id: 'text-mock-id', text: 'Hello World' }
      });
    });

    it('should migrate HTML content to HTML component', () => {
      // Arrange
      const htmlContent = '<p>Hello <strong>World</strong></p>';
      const props: EditorProps = {
        data: htmlContent,
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData.content[0]).toEqual({
        type: 'Html',
        props: { id: 'html-mock-id', content: htmlContent }
      });
    });

    it('should handle null data gracefully', () => {
      // Arrange
      const props: EditorProps = {
        data: null,
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData).toEqual({
        content: [],
        root: { props: {} },
        zones: {}
      });
    });

    it('should handle unexpected data types with console warning', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const unexpectedData = { unexpected: 'data' };
      const props: EditorProps = {
        data: unexpectedData as any,
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        'Unexpected data type provided to editor:',
        'object'
      );
      
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData).toEqual({
        content: [],
        root: { props: {} },
        zones: {}
      });

      consoleSpy.mockRestore();
    });
  });

  describe('HTML detection', () => {
    it('should detect valid HTML tags', () => {
      // Arrange
      const htmlString = '<p>This is HTML</p>';
      const props: EditorProps = {
        data: htmlString,
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData.content[0].type).toBe('Html');
    });

    it('should not detect false positives as HTML', () => {
      // Arrange
      const notHtmlString = 'This < is not > HTML';
      const props: EditorProps = {
        data: notHtmlString,
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData.content[0].type).toBe('Text');
    });

    it('should detect complex HTML structures', () => {
      // Arrange
      const complexHtml = '<div class="container"><h1>Title</h1><p>Content</p></div>';
      const props: EditorProps = {
        data: complexHtml,
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData.content[0].type).toBe('Html');
    });
  });

  describe('onPublish callback handling', () => {
    it('should use provided onPublish callback', () => {
      // Arrange
      const customOnPublish = jest.fn();
      const props: EditorProps = {
        data: 'Test content',
        onPublish: customOnPublish
      };

      // Act
      render(<Editor {...props} />);
      
      // Simulate publish button click
      const publishButton = screen.getByTestId('publish-button');
      publishButton.click();

      // Assert
      expect(customOnPublish).toHaveBeenCalledTimes(1);
      expect(mockOnPublish).not.toHaveBeenCalled();
    });

    it('should use default onPublish when none provided', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const props: EditorProps = {
        data: 'Test content'
      };

      // Act
      render(<Editor {...props} />);
      
      // Simulate publish button click
      const publishButton = screen.getByTestId('publish-button');
      publishButton.click();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        'onPublish',
        expect.stringContaining('"content"')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Configuration and props', () => {
    it('should pass correct configuration to Puck', () => {
      // Arrange
      const props: EditorProps = {
        data: 'Test content',
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      const puckConfig = JSON.parse(screen.getByTestId('puck-config').textContent || '{}');
      expect(puckConfig).toHaveProperty('components');
    });

    it('should pass default viewports to Puck', () => {
      // Arrange
      const props: EditorProps = {
        data: 'Test content',
        onPublish: mockOnPublish
      };

      // Act
      render(<Editor {...props} />);

      // Assert
      const puckViewports = JSON.parse(screen.getByTestId('puck-viewports').textContent || '[]');
      expect(puckViewports).toHaveLength(1);
      expect(puckViewports[0]).toEqual({
        width: 390,
        height: 844,
        icon: 'Smartphone',
        label: 'Small'
      });
    });
  });

  describe('Memoization and performance', () => {
    it('should memoize processed data when data does not change', () => {
      // Arrange
      const { rerender } = render(
        <Editor data="Test content" onPublish={mockOnPublish} />
      );

      const initialData = screen.getByTestId('puck-data').textContent;

      // Act - rerender with same data
      rerender(<Editor data="Test content" onPublish={mockOnPublish} />);

      // Assert - data should be the same (memoized)
      expect(screen.getByTestId('puck-data').textContent).toBe(initialData);
    });

    it('should reprocess data when it changes', () => {
      // Arrange
      const { rerender } = render(
        <Editor data="Initial content" onPublish={mockOnPublish} />
      );

      const initialData = screen.getByTestId('puck-data').textContent;

      // Act - rerender with different data
      rerender(<Editor data="Changed content" onPublish={mockOnPublish} />);

      // Assert - data should be different
      const newData = screen.getByTestId('puck-data').textContent;
      expect(newData).not.toBe(initialData);
      expect(newData).toContain('Changed content');
    });
  });
});

describe('EmptyEditor', () => {
  const mockCustomConfig: CompiledComponent = {
    CustomComponent: {
      fields: { text: { type: 'text' } },
      render: () => React.createElement('div')
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should render with provided custom config', () => {
      // Arrange
      const props: EmptyEditorProps = {
        config: mockCustomConfig
      };

      // Act
      render(<EmptyEditor {...props} />);

      // Assert
      expect(screen.getByTestId('mock-puck')).toBeInTheDocument();
      const puckConfig = JSON.parse(screen.getByTestId('puck-config').textContent || '{}');
      // Only check the fields part since render functions don't serialize
      expect(puckConfig.components.CustomComponent.fields).toEqual(mockCustomConfig.CustomComponent.fields);
    });

    it('should use default empty data when no data provided', () => {
      // Arrange
      const props: EmptyEditorProps = {
        config: mockCustomConfig
      };

      // Act
      render(<EmptyEditor {...props} />);

      // Assert
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData).toEqual({
        content: [],
        root: { props: {} },
        zones: {}
      });
    });

    it('should use provided data when given', () => {
      // Arrange
      const customData: PuckData = {
        content: [
          {
            type: 'CustomComponent',
            props: { id: 'custom-1', text: 'Custom content' }
          }
        ],
        root: { props: { title: 'Custom Page' } },
        zones: { main: ['custom-1'] }
      };

      const props: EmptyEditorProps = {
        data: customData,
        config: mockCustomConfig
      };

      // Act
      render(<EmptyEditor {...props} />);

      // Assert
      const puckData = JSON.parse(screen.getByTestId('puck-data').textContent || '{}');
      expect(puckData).toEqual(customData);
    });

    it('should handle onPublish callback when provided', () => {
      // Arrange
      const mockOnPublish = jest.fn();
      const props: EmptyEditorProps = {
        config: mockCustomConfig,
        onPublish: mockOnPublish
      };

      // Act
      render(<EmptyEditor {...props} />);
      
      // Simulate publish button click
      const publishButton = screen.getByTestId('publish-button');
      publishButton.click();

      // Assert
      expect(mockOnPublish).toHaveBeenCalledTimes(1);
    });

    it('should not pass viewports to Puck (EmptyEditor specific)', () => {
      // Arrange
      const props: EmptyEditorProps = {
        config: mockCustomConfig
      };

      // Act
      render(<EmptyEditor {...props} />);

      // Assert
      const puckViewports = screen.getByTestId('puck-viewports').textContent;
      expect(puckViewports).toBe(''); // No viewports passed
    });
  });

  describe('Configuration handling', () => {
    it('should handle empty configuration object', () => {
      // Arrange
      const emptyConfig = {};
      const props: EmptyEditorProps = {
        config: emptyConfig
      };

      // Act
      render(<EmptyEditor {...props} />);

      // Assert
      const puckConfig = JSON.parse(screen.getByTestId('puck-config').textContent || '{}');
      expect(puckConfig).toEqual({ components: {} });
    });

         it('should handle complex configuration with multiple components', () => {
       // Arrange
       const complexConfig: CompiledComponent = {
         Text: {
           fields: { 
             text: { type: 'text' }, 
             fontSize: { type: 'number' } 
           },
           render: () => React.createElement('div')
         },
         Image: {
           fields: { 
             src: { type: 'text' }, 
             alt: { type: 'text' } 
           },
           render: () => React.createElement('div')
         },
         Button: {
           fields: { 
             label: { type: 'text' },
             variant: { 
               type: 'radio', 
               options: [
                 { label: 'Primary', value: 'primary' },
                 { label: 'Secondary', value: 'secondary' }
               ]
             }
           },
           render: () => React.createElement('div')
         }
       };

      const props: EmptyEditorProps = {
        config: complexConfig
      };

      // Act
      render(<EmptyEditor {...props} />);

      // Assert
      const puckConfig = JSON.parse(screen.getByTestId('puck-config').textContent || '{}');
      // Only check the fields part since render functions don't serialize
      expect(Object.keys(puckConfig.components)).toHaveLength(3);
      expect(puckConfig.components.Button.fields.variant.options).toHaveLength(2);
      expect(puckConfig.components.Text.fields).toEqual(complexConfig.Text.fields);
      expect(puckConfig.components.Image.fields).toEqual(complexConfig.Image.fields);
      expect(puckConfig.components.Button.fields).toEqual(complexConfig.Button.fields);
    });
  });

  describe('Props validation and type safety', () => {
    it('should maintain type safety with proper TypeScript types', () => {
      // This test ensures TypeScript compilation success
      // If types are wrong, TypeScript compilation would fail
      
      // Arrange
      const typedConfig: Record<string, any> = mockCustomConfig;
      const typedData: PuckData = {
        content: [],
        root: { props: {} },
        zones: {}
      };
      const typedOnPublish = (data: PuckData) => console.log(data);

      const props: EmptyEditorProps = {
        data: typedData,
        config: typedConfig,
        onPublish: typedOnPublish
      };

      // Act & Assert - Should not throw TypeScript errors
      expect(() => render(<EmptyEditor {...props} />)).not.toThrow();
    });
  });
});