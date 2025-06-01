// src/services/template/TemplateGenerator.ts
import { z } from 'zod';
import { TreeNode } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';
import { Template } from '@/types/template';
import { templateRegistry } from './TemplateRegistry';
import { inputValidator } from '@/services/security/InputValidator';

// Schema for generation request
const GenerationRequestSchema = z.object({
  templateId: z.string().min(1, 'Template ID is required'),
  settings: z.object({
    name: z.string()
      .min(2, 'Project name must be at least 2 characters')
      .max(50, 'Project name must be less than 50 characters')
      .regex(/^[a-zA-Z0-9-_\s]+$/, 'Project name contains invalid characters'),
    description: z.string().max(200, 'Description must be less than 200 characters').optional(),
    private: z.boolean().default(false),
    gitignore: z.string().default('node'),
    license: z.string().default('MIT'),
    readme: z.boolean().default(true),
    includeVercelConfig: z.boolean().default(true),
    includeVercelIgnore: z.boolean().default(true),
    projectType: z.string().default('nextjs'),
  }),
  configurations: z.record(z.string(), z.any()).default({}),
});

interface GenerationResult {
  tree: TreeNode;
  files: Record<string, string>;
  template: Template;
  metadata: {
    generatedAt: string;
    totalFiles: number;
    totalLines: number;
    totalSize: number;
    generationTime: number;
  };
}

interface GenerationError {
  code: string;
  message: string;
  details?: unknown;
}

export class TemplateGenerator {
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB per file
  private readonly maxTotalFiles = 1000;
  private readonly maxProjectSize = 50 * 1024 * 1024; // 50MB total

  public async generateProject(request: unknown): Promise<GenerationResult> {
    const startTime = performance.now();

    try {
      // Validate input
      const validatedRequest = GenerationRequestSchema.parse(request);
      
      // Additional security validation
      this.validateProjectSettings(validatedRequest.settings);
      
      // Get template
      const template = templateRegistry.getTemplate(validatedRequest.templateId);
      if (!template) {
        throw this.createError('TEMPLATE_NOT_FOUND', `Template '${validatedRequest.templateId}' not found`);
      }

      // Generate project structure
      const tree = this.parseStructureToTree(template.structure, validatedRequest.settings.name);
      
      // Generate files
      const files = await this.generateProjectFiles(template, validatedRequest.settings, validatedRequest.configurations);
      
      // Validate generated content
      this.validateGeneratedContent(files);
      
      const endTime = performance.now();
      const metadata = this.calculateMetadata(files, startTime, endTime);

      return {
        tree,
        files,
        template,
        metadata,
      };

    } catch (error) {
      if (error instanceof z.ZodError) {
        throw this.createError('VALIDATION_ERROR', 'Invalid input parameters', error.errors);
      }
      
      if (error instanceof Error && error.message.includes('TEMPLATE_')) {
        throw error;
      }
      
      throw this.createError('GENERATION_ERROR', 'Failed to generate project', error);
    }
  }

  private validateProjectSettings(settings: ProjectSettings): void {
    // Sanitize project name
    const sanitizedName = inputValidator.sanitizeProjectName(settings.name);
    if (sanitizedName !== settings.name) {
      throw this.createError('INVALID_PROJECT_NAME', 'Project name contains invalid characters');
    }

    // Check for reserved names
    const reservedNames = ['con', 'prn', 'aux', 'nul', 'api', 'www'];
    if (reservedNames.includes(sanitizedName.toLowerCase())) {
      throw this.createError('RESERVED_NAME', 'Project name is reserved');
    }

    // Validate description if provided
    if (settings.description) {
      const sanitizedDescription = inputValidator.sanitizeHtml(settings.description);
      if (sanitizedDescription !== settings.description) {
        throw this.createError('INVALID_DESCRIPTION', 'Description contains invalid content');
      }
    }
  }

  private parseStructureToTree(structure: string, projectName: string): TreeNode {
    const lines = structure.trim().split('\n');
    const root: TreeNode = { 
      name: inputValidator.sanitizeFileName(projectName), 
      type: 'folder', 
      children: [], 
      level: 0 
    };
    const stack: TreeNode[] = [root];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      try {
        const cleaned = line.replace(/[│├└─\s]+/, '');
        const level = Math.floor((line.length - cleaned.length) / 2);
        const isFolder = cleaned.endsWith('/');
        const name = inputValidator.sanitizeFileName(
          isFolder ? cleaned.slice(0, -1) : cleaned
        );

        // Validate file/folder name
        if (!name || name.includes('..') || name.includes('/')) {
          throw new Error(`Invalid file/folder name: ${name}`);
        }

        const node: TreeNode = {
          name,
          type: isFolder ? 'folder' : 'file',
          children: isFolder ? [] : undefined,
          level,
          expanded: true,
        };

        // Maintain proper stack structure
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
      } catch (error) {
        throw this.createError('INVALID_STRUCTURE', `Error parsing structure at line ${i + 1}: ${error.message}`);
      }
    }

    return root;
  }

  private async generateProjectFiles(
    template: Template,
    settings: ProjectSettings,
    configurations: Record<string, any>
  ): Promise<Record<string, string>> {
    const files: Record<string, string> = {};

    try {
      // Core configuration files
      files['package.json'] = this.generatePackageJson(template, settings, configurations);
      files['tsconfig.json'] = this.generateTsConfig();
      files['next.config.js'] = this.generateNextConfig(template, settings);
      files['tailwind.config.js'] = this.generateTailwindConfig();
      
      // Environment and configuration
      files['.env.local'] = this.generateEnvFile(template, settings);
      files['.gitignore'] = this.generateGitignore();
      files['README.md'] = this.generateReadme(template, settings);
      
      // Application files based on template
      const appFiles = this.generateAppFiles(template, settings, configurations);
      Object.assign(files, appFiles);
      
      // Security and deployment files
      files['.github/workflows/ci.yml'] = this.generateGitHubWorkflow();
      files['middleware.ts'] = this.generateSecurityMiddleware();
      
      return files;
    } catch (error) {
      throw this.createError('FILE_GENERATION_ERROR', 'Failed to generate project files', error);
    }
  }

  private generatePackageJson(
    template: Template,
    settings: ProjectSettings,
    configurations: Record<string, any>
  ): string {
    const baseDependencies = {
      next: '^14.2.29',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'lucide-react': '^0.263.1',
    };

    const templateDependencies: Record<string, string> = {};

    // Add dependencies based on template features
    if (template.features.includes('NextAuth.js Authentication')) {
      templateDependencies['next-auth'] = '^4.24.0';
    }
    if (template.features.includes('Stripe Payment Integration')) {
      templateDependencies['stripe'] = '^14.0.0';
      templateDependencies['@stripe/stripe-js'] = '^2.0.0';
    }
    if (template.stack.database === 'prisma') {
      templateDependencies['@prisma/client'] = '^5.0.0';
    }

    // Add configuration-based dependencies
    if (configurations.ui === 'shadcn') {
      templateDependencies['@radix-ui/react-dialog'] = '^1.0.0';
      templateDependencies['class-variance-authority'] = '^0.7.0';
    }

    const packageJson = {
      name: inputValidator.sanitizePackageName(settings.name),
      version: '0.1.0',
      private: true,
      description: settings.description || template.description,
      keywords: template.features.slice(0, 5).map(f => f.toLowerCase().replace(/\s+/g, '-')),
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint --fix',
        'type-check': 'tsc --noEmit',
        test: 'vitest',
        'test:watch': 'vitest --watch',
        'test:coverage': 'vitest --coverage',
        ...(configurations.database === 'prisma' && {
          'db:generate': 'prisma generate',
          'db:push': 'prisma db push',
          'db:migrate': 'prisma migrate dev',
        }),
      },
      dependencies: { ...baseDependencies, ...templateDependencies },
      devDependencies: {
        '@types/node': '^20.5.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        'typescript': '^5.2.0',
        'tailwindcss': '^3.4.0',
        'autoprefixer': '^10.4.16',
        'postcss': '^8.4.32',
        'eslint': '^8.50.0',
        'eslint-config-next': '^14.0.0',
        'vitest': '^0.34.0',
        '@vitejs/plugin-react': '^4.0.0',
        ...(configurations.database === 'prisma' && { prisma: '^5.0.0' }),
      },
      engines: {
        node: '>=18.0.0',
        npm: '>=8.0.0',
      },
    };

    return JSON.stringify(packageJson, null, 2);
  }

  private generateTsConfig(): string {
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
          '@/*': ['./src/*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    }, null, 2);
  }

  private generateNextConfig(template: Template, settings: ProjectSettings): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  images: {
    domains: [],
    unoptimized: false,
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
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig`;
  }

  private generateTailwindConfig(): string {
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
      },
    },
  },
  plugins: [],
}`;
  }

  private generateEnvFile(template: Template, settings: ProjectSettings): string {
    const projectName = inputValidator.sanitizeEnvValue(settings.name);
    
    let env = `# ${projectName} Environment Variables
NEXT_PUBLIC_APP_NAME="${projectName}"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Security
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
`;

    if (template.features.includes('Stripe Payment Integration')) {
      env += `
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
`;
    }

    if (template.stack.database === 'prisma') {
      env += `
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
`;
    }

    return env;
  }

  private generateGitignore(): string {
    return `# Dependencies
node_modules/
/.pnp
.pnp.js

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
`;
  }

  private generateReadme(template: Template, settings: ProjectSettings): string {
    const projectName = inputValidator.sanitizeFileName(settings.name);
    
    return `# ${projectName}

${settings.description || template.description}

## 🚀 Features

${template.features.map(f => `- ✅ ${f}`).join('\n')}

## 🛠️ Tech Stack

- **Framework:** ${template.stack.framework}
- **Styling:** ${template.stack.styling}
- **Database:** ${template.stack.database || 'None'}
- **Authentication:** ${template.stack.auth || 'None'}
- **Deployment:** ${template.stack.deployment}

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
${template.stack.database === 'prisma' ? '- PostgreSQL database' : ''}

## 🚀 Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local with your values
   \`\`\`

${template.stack.database === 'prisma' ? `3. **Set up database:**
   \`\`\`bash
   npm run db:generate
   npm run db:push
   \`\`\`

4. **Run development server:**` : '3. **Run development server:**'}
   \`\`\`bash
   npm run dev
   \`\`\`

${template.stack.database === 'prisma' ? '5.' : '4.'} **Open [http://localhost:3000](http://localhost:3000)**

## 📝 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript type checking
- \`npm run test\` - Run tests
${template.stack.database === 'prisma' ? `- \`npm run db:generate\` - Generate Prisma client
- \`npm run db:push\` - Push schema to database
- \`npm run db:migrate\` - Run database migrations` : ''}

## 🚢 Deployment

This project is optimized for deployment on **${template.stack.deployment}**.

### Deploy to ${template.stack.deployment}

1. Push your code to GitHub
2. Connect your repository to ${template.stack.deployment}
3. Deploy with one click

## 📄 License

This project is licensed under the ${settings.license} License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
`;
  }

  // Additional helper methods...
  private generateAppFiles(template: Template, settings: ProjectSettings, configurations: Record<string, any>): Record<string, string> {
    // This would be expanded based on template type
    return {};
  }

  private generateGitHubWorkflow(): string {
    return `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm run test
    
    - name: Build
      run: npm run build
`;
  }

  private generateSecurityMiddleware(): string {
    return `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  
  // Add security headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}`;
  }

  private validateGeneratedContent(files: Record<string, string>): void {
    let totalSize = 0;
    let fileCount = 0;

    for (const [path, content] of Object.entries(files)) {
      fileCount++;
      
      // Check file count limit
      if (fileCount > this.maxTotalFiles) {
        throw this.createError('TOO_MANY_FILES', `Project exceeds maximum file limit of ${this.maxTotalFiles}`);
      }

      // Check individual file size
      const fileSize = new Blob([content]).size;
      if (fileSize > this.maxFileSize) {
        throw this.createError('FILE_TOO_LARGE', `File ${path} exceeds maximum size of ${this.maxFileSize} bytes`);
      }

      totalSize += fileSize;
      
      // Check total project size
      if (totalSize > this.maxProjectSize) {
        throw this.createError('PROJECT_TOO_LARGE', `Project exceeds maximum size of ${this.maxProjectSize} bytes`);
      }

      // Validate JSON files
      if (path.endsWith('.json')) {
        try {
          JSON.parse(content);
        } catch {
          throw this.createError('INVALID_JSON', `Generated JSON file ${path} is invalid`);
        }
      }

      // Security scan for sensitive content
      this.scanForSensitiveContent(path, content);
    }

    // Ensure required files exist
    const requiredFiles = ['package.json', 'README.md'];
    for (const required of requiredFiles) {
      if (!files[required]) {
        throw this.createError('MISSING_REQUIRED_FILE', `Required file ${required} is missing`);
      }
    }
  }

  private scanForSensitiveContent(path: string, content: string): void {
    const sensitivePatterns = [
      /password\s*=\s*["'][^"']{8,}["']/i,
      /secret\s*=\s*["'][^"']{16,}["']/i,
      /api[_-]?key\s*=\s*["'][^"']{16,}["']/i,
      /token\s*=\s*["'][^"']{16,}["']/i,
      /sk_live_/i,
      /pk_live_/i,
    ];

    for (const pattern of sensitivePatterns) {
      if (pattern.test(content) && !path.includes('.env')) {
        throw this.createError('SENSITIVE_CONTENT', `Potential sensitive content detected in ${path}`);
      }
    }
  }

  private calculateMetadata(files: Record<string, string>, startTime: number, endTime: number) {
    const totalFiles = Object.keys(files).length;
    const totalLines = Object.values(files).reduce((acc, content) => 
      acc + content.split('\n').length, 0
    );
    const totalSize = Object.values(files).reduce((acc, content) => 
      acc + new Blob([content]).size, 0
    );

    return {
      generatedAt: new Date().toISOString(),
      totalFiles,
      totalLines,
      totalSize,
      generationTime: endTime - startTime,
    };
  }

  private createError(code: string, message: string, details?: unknown): GenerationError {
    const error = new Error(message) as Error & GenerationError;
    error.code = code;
    error.message = message;
    error.details = details;
    return error;
  }
}
