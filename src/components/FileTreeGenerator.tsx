'use client';

import React, { useState, useRef } from 'react';
import { Download, GitBranch, FileText, Folder, ChevronRight, ChevronDown, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

// Type definitions
interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  level: number;
  content?: string;
  expanded?: boolean;
}

const FileTreeGenerator = () => {
  const [treeInput, setTreeInput] = useState('');
  const [parsedTree, setParsedTree] = useState<TreeNode | null>(null);
  const [repoSettings, setRepoSettings] = useState({
    name: '',
    description: '',
    private: false,
    gitignore: 'node',
    license: 'MIT',
    readme: true,
    includeVercelConfig: true,
    includeVercelIgnore: true,
    projectType: 'nextjs'
  });
  const [showRepoOptions, setShowRepoOptions] = useState(false);
  const [editingNode, setEditingNode] = useState<TreeNode | null>(null);
  const [editValue, setEditValue] = useState('');
  const downloadRef = useRef(null);

  // Sample file tree for demonstration
  const sampleTree = `my-nextjs-app/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── .gitignore
├── README.md
├── public/
│   ├── favicon.ico
│   └── images/
│       └── logo.png
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       └── hello/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   └── input.tsx
│   │   └── Header.tsx
│   ├── lib/
│   │   └── utils.ts
│   └── types/
│       └── index.ts
└── tests/
    ├── components/
    │   └── Header.test.tsx
    └── setup.ts`;

  const parseFileTree = (input: string): TreeNode => {
    const lines = input.trim().split('\n');
    const root: TreeNode = { name: '', type: 'folder', children: [], level: -1 };
    const stack: TreeNode[] = [root];

    lines.forEach(line => {
      const trimmed = line.replace(/^[│├└─\s]+/, '');
      if (!trimmed) return;

      const level = (line.length - trimmed.length) / 4;
      const isFolder = trimmed.endsWith('/');
      const name = isFolder ? trimmed.slice(0, -1) : trimmed;

      const node: TreeNode = {
        name,
        type: isFolder ? 'folder' : 'file',
        children: isFolder ? [] : undefined,
        level,
        content: isFolder ? undefined : getDefaultContent(name),
        expanded: true
      };

      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      const parent = stack[stack.length - 1];
      if (parent.children) {
        parent.children.push(node);
      }

      if (isFolder) {
        stack.push(node);
      }
    });

    return root.children?.[0] || { name: 'project', type: 'folder', children: [], level: 0 };
  };

  const getDefaultContent = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const basename = filename.split('.')[0];

    switch (ext) {
      case 'json':
        if (filename === 'package.json') {
          return JSON.stringify({
            "name": repoSettings.name || "my-app",
            "version": "1.0.0",
            "private": true,
            "scripts": {
              "dev": "next dev",
              "build": "next build",
              "start": "next start",
              "lint": "next lint --fix",
              "type-check": "tsc --noEmit"
            },
            "dependencies": {
              "next": "^14.2.29",
              "react": "^18.2.0",
              "react-dom": "^18.2.0",
              "lucide-react": "^0.263.1",
              "typescript": "^5.2.0"
            },
            "devDependencies": {
              "@types/node": "^20.5.0",
              "@types/react": "^18.2.0",
              "@types/react-dom": "^18.2.0",
              "eslint": "^8.50.0",
              "eslint-config-next": "^14.0.0",
              "tailwindcss": "^3.4.0",
              "autoprefixer": "^10.4.16",
              "postcss": "^8.4.32"
            },
            "engines": {
              "node": ">=18.0.0"
            }
          }, null, 2);
        }
        if (filename === 'vercel.json') {
          return JSON.stringify({
            "framework": "nextjs",
            "headers": [
              {
                "source": "/(.*)",
                "headers": [
                  {
                    "key": "X-Frame-Options",
                    "value": "DENY"
                  },
                  {
                    "key": "X-Content-Type-Options",
                    "value": "nosniff"
                  },
                  {
                    "key": "Referrer-Policy",
                    "value": "origin-when-cross-origin"
                  }
                ]
              }
            ]
          }, null, 2);
        }
        return '{}';
      case 'tsx':
      case 'ts':
        if (basename.toLowerCase().includes('layout')) {
          return `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '${repoSettings.name || 'My App'}',
  description: '${repoSettings.description || 'Generated with File Tree Generator'}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`;
        }
        if (basename.toLowerCase() === 'page') {
          return `export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center">
        Welcome to ${repoSettings.name || 'My App'}
      </h1>
      <p className="text-center mt-4 text-gray-600">
        ${repoSettings.description || 'Generated with File Tree Generator'}
      </p>
    </main>
  )
}`;
        }
        return `// ${filename}\nexport {};`;
      case 'js':
        if (filename === 'next.config.js') {
          return `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`;
        }
        return `// ${filename}`;
      case 'css':
        if (filename === 'globals.css') {
          return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`;
        }
        return `/* ${filename} */`;
      case 'md':
        if (filename === 'README.md') {
          return `# ${repoSettings.name || 'My Project'}

${repoSettings.description || 'A project generated with File Tree Generator'}

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.`;
        }
        return `# ${basename}`;
      case 'env':
        return `# Environment variables
NEXT_PUBLIC_APP_NAME="${repoSettings.name || 'My App'}"`;
      case 'vercelignore':
        return `# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage
__tests__/__snapshots__

# Next.js
/.next/
/out/

# Production builds
/build
/dist

# Environment variables
.env*.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/
*.lcov

# NYC test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# next.js build output
.next

# Nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
tmp/
temp/

# Build artifacts
*.tsbuildinfo

# Local Netlify folder
.netlify

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`;
      default:
        return filename.startsWith('.') ? `# ${filename}` : `// ${filename}`;
    }
  };

  const handleParseTree = () => {
    if (!treeInput.trim()) return;
    try {
      const parsed = parseFileTree(treeInput);
      setParsedTree(parsed);
    } catch (error) {
      alert('Error parsing file tree. Please check the format.');
    }
  };

  const generateZip = async () => {
    if (!parsedTree) return;

    // Create a simple zip-like structure for download
    const files = [];
    
    const collectFiles = (node: TreeNode, path: string = '') => {
      const currentPath = path ? `${path}/${node.name}` : node.name;
      
      if (node.type === 'file') {
        files.push({
          path: currentPath,
          content: node.content || getDefaultContent(node.name)
        });
      } else if (node.children) {
        node.children?.forEach(child => collectFiles(child, currentPath));
      }
    };

    collectFiles(parsedTree);

    // Add Vercel-specific files if requested
    if (repoSettings.includeVercelConfig) {
      files.push({
        path: 'vercel.json',
        content: getDefaultContent('vercel.json')
      });
    }

    if (repoSettings.includeVercelIgnore) {
      files.push({
        path: '.vercelignore',
        content: getDefaultContent('.vercelignore')
      });
    }

    // Add deployment instructions
    const deploymentGuide = `# Deployment Guide for ${parsedTree.name || 'Your Project'}

## Vercel Deployment (Recommended)

1. **Push to GitHub:**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/${repoSettings.name || 'your-repo'}.git
   git push -u origin main
   \`\`\`

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the framework settings
   - Click "Deploy"

3. **Environment Variables:**
   ${repoSettings.projectType === 'nextjs' ? `
   Add these in your Vercel dashboard if needed:
   - \`NEXT_PUBLIC_APP_NAME="${repoSettings.name || 'My App'}"\`
   - \`NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"\`
   ` : 'Configure any required environment variables in Vercel dashboard'}

## Local Development

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Build for production:**
   \`\`\`bash
   npm run build
   \`\`\`

## Configuration Notes

${repoSettings.includeVercelConfig ? '✅ vercel.json included with optimized settings' : '❌ vercel.json not included'}
${repoSettings.includeVercelIgnore ? '✅ .vercelignore included for clean deployments' : '❌ .vercelignore not included'}

Your project is configured for: **${repoSettings.projectType.toUpperCase()}**
`;

    files.push({
      path: 'DEPLOYMENT.md',
      content: deploymentGuide
    });

    // Create a text file with all the files and their contents
    let zipContent = `# Generated Project: ${parsedTree.name}\n`;
    zipContent += `Generated on: ${new Date().toISOString()}\n`;
    zipContent += `Project Type: ${repoSettings.projectType}\n`;
    zipContent += `Vercel Ready: ${repoSettings.includeVercelConfig ? 'Yes' : 'No'}\n\n`;
    zipContent += `## Files Generated (${files.length} total)\n\n`;
    
    files.forEach(file => {
      zipContent += `### File: ${file.path}\n\`\`\`\n${file.content}\n\`\`\`\n\n---\n\n`;
    });

    const blob = new Blob([zipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedTree.name || 'project'}-complete.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const TreeNode = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
    const [expanded, setExpanded] = useState(node.expanded !== false);
    const isEditing = editingNode === node;

    const handleEdit = () => {
      setEditingNode(node);
      setEditValue(node.name);
    };

    const handleSave = () => {
      node.name = editValue;
      setEditingNode(null);
      setEditValue('');
    };

    const handleCancel = () => {
      setEditingNode(null);
      setEditValue('');
    };

    return (
      <div className="select-none">
        <div 
          className={`flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer group`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
        >
          {node.type === 'folder' && (
            <button onClick={() => setExpanded(!expanded)} className="p-1">
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          {node.type === 'folder' ? <Folder size={16} className="text-blue-500" /> : <FileText size={16} className="text-gray-500" />}
          
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="px-2 py-1 border rounded text-sm flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
              />
              <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-50 rounded">
                <Save size={12} />
              </button>
              <button onClick={handleCancel} className="p-1 text-red-600 hover:bg-red-50 rounded">
                <X size={12} />
              </button>
            </div>
          ) : (
            <span className="flex-1 text-sm">{node.name}</span>
          )}
          
          <div className="hidden group-hover:flex items-center gap-1">
            <button onClick={handleEdit} className="p-1 text-gray-500 hover:text-blue-500">
              <Edit3 size={12} />
            </button>
          </div>
        </div>
        
        {node.type === 'folder' && expanded && node.children && (
          <div>
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          File Tree Generator
        </h1>
        <p className="text-gray-600 text-lg">
          Transform your file structure into a complete project with generated content
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">File Tree Input</h2>
            <button
              onClick={() => setTreeInput(sampleTree)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Load Sample
            </button>
          </div>
          
          <textarea
            value={treeInput}
            onChange={(e) => setTreeInput(e.target.value)}
            placeholder="Paste your file tree here..."
            className="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            onClick={handleParseTree}
            disabled={!treeInput.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Parse File Tree
          </button>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Project Structure</h2>
          
          {parsedTree ? (
            <div className="border rounded-lg bg-white max-h-64 overflow-y-auto">
              <TreeNode node={parsedTree} />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              Parse a file tree to see the structure preview
            </div>
          )}
        </div>
      </div>

      {/* Repository Settings */}
      {parsedTree && (
        <div className="space-y-6 border-t pt-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Project Settings</h2>
            <button
              onClick={() => setShowRepoOptions(!showRepoOptions)}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              {showRepoOptions ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={repoSettings.name}
                onChange={(e) => setRepoSettings(prev => ({ ...prev, name: e.target.value }))}
                placeholder="my-awesome-project"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={repoSettings.description}
                onChange={(e) => setRepoSettings(prev => ({ ...prev, description: e.target.value }))}
                placeholder="A brief description of your project"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {showRepoOptions && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    value={repoSettings.projectType}
                    onChange={(e) => setRepoSettings(prev => ({ ...prev, projectType: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="nextjs">Next.js</option>
                    <option value="react">React</option>
                    <option value="node">Node.js</option>
                    <option value="static">Static Site</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    .gitignore Template
                  </label>
                  <select
                    value={repoSettings.gitignore}
                    onChange={(e) => setRepoSettings(prev => ({ ...prev, gitignore: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="node">Node.js</option>
                    <option value="react">React</option>
                    <option value="next">Next.js</option>
                    <option value="python">Python</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License
                  </label>
                  <select
                    value={repoSettings.license}
                    onChange={(e) => setRepoSettings(prev => ({ ...prev, license: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MIT">MIT</option>
                    <option value="Apache-2.0">Apache 2.0</option>
                    <option value="GPL-3.0">GPL 3.0</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Project Files</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={repoSettings.readme}
                        onChange={(e) => setRepoSettings(prev => ({ ...prev, readme: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Include README.md</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={repoSettings.private}
                        onChange={(e) => setRepoSettings(prev => ({ ...prev, private: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Private Repository</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Vercel Deployment</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={repoSettings.includeVercelConfig}
                        onChange={(e) => setRepoSettings(prev => ({ ...prev, includeVercelConfig: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Include vercel.json</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={repoSettings.includeVercelIgnore}
                        onChange={(e) => setRepoSettings(prev => ({ ...prev, includeVercelIgnore: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Include .vercelignore</span>
                    </label>
                  </div>
                  
                  {(repoSettings.includeVercelConfig || repoSettings.includeVercelIgnore) && (
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      ✓ Optimized for Vercel deployment with proper build configuration
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {parsedTree && (
        <div className="flex gap-4 pt-6 border-t">
          <button
            onClick={generateZip}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Project Files
          </button>
          
          <button
            onClick={() => alert('Repository initialization coming soon!')}
            className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2"
          >
            <GitBranch size={20} />
            Initialize Repository
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use:</h3>
        <div className="text-blue-800 text-sm space-y-1">
          <p>1. Paste your file tree structure (or click "Load Sample" to see an example)</p>
          <p>2. Click "Parse File Tree" to generate the project structure</p>
          <p>3. Configure your project settings and options</p>
          <p>4. Download the generated files or initialize as a Git repository</p>
        </div>
      </div>
    </div>
  );
};

export default FileTreeGenerator;
