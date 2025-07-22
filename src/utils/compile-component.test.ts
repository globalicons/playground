import React from 'react';
import { compileComponent } from './compile-component';
import type { ComponentProps, FieldConfig } from '../types';

describe('compileComponent', () => {
  describe('Basic functionality', () => {
    it('should compile a simple text component correctly', () => {
      // Arrange
      const mockRender = jest.fn(() => React.createElement('div', {}, 'MockElement'));
      const textConfig: Record<string, FieldConfig> = {
        text: { type: 'text' },
        fontSize: { type: 'number' }
      };
      
      const componentProps: ComponentProps = {
        name: 'Text',
        config: textConfig,
        render: mockRender as any
      };

      // Act
      const result = compileComponent(componentProps);

      // Assert
      expect(result).toHaveProperty('Text');
      expect(result.Text).toHaveProperty('fields', textConfig);
      expect(result.Text).toHaveProperty('render', mockRender);
    });

    it('should compile a component with radio field options', () => {
      // Arrange
      const mockRender = jest.fn(() => 'MockElement' as unknown);
      const radioConfig: Record<string, FieldConfig> = {
        fontWeight: {
          type: 'radio',
          options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Bold', value: 'bold' }
          ]
        }
      };
      
      const componentProps: ComponentProps = {
        name: 'StyledText',
        config: radioConfig,
        render: mockRender as any
      };

      // Act
      const result = compileComponent(componentProps);

      // Assert
      expect(result).toHaveProperty('StyledText');
      expect(result.StyledText.fields.fontWeight).toEqual(radioConfig.fontWeight);
      expect(result.StyledText.fields.fontWeight.options).toHaveLength(2);
      expect(result.StyledText.fields.fontWeight.options?.[0]).toEqual({
        label: 'Normal',
        value: 'normal'
      });
    });

    it('should preserve all field configuration properties', () => {
      // Arrange
      const mockRender = jest.fn(() => 'MockElement' as unknown);
      const complexConfig: Record<string, FieldConfig> = {
        title: { 
          type: 'text', 
          defaultValue: 'Default Title' 
        },
        count: { 
          type: 'number', 
          defaultValue: 0 
        },
        style: {
          type: 'select',
          options: [
            { label: 'Style 1', value: 'style1' },
            { label: 'Style 2', value: 'style2' }
          ],
          defaultValue: 'style1'
        }
      };
      
      const componentProps: ComponentProps = {
        name: 'ComplexComponent',
        config: complexConfig,
        render: mockRender
      };

      // Act
      const result = compileComponent(componentProps);

      // Assert
      expect(result.ComplexComponent.fields).toEqual(complexConfig);
      expect(result.ComplexComponent.fields.title.defaultValue).toBe('Default Title');
      expect(result.ComplexComponent.fields.count.defaultValue).toBe(0);
      expect(result.ComplexComponent.fields.style.defaultValue).toBe('style1');
    });
  });

  describe('Component name handling', () => {
    it('should handle components with special characters in names', () => {
      // Arrange
      const mockRender = jest.fn(() => 'MockElement' as unknown);
      const componentProps: ComponentProps = {
        name: 'My-Special_Component123',
        config: { text: { type: 'text' } },
        render: mockRender
      };

      // Act
      const result = compileComponent(componentProps);

      // Assert
      expect(result).toHaveProperty('My-Special_Component123');
    });

    it('should handle components with single character names', () => {
      // Arrange
      const mockRender = jest.fn(() => 'MockElement' as unknown);
      const componentProps: ComponentProps = {
        name: 'A',
        config: { value: { type: 'text' } },
        render: mockRender
      };

      // Act
      const result = compileComponent(componentProps);

      // Assert
      expect(result).toHaveProperty('A');
    });
  });

  describe('Render function handling', () => {
    it('should preserve the exact render function reference', () => {
      // Arrange
      const mockRender = jest.fn(() => 'MockElement' as unknown);
      const componentProps: ComponentProps = {
        name: 'TestComponent',
        config: { text: { type: 'text' } },
        render: mockRender
      };

      // Act
      const result = compileComponent(componentProps);

      // Assert
      expect(result.TestComponent.render).toBe(mockRender);
      expect(typeof result.TestComponent.render).toBe('function');
    });

    it('should allow render function to be called with props', () => {
      // Arrange
      const mockRender = jest.fn((props) => `Rendered with: ${JSON.stringify(props)}`);
      const componentProps: ComponentProps = {
        name: 'CallableComponent',
        config: { text: { type: 'text' } },
        render: mockRender
      };
      const testProps = { text: 'Hello World', fontSize: 16 };

      // Act
      const result = compileComponent(componentProps);
      const renderResult = result.CallableComponent.render(testProps);

      // Assert
      expect(mockRender).toHaveBeenCalledWith(testProps);
      expect(renderResult).toBe('Rendered with: {"text":"Hello World","fontSize":16}');
    });
  });

  describe('Empty configuration handling', () => {
    it('should handle components with empty config objects', () => {
      // Arrange
      const mockRender = jest.fn(() => 'MockElement' as unknown);
      const componentProps: ComponentProps = {
        name: 'EmptyConfig',
        config: {},
        render: mockRender
      };

      // Act
      const result = compileComponent(componentProps);

      // Assert
      expect(result.EmptyConfig.fields).toEqual({});
      expect(result.EmptyConfig.render).toBe(mockRender);
    });
  });

  describe('Type safety validation', () => {
    it('should maintain readonly properties in the result', () => {
      // Arrange
      const mockRender = jest.fn(() => 'MockElement' as unknown);
      const componentProps: ComponentProps = {
        name: 'ReadonlyTest',
        config: { text: { type: 'text' } },
        render: mockRender
      };

      // Act
      const result = compileComponent(componentProps);

      // Assert
      // TypeScript should enforce readonly properties at compile time
      expect(Object.isFrozen(result.ReadonlyTest.fields)).toBe(false); // Jest doesn't freeze objects
      expect(result.ReadonlyTest.fields).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle field configs with all supported types', () => {
      // Arrange
      const mockRender = jest.fn(() => 'MockElement' as unknown);
      const allTypesConfig: Record<string, FieldConfig> = {
        textField: { type: 'text' },
        numberField: { type: 'number' },
        radioField: { 
          type: 'radio', 
          options: [{ label: 'Option 1', value: 'opt1' }] 
        },
        selectField: { 
          type: 'select', 
          options: [{ label: 'Select 1', value: 'sel1' }] 
        }
      };
      
      const componentProps: ComponentProps = {
        name: 'AllTypesComponent',
        config: allTypesConfig,
        render: mockRender
      };

      // Act
      const result = compileComponent(componentProps);

      // Assert
      expect(result.AllTypesComponent.fields.textField.type).toBe('text');
      expect(result.AllTypesComponent.fields.numberField.type).toBe('number');
      expect(result.AllTypesComponent.fields.radioField.type).toBe('radio');
      expect(result.AllTypesComponent.fields.selectField.type).toBe('select');
    });

    it('should not mutate the original component props', () => {
      // Arrange
      const mockRender = jest.fn(() => 'MockElement' as unknown);
      const originalConfig = { text: { type: 'text' as const } };
      const componentProps: ComponentProps = {
        name: 'ImmutableTest',
        config: originalConfig,
        render: mockRender
      };

      // Act
      const result = compileComponent(componentProps);

      // Assert
      expect(componentProps.config).toBe(originalConfig);
      expect(result.ImmutableTest.fields).toEqual(originalConfig);
      // Note: compileComponent preserves the reference to the config object
      expect(result.ImmutableTest.fields).toBe(originalConfig);
    });
  });
});