// src/lib/deployment-manager.ts
import { ProjectSettings } from '@/types/project';
import { TreeNode } from '@/types/fileTree';

export interface DeploymentPlatform {
  id: 'vercel' | 'netlify' | 'railway' | 'digitalocean';
  name: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  pricing: string;
  setupTime: string;
  supports: string[];
}

export interface DeploymentConfig {
  platform: DeploymentPlatform['id'];
  projectName: string;
  environmentVariables: Record<string, string>;
  buildCommand?: string;
  outputDirectory?: string;
  nodeVersion?: string;
  customDomain?: string;
}

export class DeploymentManager {
  private platforms: Map<string, DeploymentPlatform> = new Map();

  constructor() {
    this.loadPlatforms();
  }

  private loadPlatforms() {
    const platforms: DeploymentPlatform[] = [
      {
        id: 'vercel',
        name: 'Vercel',
        description: 'Optimal for Next.js applications with edge functions',
        icon: '▲',
        color: 'from-black to-gray-800',
        features: ['Edge Functions', 'Analytics', 'Preview Deployments', 'Custom Domains'],
        pricing: 'Free tier available',
        setupTime: '< 2 minutes',
        supports: ['Next.js', 'React', 'Vue', 'Svelte', 'Static Sites']
      },
      {
        id: 'netlify',
        name: 'Netlify',
        description: 'Great for JAMstack and static sites with forms',
        icon: '◆',
        color: 'from-teal-500 to-cyan-600',
        features: ['Forms', 'Identity', 'Functions', 'Split Testing'],
        pricing: 'Free tier available',
        setupTime: '< 3 minutes',
        supports: ['Static Sites', 'React', 'Vue', 'Gatsby', 'Hugo']
      },
      {
        id: 'railway',
        name: 'Railway',
        description: 'Simple deployment for full-stack applications',
        icon: '🚂',
        color: 'from-purple-500 to-pink-600',
        features: ['Database Hosting', 'Auto Deploy', 'Environment Variables', 'Custom Domains'],
        pricing: 'Pay per usage',
        setupTime: '< 5 minutes',
        supports: ['Node.js', 'Python', 'Go', 'Rust', 'Docker']
      },
      {
        id: 'digitalocean',
        name: 'DigitalOcean App Platform',
        description: 'Scalable platform with database integration',
        icon: '🌊',
        color: 'from-blue-500 to-indigo-600',
        features: ['Managed Databases', 'Auto Scaling', 'Load Balancing', 'Monitoring'],
        pricing: 'Starting at $5/month',
        setupTime: '< 10 minutes',
        supports: ['Node.js', 'Python', 'Go', 'Ruby', 'Docker']
      }
    ];

    platforms.forEach(platform => {
      this.platforms.set(platform.id, platform);
    });
  }

  getPlatform(id: string): DeploymentPlatform | undefined {
    return this.platforms.get(id);
  }

  getAllPlatforms(): DeploymentPlatform[] {
    return Array.from(this.platforms.values());
  }

  generateDeploymentConfig(
    platform: DeploymentPlatform['id'],
    settings: ProjectSettings,
    tree: TreeNode
  ): string {
    switch (platform) {
      case 'vercel':
        return this.generateVercelConfig(settings, tree);
      case 'netlify':
        return this.generateNetlifyConfig(settings, tree);
      case 'railway':
        return this.generateRailwayConfig(settings, tree);
      case 'digitalocean':
        return this.generateDigitalOceanConfig(settings, tree);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  generateDeploymentInstructions(
    platform: DeploymentPlatform['id'],
    settings: ProjectSettings
  ): string {
    const platformData = this.getPlatform(platform);
    if (!platformData) {
      throw new Error(`Platform ${platform} not found`);
    }

    switch (platform) {
      case 'vercel':
        return this.generateVercelInstructions(settings, platformData);
      case 'netlify':
        return this.generateNetlifyInstructions(settings, platformData);
      case 'railway':
        return this.generateRailwayInstructions(settings, platformData);
      case 'digitalocean':
        return this.generateDigitalOceanInstructions(settings, platformData);
      default:
        return 'Deployment instructions not available.';
    }
  }

  async deployToVercel(config: DeploymentConfig): Promise<{ url: string; success: boolean }> {
    // This would integrate with Vercel API in a real implementation
    const vercelUrl = `https://vercel.com/new/clone?repository-url=https://github.com/yourusername/${config.projectName}`;
    window.open(vercelUrl, '_blank');
    return { url: vercelUrl, success: true };
  }

  async deployToNetlify(config: DeploymentConfig): Promise<{ url: string; success: boolean }> {
    const netlifyUrl = `https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/${config.projectName}`;
    window.open(netlifyUrl, '_blank');
    return { url: netlifyUrl, success: true };
  }

  async deployToRailway(config: DeploymentConfig): Promise<{ url: string; success: boolean }> {
    const railwayUrl = `https://railway.app/new/template?template=https://github.com/yourusername/${config.projectName}`;
    window.open(railwayUrl, '_blank');
    return { url: railwayUrl, success: true };
  }

  // Configuration generators
  private generateVercelConfig(settings: ProjectSettings, tree: TreeNode): string {
    return JSON.stringify({
      framework: this.detectFramework(tree),
      buildCommand: this.getBuildCommand(tree),
      outputDirectory: this.getOutputDirectory(tree),
      installCommand: "npm install",
      devCommand: "npm run dev",
      env: {
        NEXT_PUBLIC_APP_NAME: settings.name || 'My App',
        NODE_VERSION: "18"
      },
      headers: [
        {
          source: "/(.*)",
          headers: [
            { key: "X-Frame-Options", value: "DENY" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "origin-when-cross-origin" },
            { key: "X-XSS-Protection", value: "1; mode=block" }
          ]
        },
        {
          source: "/_next/static/(.*)",
          headers: [
            { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
          ]
        }
      ],
      redirects: [
        {
          source: "/home",
          destination: "/",
          permanent: true
        }
      ],
      rewrites: [
        {
          source: "/api/:path*",
          destination: "/api/:path*"
        }
      ]
    }, null, 2);
  }

  private generateNetlifyConfig(settings: ProjectSettings, tree: TreeNode): string {
    return `[build]
  publish = "${this.getOutputDirectory(tree)}"
  command = "${this.getBuildCommand(tree)}"

[build.environment]
  NODE_VERSION = "18"
  NEXT_PUBLIC_APP_NAME = "${settings.name || 'My App'}"

[[redirects]]
  from = "/home"
  to = "/"
  status = 301
  force = true

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "origin-when-cross-origin"
    X-XSS-Protection = "1; mode=block"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"`;
  }

  private generateRailwayConfig(settings: ProjectSettings, tree: TreeNode): string {
    return JSON.stringify({
      deploy: {
        startCommand: "npm start",
        buildCommand: this.getBuildCommand(tree),
        healthcheckPath: "/",
        restartPolicyType: "ON_FAILURE",
        restartPolicyMaxRetries: 10
      },
      environments: {
        production: {
          variables: {
            NODE_ENV: "production",
            NEXT_PUBLIC_APP_NAME: settings.name || 'My App'
          }
        }
      }
    }, null, 2);
  }

  private generateDigitalOceanConfig(settings: ProjectSettings, tree: TreeNode): string {
    return `name: ${settings.name || 'my-app'}
services:
- name: web
  source_dir: /
  github:
    repo: yourusername/${settings.name || 'my-app'}
    branch: main
  run_command: npm start
  build_command: ${this.getBuildCommand(tree)}
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_APP_NAME
    value: ${settings.name || 'My App'}
  routes:
  - path: /
alerts:
- rule: DEPLOYMENT_FAILED
- rule: DOMAIN_FAILED`;
  }

  // Instructions generators
  private generateVercelInstructions(settings: ProjectSettings, platform: DeploymentPlatform): string {
    return `# 🚀 Deploy to ${platform.name}

## Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/${settings.name || 'your-repo'}.git
   git push -u origin main
   \`\`\`

2. **Deploy on Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

## Method 2: Vercel CLI

1. **Install Vercel CLI:**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Login and Deploy:**
   \`\`\`bash
   vercel login
   vercel
   \`\`\`

## Environment Variables

Add these in your Vercel dashboard:

- \`NEXT_PUBLIC_APP_NAME\`: ${settings.name || 'My App'}
- \`DATABASE_URL\`: Your database connection string (if applicable)
- \`NEXTAUTH_SECRET\`: Random secret for authentication (if applicable)

## Custom Domain

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Features Included

${platform.features.map(f => `- ✅ ${f}`).join('\n')}

## Performance Tips

- Images are automatically optimized
- Static assets are cached for 1 year
- Edge functions run globally
- Preview deployments for every push

Your app will be available at: \`https://your-project.vercel.app\``;
  }

  private generateNetlifyInstructions(settings: ProjectSettings, platform: DeploymentPlatform): string {
    return `# 🚀 Deploy to ${platform.name}

## Method 1: Git Integration

1. **Push to GitHub/GitLab:**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy on Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Set build command: \`${this.getBuildCommand({ name: 'sample', type: 'folder', level: 0 })}\`
   - Set publish directory: \`${this.getOutputDirectory({ name: 'sample', type: 'folder', level: 0 })}\`
   - Click "Deploy site"

## Method 2: Drag & Drop

1. **Build locally:**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Drag & Drop:**
   - Go to [netlify.com/drop](https://netlify.com/drop)
   - Drag your build folder

## Method 3: Netlify CLI

1. **Install CLI:**
   \`\`\`bash
   npm install -g netlify-cli
   \`\`\`

2. **Deploy:**
   \`\`\`bash
   netlify login
   netlify deploy --prod
   \`\`\`

## Environment Variables

Set in Netlify dashboard under Site Settings > Environment Variables:

- \`NEXT_PUBLIC_APP_NAME\`: ${settings.name || 'My App'}
- \`NODE_VERSION\`: 18

## Forms & Functions

${platform.name} provides:
${platform.features.map(f => `- ✅ ${f}`).join('\n')}

Your app will be available at: \`https://amazing-site-name.netlify.app\``;
  }

  private generateRailwayInstructions(settings: ProjectSettings, platform: DeploymentPlatform): string {
    return `# 🚀 Deploy to ${platform.name}

## Method 1: GitHub Integration

1. **Push to GitHub:**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy on Railway:**
   - Visit [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects your framework

## Method 2: Railway CLI

1. **Install CLI:**
   \`\`\`bash
   npm install -g @railway/cli
   \`\`\`

2. **Login and Deploy:**
   \`\`\`bash
   railway login
   railway deploy
   \`\`\`

## Database Setup

Railway makes databases easy:
- PostgreSQL: \`railway add postgresql\`
- MySQL: \`railway add mysql\`
- Redis: \`railway add redis\`

## Environment Variables

Set in Railway dashboard:
- \`NODE_ENV\`: production
- \`NEXT_PUBLIC_APP_NAME\`: ${settings.name || 'My App'}

## Features

${platform.features.map(f => `- ✅ ${f}`).join('\n')}

## Monitoring

Railway provides built-in:
- Application logs
- Metrics and analytics
- Deployment history
- Resource usage stats

Your app will be available at: \`https://your-app.up.railway.app\``;
  }

  private generateDigitalOceanInstructions(settings: ProjectSettings, platform: DeploymentPlatform): string {
    return `# 🚀 Deploy to ${platform.name}

## Prerequisites

1. Create a DigitalOcean account
2. Have your code in a GitHub repository

## Deployment Steps

1. **Visit DigitalOcean App Platform:**
   - Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"

2. **Connect Repository:**
   - Choose GitHub as source
   - Select your repository
   - Choose branch (usually \`main\`)

3. **Configure Build:**
   - Build Command: \`${this.getBuildCommand({ name: 'sample', type: 'folder', level: 0 })}\`
   - Run Command: \`npm start\`
   - Environment: Node.js

4. **Set Environment Variables:**
   - \`NODE_ENV\`: production
   - \`NEXT_PUBLIC_APP_NAME\`: ${settings.name || 'My App'}

5. **Choose Plan & Deploy:**
   - Select appropriate plan (starts at $5/month)
   - Click "Create Resources"

## Database Integration

Add managed databases easily:
- PostgreSQL
- MySQL
- Redis

## Features

${platform.features.map(f => `- ✅ ${f}`).join('\n')}

## Custom Domain

1. Go to your app settings
2. Add domain in "Domains" section
3. Update DNS records as instructed

Your app will be available at: \`https://your-app-hash.ondigitalocean.app\``;
  }

  // Helper methods
  private detectFramework(tree: TreeNode): string {
    if (this.hasFile(tree, 'next.config.js') || this.hasFile(tree, 'next.config.ts')) {
      return 'nextjs';
    }
    if (this.hasFile(tree, 'vite.config.js') || this.hasFile(tree, 'vite.config.ts')) {
      return 'vite';
    }
    if (this.hasFile(tree, 'nuxt.config.js') || this.hasFile(tree, 'nuxt.config.ts')) {
      return 'nuxtjs';
    }
    if (this.hasFile(tree, 'package.json')) {
      return 'static';
    }
    return 'static';
  }

  private getBuildCommand(tree: TreeNode): string {
    const framework = this.detectFramework(tree);
    switch (framework) {
      case 'nextjs':
        return 'npm run build';
      case 'vite':
        return 'npm run build';
      case 'nuxtjs':
        return 'npm run build';
      default:
        return 'npm run build';
    }
  }

  private getOutputDirectory(tree: TreeNode): string {
    const framework = this.detectFramework(tree);
    switch (framework) {
      case 'nextjs':
        return '.next';
      case 'vite':
        return 'dist';
      case 'nuxtjs':
        return '.output';
      default:
        return 'build';
    }
  }

  private hasFile(tree: TreeNode, filename: string): boolean {
    if (tree.name === filename && tree.type === 'file') {
      return true;
    }
    if (tree.children) {
      return tree.children.some(child => this.hasFile(child, filename));
    }
    return false;
  }
}

export const deploymentManager = new DeploymentManager();
