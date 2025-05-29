// src/components/Instructions.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Zap, Shield, Rocket } from 'lucide-react';

export const Instructions: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Quick Start */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <BookOpen size={20} />
          How to Use
        </h3>
        <div className="text-blue-800 text-sm space-y-1">
          <p>1. Paste your file tree structure (or click "Load Sample" to see an example)</p>
          <p>2. Click "Parse File Tree" to generate the project structure</p>
          <p>3. Configure your project settings and options</p>
          <p>4. Download the complete project ZIP with all files and content</p>
          <p>5. Optionally create a GitHub repository with the "Create GitHub Repository" button</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
            <Zap size={16} />
            What You Get
          </h4>
          <div className="text-green-800 text-sm space-y-1">
            <p>✅ Complete project structure</p>
            <p>✅ Pre-configured files with intelligent content</p>
            <p>✅ Ready-to-run Next.js application</p>
            <p>✅ TypeScript & Tailwind CSS setup</p>
            <p>✅ ESLint configuration</p>
            <p>✅ VS Code workspace settings</p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
            <Rocket size={16} />
            Deployment Ready
          </h4>
          <div className="text-purple-800 text-sm space-y-1">
            <p>✅ Vercel deployment optimization</p>
            <p>✅ Security headers configured</p>
            <p>✅ Performance optimizations</p>
            <p>✅ Deployment instructions included</p>
            <p>✅ Environment variables template</p>
            <p>✅ Setup automation scripts</p>
          </div>
        </div>
      </div>

      {/* Advanced Features - Collapsible */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection('advanced')}
          className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900"
        >
          {expandedSection === 'advanced' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          Advanced Features & Tips
        </button>

        {expandedSection === 'advanced' && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">File Tree Formats</h5>
                <div className="text-gray-700 text-sm space-y-1">
                  <p>• Standard tree command output</p>
                  <p>• ASCII art tree structures</p>
                  <p>• Custom indented lists</p>
                  <p>• Mixed file/folder notation</p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Smart Content Generation</h5>
                <div className="text-gray-700 text-sm space-y-1">
                  <p>• Framework-specific templates</p>
                  <p>• TypeScript definitions</p>
                  <p>• Configuration files</p>
                  <p>• Component boilerplate</p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Developer Experience</h5>
                <div className="text-gray-700 text-sm space-y-1">
                  <p>• VS Code workspace setup</p>
                  <p>• Automated setup scripts</p>
                  <p>• Linting & formatting</p>
                  <p>• Type checking configured</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => toggleSection('security')}
          className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900"
        >
          {expandedSection === 'security' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <Shield size={20} />
          Security & Performance
        </button>

        {expandedSection === 'security' && (
          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-orange-900 mb-3">Security Features</h5>
                <div className="space-y-2 text-orange-800 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Security headers (CSP, HSTS, X-Frame-Options)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>XSS protection enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Content type sniffing prevention</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Referrer policy configured</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-orange-900 mb-3">Performance Optimizations</h5>
                <div className="space-y-2 text-orange-800 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Static asset caching (1 year)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Compression enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Image optimization ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Code splitting configured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => toggleSection('examples')}
          className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900"
        >
          {expandedSection === 'examples' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          Example File Tree Formats
        </button>

        {expandedSection === 'examples' && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Tree Command Output</h5>
                <pre className="bg-white p-3 rounded border text-xs font-mono overflow-x-auto">
{`my-app/
├── package.json
├── src/
│   ├── app/
│   │   └── page.tsx
│   └── components/
│       └── Header.tsx
└── public/
    └── favicon.ico`}
                </pre>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Simple Indented Format</h5>
                <pre className="bg-white p-3 rounded border text-xs font-mono overflow-x-auto">
{`my-app/
  package.json
  src/
    app/
      page.tsx
    components/
      Header.tsx
  public/
    favicon.ico`}
                </pre>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded border">
              <p className="text-blue-800 text-sm">
                <strong>💡 Pro Tip:</strong> You can generate file trees using the <code className="bg-blue-100 px-1 rounded">tree</code> command:
                <br />
                <code className="bg-blue-100 px-1 rounded mt-1 inline-block">tree -I 'node_modules|.git|.next' &gt; structure.txt</code>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">~30s</div>
            <div className="text-sm opacity-90">Setup Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm opacity-90">Production Ready</div>
          </div>
          <div>
            <div className="text-2xl font-bold">A+</div>
            <div className="text-sm opacity-90">Security Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm opacity-90">Config Needed</div>
          </div>
        </div>
      </div>
    </div>
  );
};
