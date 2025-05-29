// src/lib/plugins/nextjs.ts
import { LanguagePlugin } from '@/types/plugin';
import { ProjectSettings } from '@/types/project';

const nextjsPlugin: LanguagePlugin = {
  id: 'nextjs',
  name: 'Next.js',
  description: 'React framework with App Router, TypeScript, and Tailwind CSS',
  version: '1.0.0',
  category: 'fullstack',
  
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  configFiles: ['next.config.js', 'tailwind.config.js', 'tsconfig.json'],
  
  sampleTree: `my-nextjs-app/
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
│   │   ├── loading.tsx
│   │   ├── error.tsx
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
    └── setup.ts`,

  generateContent: (filename: string, settings: ProjectSettings): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const basename = filename.split('.')[0].toLowerCase();

    switch (ext) {
      case 'json':
        return generateNextjsJsonContent(filename, settings);
      case 'tsx':
      case 'ts':
        return generateNextjsTypeScriptContent(filename, settings);
      case 'js':
        return generateNextjsJavaScriptContent(filename, settings);
      case 'css':
        return generateNextjsCssContent(filename, settings);
      case 'md':
        return generateNextjsMarkdownContent(filename, settings);
      default:
        return `// ${filename}\n// Next.js project file\n`;
    }
  },

  dependencies: {
    runtime: [
      'next@^14.2.29',
      'react@^18.2.0',
      'react-dom@^18.2.0',
      'lucide-react@^0.263.1'
    ],
    devDependencies: [
      '@types/node@^20.5.0',
      '@types/react@^18.2.0',
      '@types/react-dom@^18.2.0',
      'eslint@^8.50.0',
      'eslint-config-next@^14.0.0',
      'tailwindcss@^3.4.0',
      'autoprefixer@^10.4.16',
      'postcss@^8.4.32',
      'typescript@^5.2.0'
    ]
  },

  metadata: {
    author: 'File Tree Generator',
    documentation: 'https://nextjs.org/docs',
    tags: ['react', 'ssr', 'typescript', 'tailwind'],
    difficulty: 'intermediate'
  }
};

function generateNextjsJsonContent(filename: string, settings: ProjectSettings): string {
  switch (filename) {
    case 'package.json':
      return JSON.stringify({
        name: settings.name || 'my-nextjs-app',
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint --fix',
          'type-check': 'tsc --noEmit'
        },
        dependencies: {
          next: '^14.2.29',
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          'lucide-react': '^0.263.1'
        },
        devDependencies: {
          '@types/node': '^20.5.0',
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
          eslint: '^8.50.0',
          'eslint-config-next': '^14.0.0',
          tailwindcss: '^3.4.0',
          autoprefixer: '^10.4.16',
          postcss: '^8.4.32',
          typescript: '^5.2.0'
        },
        engines: {
          node: '>=18.0.0'
        }
      }, null, 2);

    case 'tsconfig.json':
      return JSON.stringify({
        compilerOptions: {
          target: 'es5',
          lib: ['dom', 'dom.iterable', 'es6'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*']
          }
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules']
      }, null, 2);

    default:
      return '{}';
  }
}

function generateNextjsTypeScriptContent(filename: string, settings: ProjectSettings): string {
  const basename = filename.split('.')[0].toLowerCase();

  if (basename.includes('layout')) {
    return `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '${settings.name || 'My Next.js App'}',
  description: '${settings.description || 'Generated with File Tree Generator'}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}`;
  }

  if (basename === 'page') {
    return `export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center">
        Welcome to ${settings.name || 'My Next.js App'}
      </h1>
      <p className="text-center mt-4 text-gray-600">
        ${settings.description || 'Generated with File Tree Generator'}
      </p>
    </main>
  )
}`;
  }

  if (basename.includes('button')) {
    return `import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
export { Button }`;
  }

  if (basename.includes('route')) {
    return `import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Hello from ${settings.name || 'My Next.js App'}!',
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

  return `// ${filename}\nexport {};`;
}

function generateNextjsJavaScriptContent(filename: string, settings: ProjectSettings): string {
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig`;
  }

  return `// ${filename}`;
}

function generateNextjsCssContent(filename: string, settings: ProjectSettings): string {
  if (filename === 'globals.css') {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@layer base {
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    line-height: 1.6;
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
}`;
  }
  return `/* ${filename} */`;
}

function generateNextjsMarkdownContent(filename: string, settings: ProjectSettings): string {
  if (filename === 'README.md') {
    return `# ${settings.name || 'My Next.js Project'}

${settings.description || 'A Next.js project generated with File Tree Generator'}

## Getting Started

Install dependencies:
\`\`\`bash
npm install
\`\`\`

Run development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript configured
- ✅ Tailwind CSS styling
- ✅ ESLint setup
- ✅ Production ready

## Deployment

Deploy on [Vercel](https://vercel.com/new) for the best experience.`;
  }
  return `# ${filename.split('.')[0]}`;
}

export default nextjsPlugin;
