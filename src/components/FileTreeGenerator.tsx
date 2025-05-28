'use client';

import React, { useState, useRef } from 'react';
import { Download, GitBranch, FileText, Folder, ChevronRight, ChevronDown, Plus, Trash2, Edit3, Save, X, Archive, ExternalLink } from 'lucide-react';

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
  const [isGenerating, setIsGenerating] = useState(false);
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
              "lucide-react": "^0.263.1"
            },
            "devDependencies": {
              "@types/node": "^20.5.0",
              "@types/react": "^18.2.0",
              "@types/react-dom": "^18.2.0",
              "eslint": "^8.50.0",
              "eslint-config-next": "^14.0.0",
              "tailwindcss": "^3.4.0",
              "autoprefixer": "^10.4.16",
              "postcss": "^8.4.32",
              "typescript": "^5.2.0"
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
        if (filename === 'tsconfig.json') {
          return JSON.stringify({
            "compilerOptions": {
              "target": "es5",
              "lib": ["dom", "dom.iterable", "es6"],
              "allowJs": true,
              "skipLibCheck": true,
              "strict": true,
              "noEmit": true,
              "esModuleInterop": true,
              "module": "esnext",
              "moduleResolution": "bundler",
              "resolveJsonModule": true,
              "isolatedModules": true,
              "jsx": "preserve",
              "incremental": true,
              "plugins": [{ "name": "next" }],
              "baseUrl": ".",
              "paths": {
                "@/*": ["./src/*"],
                "@/components/*": ["./src/components/*"],
                "@/lib/*": ["./src/lib/*"],
                "@/types/*": ["./src/types/*"]
              }
            },
            "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
            "exclude": ["node_modules"]
          }, null, 2);
        }
        if (filename === 'tailwind.config.js') {
          return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}`;
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
        if (basename.toLowerCase().includes('button')) {
          return `interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 \${className}\`}
    >
      {children}
    </button>
  );
};`;
        }
        if (basename.toLowerCase().includes('input')) {
          return `interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  value, 
  onChange, 
  placeholder = '', 
  className = '' 
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={\`px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 \${className}\`}
    />
  );
};`;
        }
        if (basename.toLowerCase().includes('header')) {
          return `export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              ${repoSettings.name || 'My App'}
            </h1>
          </div>
          <nav className="flex space-x-8">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}`;
        }
        if (basename.toLowerCase().includes('utils')) {
          return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}`;
        }
        if (basename.toLowerCase().includes('route')) {
          return `import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Hello from ${repoSettings.name || 'My App'}!',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ 
      success: true, 
      data: body 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' }, 
      { status: 400 }
    )
  }
}`;
        }
        if (basename.toLowerCase().includes('test')) {
          return `import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ${basename.replace('.test', '')} from '../${basename.replace('.test', '')}'

describe('${basename.replace('.test', '')}', () => {
  it('renders without crashing', () => {
    render(<${basename.replace('.test', '')} />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})`;
        }
        return `// ${filename}\nexport {};`;
      case 'js':
        if (filename === 'next.config.js') {
          return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    unoptimized: true
  },
  compress: true,
}

module.exports = nextConfig`;
        }
        if (filename === 'postcss.config.js') {
          return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
        }
        return `// ${filename}`;
      case 'css':
        if (filename === 'globals.css') {
          return `@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@layer base {
  :root {
    --foreground-rgb: 0, 0, 0;
    --background-start-rgb: 249, 250, 251;
    --background-end-rgb: 255, 255, 255;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    color: rgb(var(--foreground-rgb));
    background: linear-gradient(
        to bottom,
        transparent,
        rgb(var(--background-end-rgb))
      )
      rgb(var(--background-start-rgb));
    line-height: 1.6;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium transition-colors duration-200;
  }
  
  .input-field {
    @apply w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
}`;
        }
        return `/* ${filename} */`;
      case 'md':
        if (filename === 'README.md') {
          return `# ${repoSettings.name || 'My Project'}

${repoSettings.description || 'A project generated with File Tree Generator'}

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

This project follows Next.js 14 App Router conventions with the following structure:

- \`src/app/\` - App Router pages and layouts
- \`src/components/\` - Reusable React components
- \`src/lib/\` - Utility functions and shared logic
- \`src/types/\` - TypeScript type definitions
- \`public/\` - Static assets

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.`;
        }
        return `# ${basename}

This is a markdown file for ${basename}.`;
      case 'env':
      case 'local':
        return `# Environment variables for local development
NEXT_PUBLIC_APP_NAME="${repoSettings.name || 'My App'}"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"

# Add your environment variables here
# DATABASE_URL=""
# API_KEY=""`;
      case 'gitignore':
        return `# Dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# ESLint cache
.eslintcache

# Temporary folders
tmp/
temp/`;
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

# Dependency directories
node_modules/
jspm_packages/

# dotenv environment variables file
.env

# next.js build output
.next

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

# Temporary folders
tmp/
temp/`;
      case 'ico':
        return ''; // Binary file, will be handled differently
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return ''; // Binary files, will be handled differently
      default:
        if (filename.startsWith('.')) {
          return `# ${filename} configuration file`;
        }
        return `// ${filename}
// Generated by File Tree Generator`;
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

  // Enhanced ZIP generation with proper file structure
  const generateProjectZip = async () => {
    if (!parsedTree) return;

    setIsGenerating(true);
    
    try {
      // Import JSZip dynamically (you'll need to install it: npm install jszip)
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      const collectFiles = (node: TreeNode, path: string = '') => {
        const currentPath = path ? `${path}/${node.name}` : node.name;
        
        if (node.type === 'file') {
          const content = node.content || getDefaultContent(node.name);
          zip.file(currentPath, content);
        } else if (node.children) {
          // Create empty folder
          zip.folder(currentPath);
          node.children.forEach(child => collectFiles(child, currentPath));
        }
      };

      // Add project files
      collectFiles(parsedTree);

      // Add Vercel-specific files if requested
      if (repoSettings.includeVercelConfig) {
        zip.file('vercel.json', getDefaultContent('vercel.json'));
      }

      if (repoSettings.includeVercelIgnore) {
        zip.file('.vercelignore', getDefaultContent('.vercelignore'));
      }

      // Add deployment guide
      const deploymentGuide = `# Deployment Guide for ${parsedTree.name || 'Your Project'}

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Visit:** http://localhost:3000

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
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Environment Variables (if needed):**
   Add these in your Vercel dashboard:
   - \`NEXT_PUBLIC_APP_NAME="${repoSettings.name || 'My App'}"\`
   - \`NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"\`

## Project Configuration

- ✅ Next.js 14 with App Router
- ✅ TypeScript configured
- ✅ Tailwind CSS ready
- ✅ ESLint setup
${repoSettings.includeVercelConfig ? '- ✅ Vercel optimized' : '- ❌ Vercel config not included'}
${repoSettings.includeVercelIgnore ? '- ✅ Deployment ignore rules' : '- ❌ Vercel ignore not included'}

## Next Steps

1. Update the project name and description in \`package.json\`
2. Customize the styling in \`src/app/globals.css\`
3. Add your components in \`src/components/\`
4. Configure environment variables in \`.env.local\`
5. Deploy to Vercel for instant hosting

Happy coding! 🚀
`;

      zip.file('DEPLOYMENT.md', deploymentGuide);

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${parsedTree.name || 'project'}-complete.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating ZIP:', error);
      alert('Error generating project files. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize Git repository (opens GitHub with prefilled data)
  const initializeRepository = () => {
    if (!parsedTree) return;
    
    const repoName = repoSettings.name || parsedTree.name || 'my-project';
    const description = repoSettings.description || 'Generated with File Tree Generator';
    const isPrivate = repoSettings.private;
    
    // Create GitHub repository URL with prefilled data
    const githubUrl = new URL('https://github.com/new');
    githubUrl.searchParams.set('name', repoName);
    githubUrl.searchParams.set('description', description);
    githubUrl.searchParams.set('visibility', isPrivate ? 'private' : 'public');
    githubUrl.searchParams.set('auto_init', 'true');
    
    if (repoSettings.gitignore !== 'none') {
      githubUrl.searchParams.set('gitignore_template', repoSettings.gitignore);
    }
    
    if (repoSettings.license !== 'none') {
      githubUrl.searchParams.set('license_template', repoSettings.license);
    }

    // Open GitHub in new tab
    window.open(githubUrl.toString(), '_blank');
    
    // Show instructions
    alert(`Opening GitHub to create your repository!\n\nNext steps:\n1. Complete the repository creation on GitHub\n2. Clone the repository locally\n3. Extract your downloaded project files\n4. Copy files to your cloned repository\n5. Commit and push your changes\n\nAlternatively, you can create the repository locally with:\ngit init\ngit add .\ngit commit -m "Initial commit"`);
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
        <div className="space-y-4 pt-6 border-t">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={generateProjectZip}
              disabled={isGenerating}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Archive size={20} />
                  Download Project ZIP
                </>
              )}
            </button>
            
            <button
              onClick={initializeRepository}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2"
            >
              <ExternalLink size={20} />
              Create GitHub Repository
            </button>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-amber-800 font-medium text-sm mb-2">📦 Ready to Deploy</h4>
            <p className="text-amber-700 text-sm">
              Your project will include all necessary configuration files for immediate deployment to Vercel. 
              The ZIP contains a complete, production-ready project structure.
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use:</h3>
        <div className="text-blue-800 text-sm space-y-1">
          <p>1. Paste your file tree structure (or click "Load Sample" to see an example)</p>
          <p>2. Click "Parse File Tree" to generate the project structure</p>
          <p>3. Configure your project settings and options</p>
          <p>4. Download the complete project ZIP with all files and content</p>
          <p>5. Optionally create a GitHub repository with the "Create GitHub Repository" button</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">What you get:</h4>
          <div className="text-blue-800 text-sm grid grid-cols-1 md:grid-cols-2 gap-1">
            <p>✅ Complete project structure</p>
            <p>✅ Pre-configured files with content</p>
            <p>✅ Ready-to-run Next.js application</p>
            <p>✅ Deployment instructions included</p>
            <p>✅ TypeScript & Tailwind CSS setup</p>
            <p>✅ Vercel deployment optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTreeGenerator;
