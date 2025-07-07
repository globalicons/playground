import React from "react";

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";

import components from "../components";
import { migrate, isPuckData } from "../utils/migrate";
import type { 
  EditorProps, 
  EmptyEditorProps, 
  PuckData, 
  Viewport 
} from "../types";

/**
 * Default empty Puck data structure for initialization
 */
const INIT_PUCK_DATA: PuckData = {
  content: [],
  root: { props: {} },
  zones: {}
} as const;

/**
 * Default viewport configuration for responsive design preview
 */
const DEFAULT_VIEWPORTS: ReadonlyArray<Viewport> = [
  {
    width: 390,
    height: 844,
    icon: "Smartphone",
    label: "Small"
  }
] as const;

/**
 * Puck component configuration
 */
const PUCK_CONFIG = { components } as const;

/**
 * Checks if a string contains HTML markup.
 * 
 * Uses a simple regex pattern to detect HTML tags in the content.
 * This is a heuristic approach and may not catch all edge cases.
 * 
 * @param content - The string to check for HTML content
 * @returns True if the string appears to contain HTML markup
 * 
 * @example
 * ```typescript
 * isHtmlString("<p>Hello</p>"); // true
 * isHtmlString("Hello World");  // false
 * isHtmlString("< not html");   // false
 * ```
 */
const isHtmlString = (content: string): boolean => {
  // Simple check for HTML tags - looks for opening tags
  return /<[a-z][\s\S]*>/i.test(content);
};

/**
 * Processes input data and converts it to a valid PuckData structure.
 * 
 * This function handles three types of input:
 * 1. Already valid PuckData objects - returned as-is
 * 2. HTML strings - migrated to HTML component
 * 3. Plain text strings - migrated to Text component
 * 4. Any other type - returns default empty structure
 * 
 * @param data - The input data to process
 * @returns A valid PuckData object ready for the editor
 * 
 * @example
 * ```typescript
 * // HTML string
 * const htmlData = processEditorData("<p>Hello</p>");
 * 
 * // Plain text
 * const textData = processEditorData("Hello World");
 * 
 * // Already valid PuckData
 * const puckData = processEditorData(existingPuckData);
 * ```
 */
const processEditorData = (data: unknown): PuckData => {
  // Return default if no data provided
  if (!data) {
    return INIT_PUCK_DATA;
  }

  // Case 1: Already a valid Puck object
  if (isPuckData(data)) {
    return data;
  }

  // Case 2 & 3: String data (HTML or plain text)
  if (typeof data === 'string') {
    const componentType = isHtmlString(data) ? 'Html' : 'Text';
    const migrationResult = migrate(data, componentType);
    
    // Migration should return PuckData, but fallback to default if not
    return isPuckData(migrationResult) ? migrationResult : INIT_PUCK_DATA;
  }

  // Fallback for unexpected data types
  console.warn('Unexpected data type provided to editor:', typeof data);
  return INIT_PUCK_DATA;
};

/**
 * Default publish handler that logs the published data.
 * 
 * @param data - The PuckData to be published
 */
const defaultOnPublish = (data: PuckData): void => {
  console.log("onPublish", JSON.stringify(data, null, 2));
};

/**
 * Main Puck Editor component with automatic data migration.
 * 
 * This component provides a full-featured WYSIWYG editor using the Puck framework.
 * It automatically handles different input data types and migrates them to the
 * appropriate Puck data structure.
 * 
 * Features:
 * - Automatic data type detection and migration
 * - HTML and plain text input support
 * - Responsive design preview with viewports
 * - Built-in component library
 * 
 * @param props - The editor configuration props
 * @param props.data - Initial data (PuckData, HTML string, or plain text)
 * @param props.onPublish - Callback function called when content is published
 * @returns The rendered Puck editor component
 * 
 * @example
 * ```typescript
 * // With HTML content
 * <Editor 
 *   data="<p>Hello World</p>" 
 *   onPublish={(data) => console.log('Published:', data)} 
 * />
 * 
 * // With plain text
 * <Editor 
 *   data="Hello World" 
 *   onPublish={(data) => saveToDatabase(data)} 
 * />
 * 
 * // With existing PuckData
 * <Editor 
 *   data={existingPuckData} 
 *   onPublish={(data) => updateContent(data)} 
 * />
 * ```
 */
export const Editor: React.FC<EditorProps> = (props: EditorProps) => {
  const { data, onPublish = defaultOnPublish } = props;
  const editorData = React.useMemo(() => processEditorData(data), [data]);
  
  return (
    <Puck
      config={PUCK_CONFIG}
      data={editorData}
      onPublish={onPublish}
      viewports={DEFAULT_VIEWPORTS}
    />
  );
};

/**
 * Empty Puck Editor component for custom configurations.
 * 
 * This component provides a minimal Puck editor instance that allows
 * for custom component configurations. It's useful when you need
 * to override the default component set or provide a completely
 * custom editing experience.
 * 
 * @param props - The empty editor configuration props
 * @param props.data - Initial PuckData (defaults to empty structure)
 * @param props.config - Custom component configuration
 * @param props.onPublish - Optional publish callback
 * @returns The rendered empty Puck editor component
 * 
 * @example
 * ```typescript
 * const customConfig = {
 *   MyComponent: {
 *     fields: { text: { type: 'text' } },
 *     render: ({ text }) => <div>{text}</div>
 *   }
 * };
 * 
 * <EmptyEditor 
 *   config={customConfig}
 *   data={INIT_PUCK_DATA}
 *   onPublish={(data) => handlePublish(data)}
 * />
 * ```
 */
export const EmptyEditor: React.FC<EmptyEditorProps> = (props: EmptyEditorProps) => {
  const { data = INIT_PUCK_DATA, config, onPublish } = props;
  return (
    <Puck 
      data={data} 
      config={config} 
      onPublish={onPublish}
    />
  );
};




