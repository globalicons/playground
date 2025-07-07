# Integration Guide

Complete integration guide for the EazyEd Builder Kit across different frameworks, platforms, and use cases.

## Table of Contents

- [Framework Integration](#framework-integration)
- [Backend Integration](#backend-integration)
- [Deployment Strategies](#deployment-strategies)
- [Content Management Systems](#content-management-systems)
- [E-commerce Platforms](#e-commerce-platforms)
- [Authentication & Authorization](#authentication--authorization)
- [Real-time Collaboration](#real-time-collaboration)
- [Multi-tenant Architectures](#multi-tenant-architectures)

## Framework Integration

### React (Create React App)

```bash
npx create-react-app my-builder-app
cd my-builder-app
npm install playground
```

**src/App.js**
```jsx
import React, { useState } from 'react';
import { Editor, Renderer } from 'playground';
import 'playground/style.css';

function App() {
  const [content, setContent] = useState(null);
  const [mode, setMode] = useState('edit');

  const handlePublish = (data) => {
    setContent(data);
    setMode('preview');
    
    // Save to backend
    fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  return (
    <div className="App">
      <header>
        <button onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}>
          {mode === 'edit' ? 'Preview' : 'Edit'}
        </button>
      </header>
      
      <main style={{ height: 'calc(100vh - 60px)' }}>
        {mode === 'edit' ? (
          <Editor data={content} onPublish={handlePublish} />
        ) : (
          <Renderer data={content} />
        )}
      </main>
    </div>
  );
}

export default App;
```

### Next.js Integration

**Installation**
```bash
npx create-next-app@latest my-builder-next
cd my-builder-next
npm install playground
```

**pages/_app.js**
```jsx
import 'playground/style.css';
import '@measured/puck/puck.css';
import 'katex/dist/katex.min.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

**pages/editor/[id].js**
```jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const Editor = dynamic(() => import('playground').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
});

export default function EditorPage() {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Load existing content
      fetch(`/api/content/${id}`)
        .then(res => res.json())
        .then(data => {
          setContent(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handlePublish = async (data) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/content/${id}` : '/api/content';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        router.push(`/preview/${result.id}`);
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ height: '100vh' }}>
      <Editor data={content} onPublish={handlePublish} />
    </div>
  );
}
```

**pages/preview/[id].js**
```jsx
import { Renderer } from 'playground';

export default function PreviewPage({ content }) {
  return (
    <div className="preview-container">
      <Renderer data={content} />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`${process.env.API_URL}/content/${params.id}`);
    const content = await res.json();
    
    return { props: { content } };
  } catch (error) {
    return { notFound: true };
  }
}
```

**API Route: pages/api/content/[id].js**
```jsx
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const { db } = await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const content = await db.collection('content').findOne({ _id: id });
        res.status(200).json(content);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch content' });
      }
      break;

    case 'PUT':
      try {
        const result = await db.collection('content').updateOne(
          { _id: id },
          { $set: { ...req.body, updatedAt: new Date() } }
        );
        res.status(200).json({ id, updated: result.modifiedCount > 0 });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update content' });
      }
      break;

    case 'POST':
      try {
        const newContent = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const result = await db.collection('content').insertOne(newContent);
        res.status(201).json({ id: result.insertedId });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create content' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
```

### Vite + React Integration

**Installation**
```bash
npm create vite@latest my-builder-vite -- --template react-ts
cd my-builder-vite
npm install playground
```

**vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['playground', '@measured/puck']
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

### Vue.js Integration

While the Builder Kit is React-based, you can integrate it into Vue applications:

**Installation**
```bash
npm install playground @vitejs/plugin-react
```

**BuilderWrapper.vue**
```vue
<template>
  <div ref="builderContainer"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'BuilderWrapper',
  props: {
    data: Object,
    mode: {
      type: String,
      default: 'edit' // 'edit' or 'render'
    }
  },
  emits: ['publish'],
  setup(props, { emit }) {
    const builderContainer = ref(null);
    let reactRoot = null;

    onMounted(async () => {
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');
      const { Editor, Renderer } = await import('playground');

      const Component = props.mode === 'edit' 
        ? React.createElement(Editor, {
            data: props.data,
            onPublish: (data) => emit('publish', data)
          })
        : React.createElement(Renderer, { data: props.data });

      reactRoot = ReactDOM.createRoot(builderContainer.value);
      reactRoot.render(Component);
    });

    onUnmounted(() => {
      if (reactRoot) {
        reactRoot.unmount();
      }
    });

    return {
      builderContainer
    };
  }
};
</script>
```

## Backend Integration

### Node.js + Express

**server.js**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Content Schema
const ContentSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  data: Object, // Puck data
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metadata: {
    seo: {
      title: String,
      description: String,
      keywords: [String]
    },
    analytics: {
      views: { type: Number, default: 0 },
      lastViewed: Date
    }
  }
});

const Content = mongoose.model('Content', ContentSchema);

// Routes
app.post('/api/content', async (req, res) => {
  try {
    const content = new Content(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/content/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    // Update view count
    content.metadata.analytics.views += 1;
    content.metadata.analytics.lastViewed = new Date();
    await content.save();
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/content/:id', async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Publish content
app.post('/api/content/:id/publish', async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { status: 'published', updatedAt: new Date() },
      { new: true }
    );
    res.json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### Python + FastAPI

**main.py**
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContentModel(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    data: Dict[str, Any]
    status: str = "draft"
    metadata: Optional[Dict[str, Any]] = None

class ContentResponse(ContentModel):
    id: str
    created_at: datetime
    updated_at: datetime

# In-memory storage (replace with database)
content_storage = {}

@app.post("/api/content", response_model=ContentResponse)
async def create_content(content: ContentModel):
    content_id = str(len(content_storage) + 1)
    now = datetime.now()
    
    stored_content = {
        "id": content_id,
        "title": content.title,
        "slug": content.slug,
        "data": content.data,
        "status": content.status,
        "metadata": content.metadata or {},
        "created_at": now,
        "updated_at": now
    }
    
    content_storage[content_id] = stored_content
    return stored_content

@app.get("/api/content/{content_id}", response_model=ContentResponse)
async def get_content(content_id: str):
    if content_id not in content_storage:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return content_storage[content_id]

@app.put("/api/content/{content_id}", response_model=ContentResponse)
async def update_content(content_id: str, content: ContentModel):
    if content_id not in content_storage:
        raise HTTPException(status_code=404, detail="Content not found")
    
    stored_content = content_storage[content_id]
    stored_content.update({
        "title": content.title,
        "slug": content.slug,
        "data": content.data,
        "status": content.status,
        "metadata": content.metadata or stored_content["metadata"],
        "updated_at": datetime.now()
    })
    
    return stored_content
```

## Deployment Strategies

### Vercel Deployment

**vercel.json**
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

### Netlify Deployment

**netlify.toml**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Docker Deployment

**Dockerfile**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - api
      - mongodb

  api:
    build: ./api
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/builderkit
    depends_on:
      - mongodb

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## Content Management Systems

### Headless CMS Integration

**Strapi Integration**
```javascript
// strapi/src/api/page/content-types/page/schema.json
{
  "kind": "collectionType",
  "collectionName": "pages",
  "info": {
    "singularName": "page",
    "pluralName": "pages",
    "displayName": "Page"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "title"
    },
    "builderData": {
      "type": "json"
    },
    "status": {
      "type": "enumeration",
      "enum": ["draft", "published"],
      "default": "draft"
    }
  }
}
```

**Custom Strapi Plugin**
```javascript
// strapi/src/plugins/builder-editor/admin/src/pages/HomePage/index.js
import React, { useState, useEffect } from 'react';
import { Editor } from 'playground';
import { request } from '@strapi/helper-plugin';

const BuilderEditorPage = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const response = await request('/pages/1');
      setPageData(response.builderData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch page data:', error);
      setLoading(false);
    }
  };

  const handlePublish = async (data) => {
    try {
      await request('/pages/1', {
        method: 'PUT',
        body: { builderData: data }
      });
      console.log('Page updated successfully');
    } catch (error) {
      console.error('Failed to update page:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ height: '100vh' }}>
      <Editor data={pageData} onPublish={handlePublish} />
    </div>
  );
};

export default BuilderEditorPage;
```

## E-commerce Platforms

### Shopify Integration

**Custom Shopify App**
```javascript
// shopify-app/web/frontend/pages/editor.jsx
import { useState, useCallback } from 'react';
import { Page, Layout, Card } from '@shopify/polaris';
import { Editor } from 'playground';
import { useAuthenticatedFetch } from '../hooks';

export default function EditorPage() {
  const fetch = useAuthenticatedFetch();
  const [pageData, setPageData] = useState(null);

  const handlePublish = useCallback(async (data) => {
    const response = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: {
          title: 'Custom Page',
          body_html: renderToString(data),
          template_suffix: 'builder'
        }
      })
    });

    if (response.ok) {
      console.log('Page created in Shopify');
    }
  }, [fetch]);

  return (
    <Page title="Page Builder">
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ height: '600px' }}>
              <Editor data={pageData} onPublish={handlePublish} />
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// Helper function to render Puck data to HTML
function renderToString(puckData) {
  // Implementation depends on your server-side rendering setup
  return '<div>Rendered content</div>';
}
```

## Authentication & Authorization

### Role-Based Access Control

```javascript
// auth/rbac.js
export const roles = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

export const permissions = {
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content',
  PUBLISH_CONTENT: 'publish_content',
  DELETE_CONTENT: 'delete_content',
  VIEW_CONTENT: 'view_content'
};

export const rolePermissions = {
  [roles.ADMIN]: [
    permissions.CREATE_CONTENT,
    permissions.EDIT_CONTENT,
    permissions.PUBLISH_CONTENT,
    permissions.DELETE_CONTENT,
    permissions.VIEW_CONTENT
  ],
  [roles.EDITOR]: [
    permissions.CREATE_CONTENT,
    permissions.EDIT_CONTENT,
    permissions.VIEW_CONTENT
  ],
  [roles.VIEWER]: [
    permissions.VIEW_CONTENT
  ]
};

export function hasPermission(userRole, permission) {
  return rolePermissions[userRole]?.includes(permission) || false;
}
```

**Protected Editor Component**
```jsx
import React from 'react';
import { Editor } from 'playground';
import { useAuth } from '../hooks/useAuth';
import { hasPermission, permissions } from '../auth/rbac';

const ProtectedEditor = ({ data, onPublish }) => {
  const { user } = useAuth();

  if (!hasPermission(user.role, permissions.EDIT_CONTENT)) {
    return <div>Access denied. You don't have permission to edit content.</div>;
  }

  const handlePublish = (data) => {
    if (!hasPermission(user.role, permissions.PUBLISH_CONTENT)) {
      console.warn('User cannot publish content');
      return;
    }
    onPublish(data);
  };

  return <Editor data={data} onPublish={handlePublish} />;
};

export default ProtectedEditor;
```

## Real-time Collaboration

### WebSocket Integration

```javascript
// collaboration/websocket.js
import { io } from 'socket.io-client';

class CollaborationManager {
  constructor(documentId, userId) {
    this.documentId = documentId;
    this.userId = userId;
    this.socket = io('/collaboration');
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      this.socket.emit('join-document', {
        documentId: this.documentId,
        userId: this.userId
      });
    });

    this.socket.on('content-changed', (data) => {
      if (data.userId !== this.userId) {
        this.handleRemoteChange(data);
      }
    });

    this.socket.on('user-joined', (user) => {
      this.handleUserJoined(user);
    });

    this.socket.on('user-left', (user) => {
      this.handleUserLeft(user);
    });
  }

  broadcastChange(change) {
    this.socket.emit('content-change', {
      documentId: this.documentId,
      userId: this.userId,
      change
    });
  }

  handleRemoteChange(data) {
    // Apply remote changes to the editor
    console.log('Remote change:', data.change);
  }

  handleUserJoined(user) {
    console.log('User joined:', user);
  }

  handleUserLeft(user) {
    console.log('User left:', user);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default CollaborationManager;
```

**Collaborative Editor Component**
```jsx
import React, { useEffect, useRef } from 'react';
import { Editor } from 'playground';
import CollaborationManager from './CollaborationManager';

const CollaborativeEditor = ({ documentId, userId, data, onPublish }) => {
  const collaborationRef = useRef(null);

  useEffect(() => {
    collaborationRef.current = new CollaborationManager(documentId, userId);

    return () => {
      if (collaborationRef.current) {
        collaborationRef.current.disconnect();
      }
    };
  }, [documentId, userId]);

  const handlePublish = (editorData) => {
    if (collaborationRef.current) {
      collaborationRef.current.broadcastChange({
        type: 'publish',
        data: editorData
      });
    }
    onPublish(editorData);
  };

  return <Editor data={data} onPublish={handlePublish} />;
};

export default CollaborativeEditor;
```

## Multi-tenant Architectures

### Tenant-Aware Component System

```javascript
// multi-tenant/TenantProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const TenantContext = createContext();

export const TenantProvider = ({ children, tenantId }) => {
  const [tenantConfig, setTenantConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenantConfig(tenantId);
  }, [tenantId]);

  const fetchTenantConfig = async (id) => {
    try {
      const response = await fetch(`/api/tenants/${id}/config`);
      const config = await response.json();
      setTenantConfig(config);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tenant config:', error);
      setLoading(false);
    }
  };

  return (
    <TenantContext.Provider value={{ tenantConfig, loading, tenantId }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
```

**Tenant-Specific Editor**
```jsx
import React from 'react';
import { Editor, EmptyEditor } from 'playground';
import { useTenant } from './TenantProvider';

const TenantEditor = ({ data, onPublish }) => {
  const { tenantConfig, loading } = useTenant();

  if (loading) return <div>Loading tenant configuration...</div>;

  // Use custom components for this tenant
  if (tenantConfig.customComponents) {
    return (
      <EmptyEditor
        data={data}
        config={tenantConfig.editorConfig}
        onPublish={onPublish}
      />
    );
  }

  // Use default editor
  return <Editor data={data} onPublish={onPublish} />;
};

export default TenantEditor;
```

**Tenant Configuration API**
```javascript
// api/tenants/[id]/config.js
export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const tenant = await getTenantById(id);
    
    const config = {
      editorConfig: {
        components: {
          // Tenant-specific components
          ...getDefaultComponents(),
          ...tenant.customComponents
        }
      },
      theme: tenant.theme,
      features: tenant.features,
      limits: tenant.limits
    };

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenant config' });
  }
}
```

This comprehensive integration guide covers the most common scenarios for enterprise adoption of the EazyEd Builder Kit. Each example provides production-ready code that can be adapted to specific requirements and architectures.