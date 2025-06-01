// src/services/template/TemplateRegistry.ts
import { Template } from '@/types/template';
import { z } from 'zod';

// Validation schema for templates
const TemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['saas', 'ecommerce', 'blog', 'dashboard', 'api', 'mobile']),
  complexity: z.enum(['starter', 'intermediate', 'advanced']),
  features: z.array(z.string()).min(1),
  stack: z.object({
    framework: z.string(),
    styling: z.string(),
    database: z.string().optional(),
    auth: z.string().optional(),
    deployment: z.string(),
    testing: z.string().optional(),
    analytics: z.string().optional(),
  }),
  estimatedTime: z.string(),
  color: z.string(),
  icon: z.string(),
  structure: z.string().min(1),
});

export class TemplateRegistry {
  private templates: Map<string, Template> = new Map();
  private categorizedTemplates: Map<string, Template[]> = new Map();
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.loadCoreTemplates();
      this.buildCategoryIndex();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize template registry:', error);
      throw new Error('Template registry initialization failed');
    }
  }

  private async loadCoreTemplates(): Promise<void> {
    const coreTemplates: Template[] = [
      {
        id: 'nextjs-saas-complete',
        name: 'Complete SaaS Platform',
        description: 'Full-featured SaaS with auth, payments, dashboard, and admin panel',
        category: 'saas',
        complexity: 'advanced',
        features: [
          'NextAuth.js Authentication',
          'Stripe Payment Integration',
          'Prisma Database ORM',
          'Admin Dashboard',
          'User Management',
          'Email Templates',
          'API Routes',
          'TypeScript',
        ],
        stack: {
          framework: 'nextjs',
          styling: 'tailwind',
          database: 'prisma',
          auth: 'nextauth',
          deployment: 'vercel',
          testing: 'vitest',
          analytics: 'vercel-analytics',
        },
        estimatedTime: '2-3 hours setup',
        color: 'from-violet-500 to-purple-600',
        icon: '🚀',
        structure: this.getSaaSStructure(),
      },
      {
        id: 'nextjs-ecommerce-advanced',
        name: 'E-commerce Platform',
        description: 'Modern online store with cart, checkout, and inventory management',
        category: 'ecommerce',
        complexity: 'advanced',
        features: [
          'Product Catalog',
          'Shopping Cart',
          'Stripe Checkout',
          'Inventory Management',
          'Order Tracking',
          'Admin Panel',
          'SEO Optimization',
        ],
        stack: {
          framework: 'nextjs',
          styling: 'tailwind',
          database: 'prisma',
          auth: 'nextauth',
          deployment: 'vercel',
          testing: 'playwright',
        },
        estimatedTime: '3-4 hours setup',
        color: 'from-emerald-500 to-teal-600',
        icon: '🛍️',
        structure: this.getEcommerceStructure(),
      },
      // Additional templates...
    ];

    // Validate and register each template
    for (const template of coreTemplates) {
      await this.registerTemplate(template);
    }
  }

  public async registerTemplate(template: Template): Promise<void> {
    try {
      // Validate template structure
      const validatedTemplate = TemplateSchema.parse(template);
      
      // Check for duplicate IDs
      if (this.templates.has(validatedTemplate.id)) {
        throw new Error(`Template with ID '${validatedTemplate.id}' already exists`);
      }

      // Register the template
      this.templates.set(validatedTemplate.id, validatedTemplate);
      
      // Update category index
      this.addToCategory(validatedTemplate);
      
    } catch (error) {
      throw new Error(`Failed to register template: ${error.message}`);
    }
  }

  public getTemplate(id: string): Template | null {
    if (!this.initialized) {
      throw new Error('Template registry not initialized');
    }
    return this.templates.get(id) || null;
  }

  public getAllTemplates(): Template[] {
    if (!this.initialized) {
      throw new Error('Template registry not initialized');
    }
    return Array.from(this.templates.values());
  }

  public getTemplatesByCategory(category: string): Template[] {
    if (!this.initialized) {
      throw new Error('Template registry not initialized');
    }
    return this.categorizedTemplates.get(category) || [];
  }

  public getTemplatesByComplexity(complexity: Template['complexity']): Template[] {
    return this.getAllTemplates().filter(t => t.complexity === complexity);
  }

  public searchTemplates(query: string): Template[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllTemplates().filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
    );
  }

  public validateTemplate(template: Partial<Template>): { valid: boolean; errors: string[] } {
    try {
      TemplateSchema.parse(template);
      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  }

  private buildCategoryIndex(): void {
    this.categorizedTemplates.clear();
    
    for (const template of this.templates.values()) {
      this.addToCategory(template);
    }
  }

  private addToCategory(template: Template): void {
    const existing = this.categorizedTemplates.get(template.category) || [];
    existing.push(template);
    this.categorizedTemplates.set(template.category, existing);
  }

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
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
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

  // Health check method
  public getRegistryStats() {
    return {
      totalTemplates: this.templates.size,
      categoriesCount: this.categorizedTemplates.size,
      initialized: this.initialized,
      categories: Array.from(this.categorizedTemplates.keys()),
    };
  }
}

// Singleton instance
export const templateRegistry = new TemplateRegistry();
