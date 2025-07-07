/**
 * Configuration option for component fields
 */
export interface FieldOption {
  readonly label: string;
  readonly value: string | number;
}

/**
 * Field configuration for component properties
 */
export interface FieldConfig {
  readonly type: 'text' | 'radio' | 'select' | 'number';
  readonly options?: ReadonlyArray<FieldOption>;
  readonly defaultValue?: string | number;
}

/**
 * Component configuration mapping field names to their configurations
 */
export interface ComponentConfig {
  readonly [fieldName: string]: FieldConfig;
}

/**
 * Properties for a renderable component
 */
export interface ComponentProps {
  readonly name: string;
  readonly config: ComponentConfig;
  readonly render: (props: Record<string, unknown>) => unknown;
}

/**
 * Compiled component structure used by Puck
 */
export interface CompiledComponent {
  readonly [componentName: string]: {
    readonly fields: ComponentConfig;
    readonly render: (props: Record<string, unknown>) => unknown;
  };
}

/**
 * Content item in the Puck data structure
 */
export interface PuckContentItem {
  readonly type: string;
  readonly props: {
    readonly id: string;
    readonly [key: string]: unknown;
  };
}

/**
 * Root configuration for Puck data
 */
export interface PuckRoot {
  readonly props: Record<string, unknown>;
}

/**
 * Zones configuration for Puck data
 */
export interface PuckZones {
  readonly [zoneName: string]: ReadonlyArray<string>;
}

/**
 * Complete Puck data structure
 */
export interface PuckData {
  readonly content: ReadonlyArray<PuckContentItem>;
  readonly root: PuckRoot;
  readonly zones: PuckZones;
}

/**
 * Viewport configuration for responsive design
 */
export interface Viewport {
  readonly width: number;
  readonly height: number;
  readonly icon: string;
  readonly label: string;
}

/**
 * Props for the main Editor component
 */
export interface EditorProps {
  readonly data?: PuckData | string | null;
  readonly onPublish?: (data: PuckData) => void;
}

/**
 * Props for the EmptyEditor component
 */
export interface EmptyEditorProps extends EditorProps {
  readonly config: CompiledComponent;
}

/**
 * Props for the Renderer component
 */
export interface RendererProps {
  readonly data?: PuckData | string | null;
}

/**
 * Migration function type
 */
export type MigrationFunction = (content: string) => PuckData;

/**
 * Migration map for different component types
 */
export interface MigrationMap {
  readonly [componentName: string]: MigrationFunction;
}

/**
 * Text component specific props
 */
export interface TextComponentProps {
  readonly text: string;
  readonly fontWeight?: 'normal' | 'bold';
  readonly fontSize?: number;
}

/**
 * HTML component specific props
 */
export interface HtmlComponentProps {
  readonly content: string;
}

/**
 * Raw component export structure
 */
export interface RawComponentExport {
  readonly name: string;
  readonly config: ComponentConfig;
  readonly render: (props: Record<string, unknown>) => unknown;
}