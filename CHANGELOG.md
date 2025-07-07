# Changelog

All notable changes to the EazyEd Builder Kit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New component types in development
- Enhanced accessibility features
- Performance optimizations

### Changed
- Internal refactoring for better maintainability

### Deprecated
- None

### Removed
- None

### Fixed
- Minor bug fixes and improvements

### Security
- Updated dependencies for security patches

## [1.0.0] - 2024-01-15

### Added
- **Core Components**
  - Text component with font weight and size options
  - RichText component with Tiptap editor integration
  - LaTeX component with KaTeX rendering support
  - Image component with file upload and preview
  - HTML component for raw HTML content
- **Editor & Renderer**
  - Drag-and-drop visual editor powered by Puck
  - Static content renderer for production use
  - EmptyEditor for custom component configurations
- **Data Migration**
  - Automatic detection and migration of HTML strings
  - Plain text to Text component migration
  - Support for existing Puck data structures
- **TypeScript Support**
  - Full TypeScript definitions for all components
  - Type-safe component configuration
  - Comprehensive interface definitions
- **Storybook Integration**
  - Complete component documentation
  - Interactive examples and stories
  - Development environment setup
- **Testing Framework**
  - Unit tests for all components
  - Integration test examples
  - Testing utilities and helpers

### Changed
- **Breaking**: Component configuration structure
  - `fields` property renamed to `config`
  - Field options now use object format instead of string arrays
- **Breaking**: Editor component props
  - `content` prop renamed to `data`
  - `onSave` callback renamed to `onPublish`
- **Breaking**: Import paths
  - `BuilderEditor` renamed to `Editor`
  - `BuilderRenderer` renamed to `Renderer`
- **Breaking**: CSS class prefixes
  - `.builder-` classes changed to `.puck-`
  - Updated styling and theme system

### Deprecated
- Legacy v0.x component structure (will be removed in v2.0)
- Old import paths (backward compatibility maintained until v2.0)

### Removed
- Legacy field configuration format
- Deprecated utility functions from v0.x
- Outdated styling classes

### Fixed
- LaTeX formula rendering edge cases
- Image upload file handling
- Rich text editor focus management
- Component prop validation issues
- Memory leaks in development mode

### Security
- Updated all dependencies to latest secure versions
- Added input sanitization for HTML components
- Improved XSS protection in rich text editor

### Migration Notes
- See [MIGRATION.md](docs/MIGRATION.md) for detailed upgrade instructions
- Automated migration script available: `npx playground-migrate`
- Breaking changes require code updates - see migration guide

## [0.18.3] - 2023-12-01

### Added
- Initial public release
- Basic component library
- Simple editor interface

### Fixed
- Critical rendering bugs
- Performance issues with large content

## [0.18.2] - 2023-11-15

### Added
- Beta version with core functionality
- Text and HTML components
- Basic drag-and-drop editing

### Changed
- Improved component API design
- Better TypeScript support

### Fixed
- Editor stability issues
- Component configuration bugs

## [0.18.1] - 2023-11-01

### Added
- Alpha release for testing
- Proof of concept implementation
- Basic Puck integration

### Known Issues
- Limited component library
- Performance concerns with complex layouts
- Incomplete TypeScript definitions

## [0.18.0] - 2023-10-15

### Added
- Initial development version
- Project structure setup
- Basic build configuration

---

## Release Notes

### v1.0.0 - Major Release

This is the first stable release of the EazyEd Builder Kit. Key highlights:

**🎉 Production Ready**
- Comprehensive component library with 5 core components
- Full TypeScript support with complete type definitions
- Extensive testing and documentation
- Enterprise-grade performance and reliability

**🚀 New Features**
- Drag-and-drop visual editor with intuitive interface
- Mathematical expression support via LaTeX/KaTeX
- Advanced rich text editing with formatting options
- Automatic data migration from multiple formats
- Responsive design with mobile-first approach

**⚡ Performance**
- Optimized bundle size with tree-shaking support
- Lazy loading capabilities for better performance
- Efficient rendering with React 18 support
- Memory leak fixes and optimization

**🔒 Security**
- Input sanitization for all user content
- XSS protection in rich text components
- Secure file upload handling
- Updated dependencies with security patches

**📚 Documentation**
- Complete API reference documentation
- Integration guides for popular frameworks
- Migration guide with automated tools
- Storybook examples and interactive demos

**🛠 Developer Experience**
- TypeScript-first development approach
- Comprehensive error handling and validation
- Development tools and debugging utilities
- Extensive test coverage

### Breaking Changes in v1.0.0

1. **Component Configuration**
   ```typescript
   // Old (v0.x)
   const component = {
     fields: { text: { type: "text" } }
   };
   
   // New (v1.0)
   const component = {
     config: { text: { type: "text" } }
   };
   ```

2. **Editor Props**
   ```typescript
   // Old (v0.x)
   <BuilderEditor content={data} onSave={handleSave} />
   
   // New (v1.0)
   <Editor data={data} onPublish={handlePublish} />
   ```

3. **Import Paths**
   ```typescript
   // Old (v0.x)
   import { BuilderEditor } from 'playground';
   
   // New (v1.0)
   import { Editor } from 'playground';
   ```

### Upgrade Guide

**Automatic Migration**
```bash
npx playground-migrate ./your-project
```

**Manual Migration**
1. Update package.json dependencies
2. Run migration scripts for data format changes
3. Update import statements and component usage
4. Test thoroughly in development environment

**Support**
- Migration support available until December 2024
- Comprehensive migration documentation
- Community support via GitHub Issues
- Professional support via [support@eazyed.org](mailto:support@eazyed.org)

### Known Issues

- **Storybook Performance**: Large stories may load slowly on older devices
- **LaTeX Rendering**: Complex mathematical expressions may impact performance
- **File Upload Size**: Image uploads limited to 10MB by default

### Roadmap

**v1.1.0 (Q2 2024)**
- Video and Audio components
- Enhanced accessibility features
- Performance optimizations
- Additional mathematical notation support

**v1.2.0 (Q3 2024)**
- Real-time collaboration features
- Advanced theming system
- Plugin architecture for third-party components
- Mobile editing improvements

**v2.0.0 (Q4 2024)**
- Major architecture improvements
- New component types (Charts, Maps, Forms)
- Enhanced collaborative editing
- Breaking changes for improved API

### Community

- **GitHub**: [https://github.com/eazyed-org/playground](https://github.com/eazyed-org/playground)
- **Discord**: [https://discord.gg/eazyed](https://discord.gg/eazyed)
- **Twitter**: [@EazyEdBuilder](https://twitter.com/EazyEdBuilder)
- **Documentation**: [https://docs.eazyed.org](https://docs.eazyed.org)

### Contributors

Special thanks to all contributors who made this release possible:

- [@raaj-ahiable](https://github.com/raaj-ahiable) - Project Lead & Core Developer
- [@contributor2](https://github.com/contributor2) - Component Development
- [@contributor3](https://github.com/contributor3) - Documentation
- [@contributor4](https://github.com/contributor4) - Testing & QA

### License

This project is licensed under the ISC License. See [LICENSE](LICENSE) file for details.

---

**Note**: For detailed technical documentation, see our [API Reference](docs/API.md) and [Integration Guide](docs/INTEGRATION.md).