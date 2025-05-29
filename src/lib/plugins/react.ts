// src/lib/plugins/react.ts
import { LanguagePlugin } from '@/types/plugin';
import { ProjectSettings } from '@/types/project';

const reactPlugin: LanguagePlugin = {
  id: 'react',
  name: 'React + Vite',
  description: 'Modern React app with Vite, TypeScript, and Tailwind CSS',
  version: '1.0.0',
  category: 'frontend',
  
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  configFiles: ['vite.config.ts', 'tailwind.config.js', 'tsconfig.json'],
  
  sampleTree: `my-react-app/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .env
├── .gitignore
├── README.md
├── index.html
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── logo.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── Layout.tsx
│   │   └── Header.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── hooks/
│   │   └── useCounter.ts
│   ├── lib/
│   │   └── utils.ts
│   └── types/
│       └── index.ts
└── tests/
    ├── App.test.tsx
    └── setup.ts`,

  generateContent: (filename: string, settings: ProjectSettings): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const basename = filename.split('.')[0].toLowerCase();

    switch (ext) {
      case 'json':
        return generateReactJsonContent(filename, settings);
      case 'tsx':
      case 'ts':
        return generateReactTypeScriptContent(filename, settings);
      case 'js':
        return generateReactJavaScriptContent(filename, settings);
      case 'css':
        return generateReactCssContent(filename, settings);
      case 'html':
        return generateReactHtmlContent(filename, settings);
      case 'md':
        return generateReactMarkdownContent(filename, settings);
      default:
        return `// ${filename}\n// React project file\n`;
    }
  },

  dependencies: {
    runtime: [
      'react@^18.2.0',
      'react-dom@^18.2.0',
      'react-router-dom@^6.8.0',
      'lucide-react@^0.263.1'
    ],
    devDependencies: [
      '@types/react@^18.2.0',
      '@types/react-dom@^18.2.0',
      '@vitejs/plugin-react@^4.0.0',
      'vite@^4.4.0',
      'tailwindcss@^3.4.0',
      'autoprefixer@^10.4.16',
      'postcss@^8.4.32',
      'typescript@^5.2.0',
      '@testing-library/react@^13.4.0',
      '@testing-library/jest-dom@^5.16.5',
      'vitest@^0.34.0'
    ]
  },

  metadata: {
    author: 'File Tree Generator',
    documentation: 'https://vitejs.dev/guide/',
    tags: ['react', 'vite', 'typescript', 'tailwind'],
    difficulty: 'beginner'
  }
};

function generateReactJsonContent(filename: string, settings: ProjectSettings): string {
  switch (filename) {
    case 'package.json':
      return JSON.stringify({
        name: settings.name || 'my-react-app',
        private: true,
        version: '0.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'tsc && vite build',
          lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
          preview: 'vite preview',
          test: 'vitest'
        },
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          'react-router-dom': '^6.8.0',
          'lucide-react': '^0.263.1'
        },
        devDependencies: {
          '@types/react': '^18.2.15',
          '@types/react-dom': '^18.2.7',
          '@typescript-eslint/eslint-plugin': '^6.0.0',
          '@typescript-eslint/parser': '^6.0.0',
          '@vitejs/plugin-react': '^4.0.3',
          'eslint': '^8.45.0',
          'eslint-plugin-react-hooks': '^4.6.0',
          'eslint-plugin-react-refresh': '^0.4.3',
          'typescript': '^5.0.2',
          'vite': '^4.4.5',
          'tailwindcss': '^3.4.0',
          'autoprefixer': '^10.4.16',
          'postcss': '^8.4.32',
          '@testing-library/react': '^13.4.0',
          '@testing-library/jest-dom': '^5.16.5',
          'vitest': '^0.34.0',
          'jsdom': '^22.1.0'
        }
      }, null, 2);

    case 'tsconfig.json':
      return JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          useDefineForClassFields: true,
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*']
          }
        },
        include: ['src'],
        references: [{ path: './tsconfig.node.json' }]
      }, null, 2);

    default:
      return '{}';
  }
}

function generateReactTypeScriptContent(filename: string, settings: ProjectSettings): string {
  const basename = filename.split('.')[0];

  if (basename === 'main') {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
  }

  if (basename === 'App') {
    return `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App`;
  }

  if (basename === 'Layout') {
    return `import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}`;
  }

  if (basename === 'Header') {
    return `import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              ${settings.name || 'My React App'}
            </h1>
          </div>
          <nav className="flex space-x-8">
            <Link to="/" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <Link to="/about" className="text-gray-500 hover:text-gray-900">
              About
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-900">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}`;
  }

  if (basename === 'Button') {
    return `import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
    }
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    }

    return (
      <button
        className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${className}\`}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
export default Button`;
  }

  if (basename === 'Home') {
    return `export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to ${settings.name || 'My React App'}
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        ${settings.description || 'A modern React application built with Vite'}
      </p>
      <div className="space-x-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Get Started
        </button>
        <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50">
          Learn More
        </button>
      </div>
    </div>
  )
}`;
  }

  return `// ${filename}\nexport {};`;
}

function generateReactJavaScriptContent(filename: string, settings: ProjectSettings): string {
  if (filename === 'vite.config.ts') {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})`;
  }

  if (filename === 'tailwind.config.js') {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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

  return `// ${filename}`;
}

function generateReactCssContent(filename: string, settings: ProjectSettings): string {
  if (filename === 'index.css') {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
}`;
  }

  if (filename === 'App.css') {
    return `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}`;
  }

  return `/* ${filename} */`;
}

function generateReactHtmlContent(filename: string, settings: ProjectSettings): string {
  if (filename === 'index.html') {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${settings.name || 'My React App'}</title>
    <meta name="description" content="${settings.description || 'A modern React application'}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }
  return `<!-- ${filename} -->`;
}

function generateReactMarkdownContent(filename: string, settings: ProjectSettings): string {
  if (filename === 'README.md') {
    return `# ${settings.name || 'My React Project'}

${settings.description || 'A modern React application built with Vite'}

## Features

- ⚡️ Vite for lightning fast builds
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS for styling
- 🧭 React Router for navigation
- 🧪 Vitest for testing
- 🔍 ESLint for code linting

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Visit:** http://localhost:3000

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint
- \`npm run test\` - Run tests

## Deployment

### Vercel
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Deploy dist/ folder to Netlify
\`\`\`

## Project Structure

- \`src/components/\` - Reusable components
- \`src/pages/\` - Page components
- \`src/hooks/\` - Custom hooks
- \`src/lib/\` - Utility functions
- \`src/types/\` - TypeScript types`;
  }
  return `# ${filename.split('.')[0]}`;
}

export default reactPlugin;
