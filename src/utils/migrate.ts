import { v4 as uuidv4 } from 'uuid';
import type { 
  PuckData, 
  PuckContentItem, 
  MigrationFunction, 
  MigrationMap 
} from '../types';

/**
 * Default empty Puck data structure
 */
const INIT_PUCK_DATA: PuckData = {
  content: [],
  root: { props: {} },
  zones: {}
} as const;

/**
 * Supported component types for migration
 */
type SupportedComponentType = 'Text' | 'Html';

/**
 * Generates a unique identifier for a component instance.
 * 
 * @param componentName - The name of the component type
 * @returns A unique string identifier in the format "ComponentName-uuid"
 * 
 * @example
 * ```typescript
 * const id = generateComponentId('Text');
 * // Returns: "Text-123e4567-e89b-12d3-a456-426614174000"
 * ```
 */
const generateComponentId = (componentName: string): string => {
  return `${componentName}-${uuidv4()}`;
};

/**
 * Migrates plain text content to a Puck Text component structure.
 * 
 * @param content - The plain text string to migrate
 * @returns A complete PuckData object containing the text component
 * 
 * @example
 * ```typescript
 * const result = migrateText("Hello World");
 * // Returns a PuckData with a Text component containing "Hello World"
 * ```
 */
const migrateText: MigrationFunction = (content: string): PuckData => {
  const textContent: PuckContentItem = {
    type: 'Text',
    props: {
      id: generateComponentId('Text'),
      text: content,
    }
  };

  return {
    content: [textContent],
    root: INIT_PUCK_DATA.root,
    zones: INIT_PUCK_DATA.zones
  };
};

/**
 * Migrates HTML content to a Puck HTML component structure.
 * 
 * @param content - The HTML string to migrate
 * @returns A complete PuckData object containing the HTML component
 * 
 * @example
 * ```typescript
 * const result = migrateHtml("<p>Hello <strong>World</strong></p>");
 * // Returns a PuckData with an HTML component containing the HTML content
 * ```
 */
const migrateHtml: MigrationFunction = (content: string): PuckData => {
  const htmlContent: PuckContentItem = {
    type: 'Html',
    props: {
      id: generateComponentId('Html'),
      content,
    }
  };

  return {
    content: [htmlContent],
    root: INIT_PUCK_DATA.root,
    zones: INIT_PUCK_DATA.zones
  };
};

/**
 * Migration function mapping for different component types
 */
const MIGRATION_MAP: MigrationMap = {
  Text: migrateText,
  Html: migrateHtml,
} as const;

/**
 * Migrates content string to a Puck data structure based on component type.
 * 
 * This function serves as the main entry point for content migration. It takes
 * a content string and a component type, then applies the appropriate migration
 * function to transform the content into a Puck-compatible data structure.
 * 
 * @param content - The content string to migrate
 * @param componentType - The target component type for migration
 * @returns The migrated PuckData object, or the original content if no migration is available
 * 
 * @throws {Error} When componentType is not supported
 * 
 * @example
 * ```typescript
 * // Migrate plain text
 * const textResult = migrate("Hello World", "Text");
 * 
 * // Migrate HTML content
 * const htmlResult = migrate("<p>Hello</p>", "Html");
 * 
 * // Unsupported type returns original content
 * const fallback = migrate("content", "UnsupportedType");
 * ```
 */
export const migrate = (
  content: string, 
  componentType: string
): PuckData | string => {
  // Validate input parameters
  if (typeof content !== 'string') {
    throw new Error('Content must be a string');
  }
  
  if (typeof componentType !== 'string') {
    throw new Error('Component type must be a string');
  }

  // Check if migration function exists for the component type
  const migrationFunction = MIGRATION_MAP[componentType as keyof MigrationMap];
  
  if (migrationFunction) {
    try {
      return migrationFunction(content);
    } catch (error) {
      console.error(`Migration failed for component type "${componentType}":`, error);
      // Return original content as fallback
      return content;
    }
  }

  // Log warning for unsupported component types
  console.warn(`No migration available for component type: ${componentType}`);
  return content;
};

/**
 * Type guard to check if a value is a valid PuckData object.
 * 
 * @param value - The value to check
 * @returns True if the value is a valid PuckData object
 * 
 * @example
 * ```typescript
 * const result = migrate("Hello", "Text");
 * if (isPuckData(result)) {
 *   // result is definitely PuckData
 *   console.log(result.content.length);
 * }
 * ```
 */
export const isPuckData = (value: unknown): value is PuckData => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'content' in value &&
    'root' in value &&
    'zones' in value &&
    Array.isArray((value as PuckData).content)
  );
};