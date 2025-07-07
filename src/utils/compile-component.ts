import type { ComponentProps, CompiledComponent } from '../types';

/**
 * Compiles a component configuration into a format suitable for the Puck editor.
 * 
 * This function takes a component definition with name, configuration, and render function
 * and transforms it into the structure expected by the @measured/puck library.
 * 
 * @param component - The component configuration object
 * @param component.name - The unique name identifier for the component
 * @param component.config - Field configuration mapping for the component
 * @param component.render - React render function for the component
 * @returns A compiled component object with the component name as key
 * 
 * @example
 * ```typescript
 * const textComponent = compileComponent({
 *   name: 'Text',
 *   config: {
 *     text: { type: 'text' },
 *     fontSize: { type: 'number' }
 *   },
 *   render: ({ text, fontSize }) => <p style={{ fontSize }}>{text}</p>
 * });
 * ```
 */
export const compileComponent = (component: ComponentProps): CompiledComponent => {
  const { name, config, render } = component;
  
  return {
    [name]: {
      fields: config,
      render,
    },
  };
};
