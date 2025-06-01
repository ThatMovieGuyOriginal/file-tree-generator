// src/lib/configuration/config-categories.ts
import { Database, Shield, Palette, TestTube } from 'lucide-react';
import { ConfigCategory } from '@/types/configuration';

export const configCategories: ConfigCategory[] = [
  {
    id: 'database',
    name: 'Database',
    icon: Database,
    description: 'Choose your data persistence solution',
    color: 'from-emerald-500 to-teal-600',
    options: [
      { 
        id: 'prisma', 
        name: 'Prisma + PostgreSQL', 
        description: 'Type-safe ORM with migrations and introspection', 
        popular: true,
        features: ['Type Safety', 'Auto Migrations', 'Database Introspection'],
        setup: 'Advanced'
      },
      { 
        id: 'supabase', 
        name: 'Supabase', 
        description: 'Backend-as-a-Service with real-time capabilities', 
        popular: true,
        features: ['Real-time', 'Authentication', 'Edge Functions'],
        setup: 'Simple'
      },
      { 
        id: 'mongodb', 
        name: 'MongoDB', 
        description: 'NoSQL document database for flexible schemas',
        features: ['Document Store', 'Flexible Schema', 'Aggregation'],
        setup: 'Intermediate'
      },
      { 
        id: 'planetscale', 
        name: 'PlanetScale', 
        description: 'Serverless MySQL platform with branching',
        features: ['Database Branching', 'Serverless', 'Schema Changes'],
        setup: 'Intermediate'
      },
      { 
        id: 'none', 
        name: 'No Database', 
        description: 'Skip database setup for static applications',
        features: ['Static Only', 'Fast Deploy', 'No Complexity'],
        setup: 'Simple'
      }
    ]
  },
  {
    id: 'auth',
    name: 'Authentication',
    icon: Shield,
    description: 'Secure user authentication and authorization',
    color: 'from-blue-500 to-indigo-600',
    options: [
      { 
        id: 'nextauth', 
        name: 'NextAuth.js', 
        description: 'Complete authentication solution with multiple providers', 
        popular: true,
        features: ['OAuth Providers', 'JWT/Sessions', 'Database Adapters'],
        setup: 'Intermediate'
      },
      { 
        id: 'clerk', 
        name: 'Clerk', 
        description: 'Drop-in authentication with beautiful UI components', 
        popular: true,
        features: ['Pre-built UI', 'User Management', 'Organizations'],
        setup: 'Simple'
      },
      { 
        id: 'supabase-auth', 
        name: 'Supabase Auth', 
        description: 'Built-in authentication with row-level security',
        features: ['Row Level Security', 'Magic Links', 'Social OAuth'],
        setup: 'Simple'
      },
      { 
        id: 'auth0', 
        name: 'Auth0', 
        description: 'Enterprise-grade authentication and authorization',
        features: ['Enterprise SSO', 'Multi-factor Auth', 'Advanced Rules'],
        setup: 'Advanced'
      },
      { 
        id: 'none', 
        name: 'Custom Auth', 
        description: 'Implement your own authentication system',
        features: ['Full Control', 'Custom Logic', 'No Dependencies'],
        setup: 'Expert'
      }
    ]
  },
  {
    id: 'ui',
    name: 'UI Library',
    icon: Palette,
    description: 'Component library and design system',
    color: 'from-purple-500 to-pink-600',
    options: [
      { 
        id: 'shadcn', 
        name: 'shadcn/ui', 
        description: 'Copy-paste components built on Radix UI primitives', 
        popular: true,
        features: ['Radix Primitives', 'Customizable', 'Accessible'],
        setup: 'Simple'
      },
      { 
        id: 'chakra', 
        name: 'Chakra UI', 
        description: 'Simple, modular and accessible component library',
        features: ['Theme System', 'Dark Mode', 'Responsive'],
        setup: 'Simple'
      },
      { 
        id: 'mantine', 
        name: 'Mantine', 
        description: 'Full-featured React components and hooks library',
        features: ['Rich Components', 'Form Validation', 'Notifications'],
        setup: 'Intermediate'
      },
      { 
        id: 'headless', 
        name: 'Headless UI', 
        description: 'Unstyled, fully accessible UI components',
        features: ['Fully Accessible', 'Unstyled', 'Flexible'],
        setup: 'Intermediate'
      }
    ]
  },
  {
    id: 'testing',
    name: 'Testing',
    icon: TestTube,
    description: 'Testing framework and quality assurance',
    color: 'from-orange-500 to-red-600',
    options: [
      { 
        id: 'vitest', 
        name: 'Vitest', 
        description: 'Blazing fast unit testing framework', 
        popular: true,
        features: ['Fast Execution', 'ESM Support', 'TypeScript'],
        setup: 'Simple'
      },
      { 
        id: 'playwright', 
        name: 'Playwright', 
        description: 'End-to-end testing for modern web applications',
        features: ['Cross-browser', 'Auto-wait', 'Debugging'],
        setup: 'Intermediate'
      },
      { 
        id: 'cypress', 
        name: 'Cypress', 
        description: 'Interactive end-to-end testing with time travel',
        features: ['Time Travel', 'Real Browser', 'Network Stubbing'],
        setup: 'Intermediate'
      },
      { 
        id: 'jest', 
        name: 'Jest', 
        description: 'Delightful JavaScript testing framework',
        features: ['Snapshot Testing', 'Mocking', 'Code Coverage'],
        setup: 'Simple'
      },
      { 
        id: 'none', 
        name: 'Skip Testing', 
        description: 'Add testing setup later in development',
        features: ['Fast Setup', 'Manual QA', 'Add Later'],
        setup: 'Simple'
      }
    ]
  }
];
