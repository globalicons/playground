import { migrate, isPuckData } from './migrate';
import type { PuckData } from '../types';

// Mock uuid to have predictable test results
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234')
}));

describe('migrate', () => {
  describe('Text migration', () => {
    it('should migrate plain text to Text component structure', () => {
      // Arrange
      const plainText = 'Hello World';
      
      // Act
      const result = migrate(plainText, 'Text');
      
      // Assert
      expect(isPuckData(result)).toBe(true);
      const puckResult = result as PuckData;
      expect(puckResult.content).toHaveLength(1);
      expect(puckResult.content[0]).toEqual({
        type: 'Text',
        props: {
          id: 'Text-mock-uuid-1234',
          text: 'Hello World'
        }
      });
      expect(puckResult.root).toEqual({ props: {} });
      expect(puckResult.zones).toEqual({});
    });

    it('should handle empty text strings', () => {
      // Arrange
      const emptyText = '';
      
      // Act
      const result = migrate(emptyText, 'Text');
      
      // Assert
      expect(isPuckData(result)).toBe(true);
      const puckResult = result as PuckData;
      expect(puckResult.content[0].props.text).toBe('');
    });

    it('should handle text with special characters', () => {
      // Arrange
      const specialText = 'Hello! @#$%^&*()_+ 世界 🌍';
      
      // Act
      const result = migrate(specialText, 'Text');
      
      // Assert
      expect(isPuckData(result)).toBe(true);
      const puckResult = result as PuckData;
      expect(puckResult.content[0].props.text).toBe(specialText);
    });

    it('should handle multiline text', () => {
      // Arrange
      const multilineText = 'Line 1\nLine 2\nLine 3';
      
      // Act
      const result = migrate(multilineText, 'Text');
      
      // Assert
      expect(isPuckData(result)).toBe(true);
      const puckResult = result as PuckData;
      expect(puckResult.content[0].props.text).toBe(multilineText);
    });
  });

  describe('HTML migration', () => {
    it('should migrate HTML content to HTML component structure', () => {
      // Arrange
      const htmlContent = '<p>Hello <strong>World</strong></p>';
      
      // Act
      const result = migrate(htmlContent, 'Html');
      
      // Assert
      expect(isPuckData(result)).toBe(true);
      const puckResult = result as PuckData;
      expect(puckResult.content).toHaveLength(1);
      expect(puckResult.content[0]).toEqual({
        type: 'HTML',
        props: {
          id: 'HTML-mock-uuid-1234',
          content: htmlContent
        }
      });
      expect(puckResult.root).toEqual({ props: {} });
      expect(puckResult.zones).toEqual({});
    });

    it('should handle complex HTML structures', () => {
      // Arrange
      const complexHtml = `
        <div class="container">
          <h1>Title</h1>
          <p>Paragraph with <a href="#link">link</a></p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `;
      
      // Act
      const result = migrate(complexHtml, 'Html');
      
      // Assert
      expect(isPuckData(result)).toBe(true);
      const puckResult = result as PuckData;
      expect(puckResult.content[0].props.content).toBe(complexHtml);
    });

    it('should handle HTML with inline styles and scripts', () => {
      // Arrange
      const htmlWithStyles = '<div style="color: red;"><script>alert("test")</script></div>';
      
      // Act
      const result = migrate(htmlWithStyles, 'Html');
      
      // Assert
      expect(isPuckData(result)).toBe(true);
      const puckResult = result as PuckData;
      expect(puckResult.content[0].props.content).toBe(htmlWithStyles);
    });

    it('should handle malformed HTML', () => {
      // Arrange
      const malformedHtml = '<div><p>Unclosed tags<span>';
      
      // Act
      const result = migrate(malformedHtml, 'Html');
      
      // Assert
      expect(isPuckData(result)).toBe(true);
      const puckResult = result as PuckData;
      expect(puckResult.content[0].props.content).toBe(malformedHtml);
    });
  });

  describe('Unsupported component types', () => {
    it('should return original content for unsupported component types', () => {
      // Arrange
      const content = 'Some content';
      const unsupportedType = 'UnsupportedComponent';
      
      // Mock console.warn to verify warning is logged
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Act
      const result = migrate(content, unsupportedType);
      
      // Assert
      expect(result).toBe(content);
      expect(consoleSpy).toHaveBeenCalledWith(
        'No migration available for component type: UnsupportedComponent'
      );
      
      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should handle empty component type', () => {
      // Arrange
      const content = 'Some content';
      const emptyType = '';
      
      // Mock console.warn
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Act
      const result = migrate(content, emptyType);
      
      // Assert
      expect(result).toBe(content);
      expect(consoleSpy).toHaveBeenCalledWith(
        'No migration available for component type: '
      );
      
      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should handle case-sensitive component types', () => {
      // Arrange
      const content = 'Some content';
      
      // Mock console.warn
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Act
      const lowerCaseResult = migrate(content, 'text');
      const upperCaseResult = migrate(content, 'TEXT');
      
      // Assert
      expect(lowerCaseResult).toBe(content);
      expect(upperCaseResult).toBe(content);
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      
      // Cleanup
      consoleSpy.mockRestore();
    });
  });

  describe('Input validation', () => {
    it('should throw error for non-string content', () => {
      // Arrange
      const invalidContent = 123 as unknown as string;
      
      // Act & Assert
      expect(() => migrate(invalidContent, 'Text')).toThrow('Content must be a string');
    });

    it('should throw error for null content', () => {
      // Arrange
      const nullContent = null as unknown as string;
      
      // Act & Assert
      expect(() => migrate(nullContent, 'Text')).toThrow('Content must be a string');
    });

    it('should throw error for undefined content', () => {
      // Arrange
      const undefinedContent = undefined as unknown as string;
      
      // Act & Assert
      expect(() => migrate(undefinedContent, 'Text')).toThrow('Content must be a string');
    });

    it('should throw error for non-string component type', () => {
      // Arrange
      const content = 'Valid content';
      const invalidType = 123 as unknown as string;
      
      // Act & Assert
      expect(() => migrate(content, invalidType)).toThrow('Component type must be a string');
    });

    it('should throw error for null component type', () => {
      // Arrange
      const content = 'Valid content';
      const nullType = null as unknown as string;
      
      // Act & Assert
      expect(() => migrate(content, nullType)).toThrow('Component type must be a string');
    });
  });

  describe('Error handling and resilience', () => {
    it('should handle migration function throwing errors', () => {
      // Arrange
      const content = 'Test content';
      
      // Mock the uuid function to throw an error
      const uuidMock = require('uuid');
      uuidMock.v4.mockImplementation(() => {
        throw new Error('UUID generation failed');
      });
      
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Act
      const result = migrate(content, 'Text');
      
      // Assert
      expect(result).toBe(content); // Should fallback to original content
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Migration failed for component type "Text":',
        expect.any(Error)
      );
      
      // Cleanup
      consoleErrorSpy.mockRestore();
      uuidMock.v4.mockReturnValue('mock-uuid-1234'); // Reset mock
    });
  });

  describe('Component ID generation uniqueness', () => {
    it('should generate unique IDs for multiple migrations', () => {
      // Arrange
      const uuidMock = require('uuid');
      uuidMock.v4
        .mockReturnValueOnce('uuid-1')
        .mockReturnValueOnce('uuid-2')
        .mockReturnValueOnce('uuid-3');
      
      // Act
      const result1 = migrate('Content 1', 'Text') as PuckData;
      const result2 = migrate('Content 2', 'Text') as PuckData;
      const result3 = migrate('<p>Content 3</p>', 'Html') as PuckData;
      
      // Assert
      expect(result1.content[0].props.id).toBe('Text-uuid-1');
      expect(result2.content[0].props.id).toBe('Text-uuid-2');
      expect(result3.content[0].props.id).toBe('HTML-uuid-3');
      
      // Cleanup
      uuidMock.v4.mockReturnValue('mock-uuid-1234');
    });
  });
});

describe('isPuckData', () => {
  describe('Valid PuckData objects', () => {
    it('should return true for valid empty PuckData', () => {
      // Arrange
      const validPuckData: PuckData = {
        content: [],
        root: { props: {} },
        zones: {}
      };
      
      // Act
      const result = isPuckData(validPuckData);
      
      // Assert
      expect(result).toBe(true);
    });

    it('should return true for PuckData with content', () => {
      // Arrange
      const validPuckData: PuckData = {
        content: [
          {
            type: 'Text',
            props: { id: 'text-1', text: 'Hello' }
          }
        ],
        root: { props: { title: 'Page Title' } },
        zones: { main: ['text-1'] }
      };
      
      // Act
      const result = isPuckData(validPuckData);
      
      // Assert
      expect(result).toBe(true);
    });

    it('should return true for PuckData with complex structure', () => {
      // Arrange
      const complexPuckData: PuckData = {
        content: [
          { type: 'Text', props: { id: 'text-1', text: 'Hello' } },
          { type: 'HTML', props: { id: 'html-1', content: '<p>World</p>' } }
        ],
        root: { 
          props: { 
            title: 'Complex Page',
            metadata: { author: 'Test Author' }
          } 
        },
        zones: { 
          header: ['text-1'], 
          content: ['html-1'],
          footer: []
        }
      };
      
      // Act
      const result = isPuckData(complexPuckData);
      
      // Assert
      expect(result).toBe(true);
    });
  });

  describe('Invalid objects', () => {
    it('should return false for null', () => {
      // Act & Assert
      expect(isPuckData(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      // Act & Assert
      expect(isPuckData(undefined)).toBe(false);
    });

    it('should return false for primitive types', () => {
      // Act & Assert
      expect(isPuckData('string')).toBe(false);
      expect(isPuckData(123)).toBe(false);
      expect(isPuckData(true)).toBe(false);
    });

    it('should return false for arrays', () => {
      // Act & Assert
      expect(isPuckData([])).toBe(false);
      expect(isPuckData([1, 2, 3])).toBe(false);
    });

    it('should return false for objects missing required properties', () => {
      // Act & Assert
      expect(isPuckData({})).toBe(false);
      expect(isPuckData({ content: [] })).toBe(false);
      expect(isPuckData({ content: [], root: {} })).toBe(false);
      expect(isPuckData({ root: {}, zones: {} })).toBe(false);
    });

    it('should return false when content is not an array', () => {
      // Arrange
      const invalidPuckData = {
        content: 'not an array',
        root: { props: {} },
        zones: {}
      };
      
      // Act & Assert
      expect(isPuckData(invalidPuckData)).toBe(false);
    });

    it('should return false for objects with correct keys but wrong types', () => {
      // Arrange
      const invalidTypes = {
        content: null,
        root: { props: {} },
        zones: {}
      };
      
      // Act & Assert
      expect(isPuckData(invalidTypes)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle objects with extra properties', () => {
      // Arrange
      const puckDataWithExtra = {
        content: [],
        root: { props: {} },
        zones: {},
        extraProperty: 'should not affect validation'
      };
      
      // Act & Assert
      expect(isPuckData(puckDataWithExtra)).toBe(true);
    });

    it('should handle deeply nested structures', () => {
      // Arrange
      const deeplyNested = {
        content: [],
        root: { 
          props: { 
            nested: { 
              deep: { 
                very: { 
                  deeply: { 
                    nested: 'value' 
                  } 
                } 
              } 
            } 
          } 
        },
        zones: {}
      };
      
      // Act & Assert
      expect(isPuckData(deeplyNested)).toBe(true);
    });
  });
});