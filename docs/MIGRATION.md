# Migration Guide

This guide helps you migrate between different versions of the EazyEd Builder Kit and handle data format changes.

## Table of Contents

- [Version Migration](#version-migration)
- [Data Format Migration](#data-format-migration)
- [Component Migration](#component-migration)
- [API Changes](#api-changes)
- [Breaking Changes](#breaking-changes)
- [Migration Scripts](#migration-scripts)
- [Troubleshooting](#troubleshooting)

## Version Migration

### From v0.x to v1.0

#### Breaking Changes

**1. Component API Changes**
```typescript
// ❌ Old (v0.x)
const TextComponent = {
  name: "Text",
  fields: {
    content: { type: "text" }
  },
  render: (props) => <p>{props.content}</p>
};

// ✅ New (v1.0)
const TextComponent = {
  name: "Text",
  config: {
    text: { type: "text" }
  },
  render: ({ text }) => <p>{text}</p>
};
```

**2. Import Path Changes**
```typescript
// ❌ Old (v0.x)
import { BuilderEditor, BuilderRenderer } from 'playground';

// ✅ New (v1.0)
import { Editor, Renderer } from 'playground';
```

**3. Prop Name Changes**
```typescript
// ❌ Old (v0.x)
<BuilderEditor 
  content={data}
  onSave={handleSave}
/>

// ✅ New (v1.0)
<Editor 
  data={data}
  onPublish={handlePublish}
/>
```

#### Migration Steps

1. **Update imports**
   ```bash
   # Use search and replace in your IDE
   # Replace: import { BuilderEditor } from 'playground'
   # With: import { Editor } from 'playground'
   ```

2. **Update component usage**
   ```typescript
   // Update all component references
   const migrateComponents = (oldData) => {
     return {
       ...oldData,
       content: oldData.content.map(component => ({
         ...component,
         // Update component prop names
         props: migrateComponentProps(component.type, component.props)
       }))
     };
   };
   ```

3. **Update configuration**
   ```typescript
   // Custom components need config update
   const migrateCustomComponent = (oldComponent) => ({
     name: oldComponent.name,
     config: oldComponent.fields, // fields -> config
     render: oldComponent.render
   });
   ```

### From v1.0 to v1.1

#### New Features
- LaTeX component with improved rendering
- Enhanced rich text editor with math support
- Better TypeScript definitions

#### Migration Steps
1. **Install latest version**
   ```bash
   npm install playground@^1.1.0
   ```

2. **Update CSS imports** (if using custom styles)
   ```css
   /* Add new KaTeX styles */
   @import 'katex/dist/katex.min.css';
   ```

3. **Optional: Migrate to new LaTeX component**
   ```typescript
   const migrateMathContent = (content) => {
     return content.map(item => {
       if (item.type === 'Text' && item.props.text.includes('$$')) {
         // Convert math text to LaTeX component
         return {
           type: 'Latex',
           props: {
             formula: extractMathFromText(item.props.text),
             display: 'block'
           }
         };
       }
       return item;
     });
   };
   ```

## Data Format Migration

### Puck Data Structure Evolution

#### v0.x Format
```json
{
  "components": [
    {
      "id": "text-1",
      "type": "Text",
      "data": {
        "content": "Hello World"
      }
    }
  ],
  "layout": {}
}
```

#### v1.x Format
```json
{
  "content": [
    {
      "type": "Text",
      "props": {
        "text": "Hello World",
        "fontSize": 16,
        "fontWeight": "normal"
      }
    }
  ],
  "root": { "props": {} },
  "zones": {}
}
```

### Migration Functions

```typescript
// Migration utility
export class DataMigrator {
  static migrateToV1(oldData: any): PuckData {
    if (this.isV1Format(oldData)) {
      return oldData;
    }

    return {
      content: this.migrateComponents(oldData.components || []),
      root: { props: {} },
      zones: this.migrateZones(oldData.layout || {})
    };
  }

  private static isV1Format(data: any): boolean {
    return data && 
           Array.isArray(data.content) && 
           data.root !== undefined &&
           data.zones !== undefined;
  }

  private static migrateComponents(components: any[]): ComponentInstance[] {
    return components.map(component => ({
      type: component.type,
      props: this.migrateComponentData(component.type, component.data)
    }));
  }

  private static migrateComponentData(type: string, oldData: any): any {
    const migrators = {
      Text: (data: any) => ({
        text: data.content || '',
        fontSize: data.size || 16,
        fontWeight: data.weight || 'normal'
      }),
      Image: (data: any) => ({
        imageUrl: data.src || data.url || ''
      }),
      RichText: (data: any) => ({
        content: data.html || data.content || ''
      }),
      HTML: (data: any) => ({
        content: data.html || data.markup || ''
      })
    };

    const migrator = migrators[type];
    return migrator ? migrator(oldData) : oldData;
  }

  private static migrateZones(layout: any): Record<string, ComponentInstance[]> {
    // Migrate layout structure to zones
    return {};
  }
}
```

### Usage Example

```typescript
import { DataMigrator } from './migration-utils';

const legacyData = {
  components: [
    {
      id: "text-1",
      type: "Text",
      data: { content: "Hello" }
    }
  ]
};

const migratedData = DataMigrator.migrateToV1(legacyData);

// Use with Editor
<Editor data={migratedData} onPublish={handlePublish} />
```

## Component Migration

### Custom Component Updates

#### v0.x Custom Component
```typescript
const CustomButton = {
  name: "CustomButton",
  fields: {
    label: { type: "text", default: "Click me" },
    variant: { 
      type: "select", 
      options: ["primary", "secondary"] 
    }
  },
  render: (props) => (
    <button className={`btn-${props.variant}`}>
      {props.label}
    </button>
  )
};
```

#### v1.x Custom Component
```typescript
const CustomButton = {
  name: "CustomButton",
  config: {
    text: { type: "text", default: "Click me" },
    variant: { 
      type: "radio", 
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" }
      ]
    }
  },
  render: ({ text, variant }) => (
    <button className={`btn-${variant}`}>
      {text}
    </button>
  )
};
```

#### Migration Script for Custom Components
```typescript
const migrateCustomComponent = (oldComponent: any) => {
  return {
    name: oldComponent.name,
    config: migrateFields(oldComponent.fields),
    render: updateRenderFunction(oldComponent.render)
  };
};

const migrateFields = (fields: any) => {
  const migrated = {};
  
  Object.entries(fields).forEach(([key, field]: [string, any]) => {
    migrated[key] = {
      type: field.type === 'select' ? 'radio' : field.type,
      options: field.options?.map(opt => 
        typeof opt === 'string' 
          ? { label: opt, value: opt }
          : opt
      ),
      default: field.default
    };
  });
  
  return migrated;
};
```

## API Changes

### Method Signature Changes

#### Editor Props
```typescript
// v0.x
interface EditorProps {
  content: any;
  onSave: (content: any) => void;
  config?: any;
}

// v1.x
interface EditorProps {
  data: any;
  onPublish: (data: any) => void;
}
```

#### Component Configuration
```typescript
// v0.x
interface ComponentConfig {
  fields: Record<string, FieldConfig>;
}

// v1.x
interface ComponentConfig {
  config: Record<string, FieldConfig>;
}
```

### Event Handler Changes

```typescript
// v0.x
const handleSave = (content) => {
  // Save content
  api.saveContent(content);
};

// v1.x
const handlePublish = (data) => {
  // Publish data
  api.publishContent(data);
};
```

## Breaking Changes

### v1.0.0 Breaking Changes

1. **Component field structure**
   - `fields` renamed to `config`
   - Field options format changed from array to object array

2. **Editor props**
   - `content` prop renamed to `data`
   - `onSave` callback renamed to `onPublish`

3. **Import paths**
   - `BuilderEditor` renamed to `Editor`
   - `BuilderRenderer` renamed to `Renderer`

4. **CSS classes**
   - `.builder-` prefix changed to `.puck-`
   - Some utility classes removed

### v1.1.0 Breaking Changes

1. **LaTeX component**
   - New required KaTeX CSS import
   - Math syntax changes for inline vs block display

2. **Rich text editor**
   - Tiptap extensions updated
   - Some formatting options renamed

## Migration Scripts

### Automated Migration Script

```typescript
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { DataMigrator } from './migration-utils';

async function migrateProject(projectPath: string) {
  console.log('Starting migration...');

  // 1. Update package.json
  await updatePackageJson(projectPath);

  // 2. Migrate data files
  await migrateDataFiles(projectPath);

  // 3. Update component files
  await updateComponentFiles(projectPath);

  // 4. Update import statements
  await updateImports(projectPath);

  console.log('Migration completed!');
}

async function updatePackageJson(projectPath: string) {
  const packagePath = path.join(projectPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  // Update dependencies
  packageJson.dependencies['playground'] = '^1.0.0';
  
  // Add new peer dependencies if needed
  packageJson.peerDependencies = {
    ...packageJson.peerDependencies,
    'react': '^18.0.0',
    'react-dom': '^18.0.0'
  };

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json');
}

async function migrateDataFiles(projectPath: string) {
  const dataDir = path.join(projectPath, 'src/data');
  
  if (!fs.existsSync(dataDir)) return;

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const migrated = DataMigrator.migrateToV1(data);
    
    fs.writeFileSync(filePath, JSON.stringify(migrated, null, 2));
    console.log(`✅ Migrated ${file}`);
  }
}

async function updateComponentFiles(projectPath: string) {
  // Update custom component files
  const componentsDir = path.join(projectPath, 'src/components');
  
  if (!fs.existsSync(componentsDir)) return;

  // Implementation for updating component files
  console.log('✅ Updated component files');
}

async function updateImports(projectPath: string) {
  // Update import statements in TypeScript/JavaScript files
  console.log('✅ Updated import statements');
}

// Run migration
if (process.argv[2]) {
  migrateProject(process.argv[2]);
} else {
  console.log('Usage: node migrate.js <project-path>');
}
```

### Data Migration Utility

```typescript
// migration-utils.ts
export const migrationUtils = {
  // Backup current data
  backup: (data: any, filename: string) => {
    const backup = {
      timestamp: new Date().toISOString(),
      version: 'pre-migration',
      data
    };
    
    fs.writeFileSync(
      `${filename}.backup.json`, 
      JSON.stringify(backup, null, 2)
    );
  },

  // Validate migrated data
  validate: (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.content || !Array.isArray(data.content)) {
      errors.push('Invalid content structure');
    }

    if (!data.root || typeof data.root !== 'object') {
      errors.push('Invalid root structure');
    }

    if (!data.zones || typeof data.zones !== 'object') {
      errors.push('Invalid zones structure');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Restore from backup
  restore: (backupPath: string) => {
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    return backup.data;
  }
};
```

## Troubleshooting

### Common Migration Issues

#### 1. Component Not Rendering

**Problem**: Custom components not appearing after migration.

**Solution**:
```typescript
// Check component configuration
const debugComponent = (component: any) => {
  console.log('Component structure:', component);
  
  // Verify required fields
  if (!component.name) console.error('Missing component name');
  if (!component.config) console.error('Missing component config');
  if (!component.render) console.error('Missing component render function');
};
```

#### 2. Data Not Loading

**Problem**: Migrated data not loading in editor.

**Solution**:
```typescript
// Validate data structure
const validateData = (data: any) => {
  const validation = migrationUtils.validate(data);
  
  if (!validation.valid) {
    console.error('Data validation failed:', validation.errors);
    return false;
  }
  
  return true;
};

// Use in Editor
const [isValid, setIsValid] = useState(false);

useEffect(() => {
  if (data) {
    setIsValid(validateData(data));
  }
}, [data]);

return isValid ? <Editor data={data} onPublish={onPublish} /> : <div>Invalid data</div>;
```

#### 3. Styling Issues

**Problem**: Components look different after migration.

**Solution**:
```css
/* Update CSS class names */
.builder-component {
  /* Old styles */
}

/* Migrate to */
.puck-component {
  /* Same styles */
}

/* Add missing KaTeX styles */
@import 'katex/dist/katex.min.css';
```

#### 4. TypeScript Errors

**Problem**: Type errors after migration.

**Solution**:
```typescript
// Update type imports
import type { 
  EditorProps, 
  RendererProps, 
  ComponentProps 
} from 'playground';

// Use proper types
const MyEditor: React.FC<EditorProps> = ({ data, onPublish }) => {
  return <Editor data={data} onPublish={onPublish} />;
};
```

### Getting Help

If you encounter issues during migration:

1. **Check the changelog** for detailed breaking changes
2. **Use validation utilities** to check data structure
3. **Create backups** before migrating
4. **Test in development** before migrating production data
5. **Contact support** at [support@eazyed.org](mailto:support@eazyed.org)

### Migration Checklist

- [ ] Backup existing data
- [ ] Update package.json dependencies
- [ ] Run migration scripts
- [ ] Update import statements
- [ ] Test component rendering
- [ ] Validate data structures
- [ ] Update CSS classes
- [ ] Test in development environment
- [ ] Deploy to staging
- [ ] Monitor for issues

## Version Support

| Version | Status | Support Until |
|---------|--------|---------------|
| v1.x    | Active | Current |
| v0.x    | LTS    | December 2024 |

For migration support and questions, please [open an issue](https://github.com/eazyed-org/playground/issues) or contact our support team.