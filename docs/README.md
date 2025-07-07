# EazyEd Builder Kit Documentation

Welcome to the comprehensive documentation for the EazyEd Builder Kit. This documentation suite provides everything you need to integrate, use, and contribute to the project.

## 📚 Documentation Overview

### Getting Started
- **[Main README](../README.md)** - Project overview, quick start guide, and basic usage
- **[Installation Guide](../README.md#installation)** - Package installation and setup instructions
- **[Quick Start Examples](../README.md#quick-start)** - Basic implementation examples

### API Documentation
- **[API Reference](./API.md)** - Complete API documentation with all components, interfaces, and utilities
- **[Component Reference](./API.md#component-configuration)** - Detailed documentation for all built-in components
- **[TypeScript Definitions](./API.md#interfaces)** - Full type definitions and interfaces

### Integration & Usage
- **[Integration Guide](./INTEGRATION.md)** - Framework-specific integration guides and deployment strategies
- **[Migration Guide](./MIGRATION.md)** - Version migration instructions and data format changes
- **[Changelog](../CHANGELOG.md)** - Version history, breaking changes, and release notes

### Development
- **[Contributing Guide](../CONTRIBUTING.md)** - Development setup, coding standards, and contribution process
- **[Testing Guide](../CONTRIBUTING.md#testing)** - Testing framework and best practices
- **[Component Development](../CONTRIBUTING.md#component-development)** - Guide for creating custom components

## 🎯 Find What You Need

### For New Users
1. Start with the [Main README](../README.md) for an overview
2. Follow the [Quick Start Guide](../README.md#quick-start) for basic setup
3. Check out [Integration Examples](./INTEGRATION.md) for your framework

### For Developers
1. Review the [API Reference](./API.md) for technical details
2. Read the [Contributing Guide](../CONTRIBUTING.md) for development setup
3. Study [Component Development](../CONTRIBUTING.md#component-development) for custom components

### For Enterprise Users
1. Review [Integration Strategies](./INTEGRATION.md#deployment-strategies) for production deployment
2. Check [Security Considerations](../README.md#security-considerations) for enterprise requirements
3. Explore [Multi-tenant Architectures](./INTEGRATION.md#multi-tenant-architectures) for SaaS applications

### For Migration
1. Check the [Changelog](../CHANGELOG.md) for version-specific changes
2. Follow the [Migration Guide](./MIGRATION.md) for upgrade instructions
3. Use automated migration tools where available

## 🔧 Documentation Structure

```
docs/
├── README.md           # This file - documentation overview
├── API.md              # Complete API reference
├── INTEGRATION.md      # Integration and deployment guide
└── MIGRATION.md        # Version migration guide

Root files:
├── README.md           # Main project documentation
├── CONTRIBUTING.md     # Development and contribution guide
└── CHANGELOG.md        # Version history and release notes
```

## 🎨 Component Documentation

### Core Components
- **[Text Component](./API.md#text-component)** - Simple text with styling options
- **[RichText Component](./API.md#richtext-component)** - Advanced rich text editor with math support
- **[LaTeX Component](./API.md#latex-component)** - Mathematical expressions using KaTeX
- **[Image Component](./API.md#image-component)** - Image upload and display
- **[HTML Component](./API.md#html-component)** - Raw HTML content

### Editor & Renderer
- **[Editor](./API.md#editor)** - Main editing interface
- **[Renderer](./API.md#renderer)** - Static content display
- **[EmptyEditor](./API.md#emptyeditor)** - Customizable editor

## 🔗 Integration Examples

### Frameworks
- **[React/Create React App](./INTEGRATION.md#react-create-react-app)** - Standard React integration
- **[Next.js](./INTEGRATION.md#nextjs-integration)** - SSR and dynamic imports
- **[Vite](./INTEGRATION.md#vite--react-integration)** - Modern build tool setup
- **[Vue.js](./INTEGRATION.md#vuejs-integration)** - Cross-framework integration

### Backend Integration
- **[Node.js + Express](./INTEGRATION.md#nodejs--express)** - RESTful API integration
- **[Python + FastAPI](./INTEGRATION.md#python--fastapi)** - Python backend setup

### CMS Integration
- **[Strapi](./INTEGRATION.md#headless-cms-integration)** - Headless CMS integration
- **[Custom CMS](./INTEGRATION.md#content-management-systems)** - General CMS patterns

## 🚀 Quick Reference

### Installation
```bash
npm install playground
# or
yarn add playground
```

### Basic Usage
```jsx
import { Editor, Renderer } from 'playground';

// Editor mode
<Editor data={content} onPublish={handlePublish} />

// Display mode  
<Renderer data={content} />
```

### Custom Components
```typescript
const CustomComponent = {
  name: "CustomComponent",
  config: {
    text: { type: "text" }
  },
  render: ({ text }) => <div>{text}</div>
};
```

## 🆘 Support & Resources

### Getting Help
- **[GitHub Issues](https://github.com/eazyed-org/playground/issues)** - Bug reports and feature requests
- **[GitHub Discussions](https://github.com/eazyed-org/playground/discussions)** - Community support and questions
- **[Discord Community](https://discord.gg/eazyed)** - Real-time chat and support
- **Email Support**: [support@eazyed.org](mailto:support@eazyed.org)

### Additional Resources
- **[Storybook Documentation](http://localhost:6006)** - Interactive component examples (run `npm run storybook`)
- **[TypeScript Definitions](./API.md#interfaces)** - Complete type definitions
- **[Examples Repository](https://github.com/eazyed-org/playground-examples)** - Real-world implementation examples

### Community
- **[Contributing](../CONTRIBUTING.md)** - How to contribute to the project
- **[Code of Conduct](../CONTRIBUTING.md#code-of-conduct)** - Community guidelines
- **[Roadmap](../CHANGELOG.md#roadmap)** - Future development plans

## 📄 Documentation Standards

This documentation follows:
- **[Keep a Changelog](https://keepachangelog.com/)** - For version history
- **[Semantic Versioning](https://semver.org/)** - For version numbering
- **[Conventional Commits](https://conventionalcommits.org/)** - For commit messages
- **JSDoc Standards** - For code documentation

## 🔄 Documentation Updates

Documentation is updated with each release. For the latest information:
- Check the [Changelog](../CHANGELOG.md) for recent updates
- Visit the [GitHub repository](https://github.com/eazyed-org/playground) for the latest version
- Subscribe to releases for notifications

---

**Last Updated**: January 2024  
**Documentation Version**: 1.0.0  
**Compatible with**: EazyEd Builder Kit v1.0.0+

For questions about this documentation, please [open an issue](https://github.com/eazyed-org/playground/issues) or contact [support@eazyed.org](mailto:support@eazyed.org).