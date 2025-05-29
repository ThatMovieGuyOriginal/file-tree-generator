// src/lib/zipGenerator.ts
import { TreeNode } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';
import { generateFileContent } from './contentGenerator';

export const generateProjectZip = async (parsedTree: TreeNode, settings: ProjectSettings) => {
  // Import JSZip dynamically
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  
  // Collect all files from the tree
  const collectFiles = (node: TreeNode, path: string = '') => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    
    if (node.type === 'file') {
      const content = node.content || generateFileContent(node.name, settings);
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
  if (settings.includeVercelConfig) {
    zip.file('vercel.json', generateVercelConfig(settings));
  }

  if (settings.includeVercelIgnore) {
    zip.file('.vercelignore', generateFileContent('.vercelignore', settings));
  }

  // Add enhanced deployment guide
  zip.file('DEPLOYMENT.md', generateDeploymentGuide(parsedTree, settings));

  // Add development setup script
  zip.file('setup.sh', generateSetupScript(settings));

  // Add VS Code configuration
  zip.file('.vscode/settings.json', generateVSCodeSettings());
  zip.file('.vscode/extensions.json', generateVSCodeExtensions());

  // Generate the zip file
  const zipBlob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  
  // Create download link
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${parsedTree.name || 'project'}-complete.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const generateVercelConfig = (settings: ProjectSettings): string => {
  return JSON.stringify({
    framework: settings.projectType === 'nextjs' ? 'nextjs' : 'static',
    regions: ['iad1'],
    env: {
      NEXT_PUBLIC_APP_NAME: settings.name || 'My App'
    },
    headers: [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ],
    redirects: [
      {
        source: '/home',
        destination: '/',
        permanent: true
      }
    ]
  }, null, 2);
};

const generateDeploymentGuide = (parsedTree: TreeNode, settings: ProjectSettings): string => {
  return `# 🚀 Deployment Guide for ${parsedTree.name || 'Your Project'}

## Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

### 3. Visit Your App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deploy to Vercel (Recommended)

### Option 1: GitHub Integration (Recommended)
1. **Push to GitHub:**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/${settings.name || 'your-repo'}.git
   git push -u origin main
   \`\`\`

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

### Option 2: Vercel CLI
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## 🚀 Alternative Deployment Options

### Netlify
1. Build your project: \`npm run build\`
2. Drag and drop the \`out\` folder to [netlify.com/drop](https://netlify.com/drop)

### Railway
1. Install Railway CLI: \`npm install -g @railway/cli\`
2. Login: \`railway login\`
3. Deploy: \`railway up\`

### DigitalOcean App Platform
1. Connect your GitHub repository
2. Select Node.js environment
3. Set build command: \`npm run build\`
4. Set run command: \`npm start\`

## 🔧 Environment Variables

Add these to your deployment platform:

### Required
- \`NEXT_PUBLIC_APP_NAME="${settings.name || 'My App'}"\`
- \`NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"\`

### Optional (add as needed)
- \`DATABASE_URL=""\`
- \`API_KEY=""\`
- \`JWT_SECRET=""\`

## 📊 Project Configuration

- ✅ Next.js ${settings.projectType === 'nextjs' ? '14 with App Router' : 'configured'}
- ✅ TypeScript configured with strict mode
- ✅ Tailwind CSS with custom design system
- ✅ ESLint with Next.js recommended rules
- ✅ Performance optimizations enabled
${settings.includeVercelConfig ? '- ✅ Vercel deployment optimized' : '- ❌ Vercel config not included'}
${settings.includeVercelIgnore ? '- ✅ Deployment ignore rules configured' : '- ❌ Vercel ignore not included'}
- ✅ Security headers configured
- ✅ PWA ready (add manifest.json for full PWA)

## 🎯 Next Steps

### Development
1. [ ] Update project details in \`package.json\`
2. [ ] Customize styling in \`src/app/globals.css\`
3. [ ] Add your components in \`src/components/\`
4. [ ] Configure environment variables in \`.env.local\`
5. [ ] Set up your database (if needed)

### Production
1. [ ] Set up monitoring (Sentry, LogRocket, etc.)
2. [ ] Configure analytics (Google Analytics, Plausible, etc.)
3. [ ] Set up error tracking
4. [ ] Configure automated testing
5. [ ] Set up CI/CD pipeline

## 🔍 Performance Tips

- Use Next.js Image component for optimized images
- Implement proper SEO with metadata
- Use dynamic imports for code splitting
- Configure caching strategies
- Monitor Core Web Vitals

## 🛡️ Security Checklist

- [x] Security headers configured
- [x] Environment variables properly set
- [ ] Authentication implemented (if needed)
- [ ] Rate limiting configured (if needed)
- [ ] Input validation implemented
- [ ] CSRF protection enabled (if needed)

## 📞 Support

Need help? Check out these resources:
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

Happy coding! 🎉
`;
};

const generateSetupScript = (settings: ProjectSettings): string => {
  return `#!/bin/bash

# ${settings.name || 'Project'} Setup Script
# This script sets up your development environment

echo "🚀 Setting up ${settings.name || 'your project'}..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then 
    echo "✅ Node.js version $NODE_VERSION is compatible"
else
    echo "❌ Node.js version $NODE_VERSION is too old. Please update to 18+ "
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local 2>/dev/null || echo "NEXT_PUBLIC_APP_NAME=\"${settings.name || 'My App'}\"" > .env.local
fi

# Run type check
echo "🔍 Running type check..."
npm run type-check

# Run linting
echo "🧹 Running ESLint..."
npm run lint

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Update .env.local with your environment variables"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Useful commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run start        - Start production server"
echo "  npm run lint         - Run ESLint"
echo "  npm run type-check   - Run TypeScript type checking"
echo ""
echo "Happy coding! 🎉"
`;
};

const generateVSCodeSettings = (): string => {
  return JSON.stringify({
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "typescript.preferences.importModuleSpecifier": "relative",
    "emmet.includeLanguages": {
      "typescript": "html",
      "typescriptreact": "html"
    },
    "files.associations": {
      "*.css": "tailwindcss"
    },
    "editor.quickSuggestions": {
      "strings": true
    },
    "tailwindCSS.includeLanguages": {
      "typescript": "html",
      "typescriptreact": "html"
    },
    "css.validate": false,
    "less.validate": false,
    "scss.validate": false
  }, null, 2);
};

const generateVSCodeExtensions = (): string => {
  return JSON.stringify({
    "recommendations": [
      "bradlc.vscode-tailwindcss",
      "esbenp.prettier-vscode",
      "ms-vscode.vscode-typescript-next",
      "formulahendry.auto-rename-tag",
      "christian-kohler.path-intellisense",
      "ms-vscode.vscode-json",
      "bradlc.vscode-tailwindcss",
      "dbaeumer.vscode-eslint"
    ]
  }, null, 2);
};
