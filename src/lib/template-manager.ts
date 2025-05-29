// src/lib/template-manager.ts
import { ProjectSettings } from '@/types/project';
import { TreeNode } from '@/types/fileTree';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'saas' | 'ecommerce' | 'blog' | 'dashboard' | 'api' | 'mobile';
  complexity: 'starter' | 'intermediate' | 'advanced';
  features: string[];
  stack: StackConfiguration;
  estimatedTime: string;
  structure: string;
  color: string;
  icon: string;
}

export interface StackConfiguration {
  framework: 'nextjs' | 'react' | 'vue' | 'nuxt' | 'svelte' | 'astro';
  styling: 'tailwind' | 'styled-components' | 'emotion' | 'scss' | 'vanilla';
  database?: 'prisma' | 'supabase' | 'mongodb' | 'planetscale' | 'neon';
  auth?: 'nextauth' | 'clerk' | 'supabase-auth' | 'auth0' | 'firebase-auth';
  deployment: 'vercel' | 'netlify' | 'railway' | 'digitalocean';
  testing?: 'vitest' | 'jest' | 'playwright' | 'cypress';
  analytics?: 'ga4' | 'plausible' | 'mixpanel' | 'posthog';
}

export class TemplateManager {
  private templates: Map<string, Template> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates() {
    const templates: Template[] = [
      {
        id: 'nextjs-saas-complete',
        name: 'Complete SaaS Platform',
        description: 'Full-featured SaaS with auth, payments, dashboard, and admin panel',
        category: 'saas',
        complexity: 'advanced',
        features: ['Authentication', 'Stripe Payments', 'Database', 'Admin Dashboard', 'User Management', 'Email Templates'],
        stack: {
          framework: 'nextjs',
          styling: 'tailwind',
          database: 'prisma',
          auth: 'nextauth',
          deployment: 'vercel',
          testing: 'vitest',
          analytics: 'ga4'
        },
        estimatedTime: '2-3 hours setup',
        color: 'from-violet-500 to-purple-600',
        icon: '🚀',
        structure: this.getSaaSStructure()
      },
      {
        id: 'nextjs-ecommerce-advanced',
        name: 'E-commerce Platform',
        description: 'Modern online store with cart, checkout, and inventory management',
        category: 'ecommerce',
        complexity: 'advanced',
        features: ['Product Catalog', 'Shopping Cart', 'Stripe Checkout', 'Inventory Tracking', 'Order Management'],
        stack: {
          framework: 'nextjs',
          styling: 'tailwind',
          database: 'prisma',
          auth: 'nextauth',
          deployment: 'vercel',
          testing: 'playwright'
        },
        estimatedTime: '3-4 hours setup',
        color: 'from-emerald-500 to-teal-600',
        icon: '🛍️',
        structure: this.getEcommerceStructure()
      },
      {
        id: 'react-dashboard-pro',
        name: 'Analytics Dashboard',
        description: 'Professional dashboard with charts, real-time data, and reporting',
        category: 'dashboard',
        complexity: 'intermediate',
        features: ['Real-time Charts', 'Data Visualization', 'Export Reports', 'User Roles'],
        stack: {
          framework: 'react',
          styling: 'tailwind',
          database: 'supabase',
          auth: 'supabase-auth',
          deployment: 'netlify',
          testing: 'vitest'
        },
        estimatedTime: '1-2 hours setup',
        color: 'from-blue-500 to-cyan-600',
        icon: '📊',
        structure: this.getDashboardStructure()
      },
      {
        id: 'nextjs-blog-cms',
        name: 'Blog & CMS Platform',
        description: 'Content management system with markdown, SEO, and admin interface',
        category: 'blog',
        complexity: 'intermediate',
        features: ['MDX Support', 'SEO Optimization', 'Admin Panel', 'Comment System', 'Newsletter'],
        stack: {
          framework: 'nextjs',
          styling: 'tailwind',
          database: 'prisma',
          auth: 'nextauth',
          deployment: 'vercel',
          analytics: 'plausible'
        },
        estimatedTime: '1-2 hours setup',
        color: 'from-orange-500 to-red-600',
        icon: '📝',
        structure: this.getBlogStructure()
      },
      {
        id: 'fastapi-backend',
        name: 'FastAPI Backend',
        description: 'High-performance REST API with authentication and database',
        category: 'api',
        complexity: 'intermediate',
        features: ['REST API', 'JWT Auth', 'Database ORM', 'API Documentation', 'Rate Limiting'],
        stack: {
          framework: 'nextjs', // This would be 'fastapi' but keeping nextjs for now
          styling: 'tailwind',
          database: 'prisma',
          deployment: 'railway',
          testing: 'pytest' as any
        },
        estimatedTime: '1 hour setup',
        color: 'from-green-500 to-emerald-600',
        icon: '⚡',
        structure: this.getAPIStructure()
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  getTemplate(id: string): Template | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: Template['category']): Template[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }

  generateProjectFromTemplate(
    templateId: string, 
    settings: ProjectSettings,
    customConfigurations?: Record<string, any>
  ): { tree: TreeNode; files: Record<string, string> } {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const tree = this.parseStructureToTree(template.structure, settings.name || 'my-project');
    const files = this.generateTemplateFiles(template, settings, customConfigurations);

    return { tree, files };
  }

  private parseStructureToTree(structure: string, projectName: string): TreeNode {
    const lines = structure.trim().split('\n');
    const root: TreeNode = { name: projectName, type: 'folder', children: [], level: 0 };
    const stack: TreeNode[] = [root];

    lines.forEach(line => {
      if (!line.trim()) return;

      const cleaned = line.replace(/[│├└─\s]+/, '');
      const level = (line.length - cleaned.length) / 2;
      const isFolder = cleaned.endsWith('/');
      const name = isFolder ? cleaned.slice(0, -1) : cleaned;

      const node: TreeNode = {
        name,
        type: isFolder ? 'folder' : 'file',
        children: isFolder ? [] : undefined,
        level,
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

    return root;
  }

  private generateTemplateFiles(
    template: Template,
    settings: ProjectSettings,
    customConfigurations?: Record<string, any>
  ): Record<string, string> {
    const files: Record<string, string> = {};
    const config = { ...template.stack, ...customConfigurations };

    // Generate package.json based on template
    files['package.json'] = this.generatePackageJson(template, settings);
    
    // Generate configuration files
    if (config.framework === 'nextjs') {
      files['next.config.js'] = this.generateNextConfig(template);
      files['tsconfig.json'] = this.generateTsConfig();
    }

    if (config.styling === 'tailwind') {
      files['tailwind.config.js'] = this.generateTailwindConfig();
      files['postcss.config.js'] = this.generatePostCSSConfig();
    }

    // Generate core application files based on template type
    switch (template.category) {
      case 'saas':
        Object.assign(files, this.generateSaaSFiles(settings, config));
        break;
      case 'ecommerce':
        Object.assign(files, this.generateEcommerceFiles(settings, config));
        break;
      case 'dashboard':
        Object.assign(files, this.generateDashboardFiles(settings, config));
        break;
      case 'blog':
        Object.assign(files, this.generateBlogFiles(settings, config));
        break;
    }

    // Generate common files
    files['.env.local'] = this.generateEnvFile(template, settings);
    files['README.md'] = this.generateReadme(template, settings);
    files['.gitignore'] = this.generateGitignore();

    return files;
  }

  // Template structures
  private getSaaSStructure(): string {
    return `my-saas-app/
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
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── billing/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   └── users/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── route.ts
│   │       ├── users/
│   │       │   └── route.ts
│   │       └── payments/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── admin/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── payments.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── prisma/
│   └── schema.prisma
└── tests/
    └── setup.ts`;
  }

  private getEcommerceStructure(): string {
    return `my-store/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── products/
│   │       └── orders/
│   ├── components/
│   │   ├── product/
│   │   ├── cart/
│   │   └── checkout/
│   └── lib/
│       ├── stripe.ts
│       └── inventory.ts
└── prisma/
    └── schema.prisma`;
  }

  private getDashboardStructure(): string {
    return `my-dashboard/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── charts/
│   │   ├── tables/
│   │   └── widgets/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   └── Analytics.tsx
│   └── lib/
│       └── api.ts
└── tests/`;
  }

  private getBlogStructure(): string {
    return `my-blog/
├── package.json
├── next.config.js
├── tailwind.config.js
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── posts/
│   ├── components/
│   │   ├── blog/
│   │   └── admin/
│   └── content/
│       └── posts/
├── prisma/
│   └── schema.prisma
└── tests/`;
  }

  private getAPIStructure(): string {
    return `my-api/
├── requirements.txt
├── main.py
├── src/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── tests/
├── docs/
└── Dockerfile`;
  }

  // File generators
  private generatePackageJson(template: Template, settings: ProjectSettings): string {
    const baseDeps = {
      next: '^14.2.29',
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    };

    const templateDeps: Record<string, string> = {};

    // Add dependencies based on template features
    if (template.features.includes('Authentication')) {
      templateDeps['next-auth'] = '^4.24.0';
    }
    if (template.features.includes('Stripe Payments')) {
      templateDeps['stripe'] = '^14.0.0';
      templateDeps['@stripe/stripe-js'] = '^2.0.0';
    }
    if (template.stack.database === 'prisma') {
      templateDeps['@prisma/client'] = '^5.0.0';
    }

    return JSON.stringify({
      name: settings.name || template.name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: { ...baseDeps, ...templateDeps },
      devDependencies: {
        '@types/node': '^20.5.0',
        '@types/react': '^18.2.0',
        typescript: '^5.2.0',
        tailwindcss: '^3.4.0'
      }
    }, null, 2);
  }

  private generateSaaSFiles(settings: ProjectSettings, config: StackConfiguration): Record<string, string> {
    return {
      'src/app/page.tsx': `export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to ${settings.name || 'Your SaaS'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ${settings.description || 'The complete SaaS platform for modern businesses'}
          </p>
          <div className="space-x-4">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700">
              Get Started
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}`,
      'src/app/dashboard/page.tsx': `import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function Dashboard() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-green-600">$12,345</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Growth</h3>
          <p className="text-3xl font-bold text-purple-600">+23%</p>
        </div>
      </div>
    </div>
  );
}`
    };
  }

  private generateEcommerceFiles(settings: ProjectSettings, config: StackConfiguration): Record<string, string> {
    return {
      'src/app/page.tsx': `export default function Home() {
  return (
    <main>
      <section className="hero bg-gradient-to-r from-purple-500 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">${settings.name || 'Your Store'}</h1>
          <p className="text-xl mb-8">${settings.description || 'Discover amazing products'}</p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Shop Now
          </button>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product grid will go here */}
          </div>
        </div>
      </section>
    </main>
  );
}`
    };
  }

  private generateDashboardFiles(settings: ProjectSettings, config: StackConfiguration): Record<string, string> {
    return {
      'src/App.tsx': `import React from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
}

export default App;`,
      'src/pages/Dashboard.tsx': `import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">${settings.name || 'Analytics Dashboard'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">$45,231.89</p>
          <p className="text-xs text-green-600">+20.1% from last month</p>
        </div>
        {/* More dashboard widgets */}
      </div>
    </div>
  );
}`
    };
  }

  private generateBlogFiles(settings: ProjectSettings, config: StackConfiguration): Record<string, string> {
    return {
      'src/app/page.tsx': `export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">${settings.name || 'My Blog'}</h1>
        <p className="text-xl text-gray-600">${settings.description || 'Thoughts, stories and ideas'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Blog posts will be rendered here */}
      </div>
    </main>
  );
}`
    };
  }

  // Configuration generators
  private generateNextConfig(template: Template): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    unoptimized: false
  },
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;`;
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
        paths: { '@/*': ['./src/*'] }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    }, null, 2);
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
      }
    },
  },
  plugins: [],
}`;
  }

  private generatePostCSSConfig(): string {
    return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
  }

  private generateEnvFile(template: Template, settings: ProjectSettings): string {
    let env = `# ${settings.name || template.name} Environment Variables
NEXT_PUBLIC_APP_NAME="${settings.name || template.name}"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
`;

    if (template.features.includes('Authentication')) {
      env += `
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
`;
    }

    if (template.features.includes('Stripe Payments')) {
      env += `
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
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

  private generateReadme(template: Template, settings: ProjectSettings): string {
    return `# ${settings.name || template.name}

${settings.description || template.description}

## Features

${template.features.map(f => `- ✅ ${f}`).join('\n')}

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

3. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open [http://localhost:3000](http://localhost:3000)**

## Tech Stack

- **Framework:** ${template.stack.framework.toUpperCase()}
- **Styling:** ${template.stack.styling}
- **Database:** ${template.stack.database || 'None'}
- **Authentication:** ${template.stack.auth || 'None'}
- **Deployment:** ${template.stack.deployment}

## Deployment

This project is optimized for deployment on **${template.stack.deployment}**.

### Deploy to ${template.stack.deployment}

1. Push your code to GitHub
2. Connect your repository to ${template.stack.deployment}
3. Deploy with one click

## License

MIT License
`;
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
next-env.d.ts`;
  }
}

export const templateManager = new TemplateManager();
