// src/components/FileTreeGenerator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Settings, Eye, Rocket } from 'lucide-react';
import { TreeNode as TreeNodeType } from '@/types/fileTree';
import { ProjectSettings } from '@/types/project';
import { templateManager, Template } from '@/lib/template-manager';
import { deploymentManager, DeploymentPlatform } from '@/lib/deployment-manager';
import { EnhancedPreview } from './preview/EnhancedPreview';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardNavigation } from './wizard/WizardNavigation';
import { TemplateSelection } from './wizard/TemplateSelection';
import { ProjectConfiguration } from './wizard/ProjectConfiguration';
import { ProjectPreview } from './wizard/ProjectPreview';
import { ProjectGeneration } from './wizard/ProjectGeneration';
import { getDeploymentUrl } from '@/lib/utils/deployment-utils';

const FileTreeGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('nextjs-saas-complete');
  const [configurations, setConfigurations] = useState<Record<string, any>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<{
    tree: TreeNodeType;
    files: Record<string, string>;
    template: Template;
  } | null>(null);
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
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

  const [templates, setTemplates] = useState<Template[]>([]);
  const [deploymentPlatforms, setDeploymentPlatforms] = useState<DeploymentPlatform[]>([]);

  const steps = [
    { id: 'template', name: 'Choose Template', icon: Sparkles },
    { id: 'configure', name: 'Configure', icon: Settings },
    { id: 'preview', name: 'Preview', icon: Eye },
    { id: 'generate', name: 'Generate', icon: Rocket }
  ];

  useEffect(() => {
    // Load templates and platforms
    setTemplates(templateManager.getAllTemplates());
    setDeploymentPlatforms(deploymentManager.getAllPlatforms());
    
    // Set default configurations
    setConfigurations({
      database: 'prisma',
      auth: 'nextauth',
      ui: 'shadcn',
      testing: 'vitest'
    });
  }, []);

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to previous steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplateData) return;
    
    setIsGenerating(true);
    try {
      const { tree, files } = templateManager.generateProjectFromTemplate(
        selectedTemplate,
        projectSettings,
        configurations
      );
      
      setGeneratedProject({
        tree,
        files,
        template: selectedTemplateData
      });
      
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating project:', error);
      alert('Error generating project. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = async (platform: DeploymentPlatform['id']) => {
    if (!generatedProject) return;
    
    try {
      const config = deploymentManager.generateDeploymentConfig(
        platform,
        projectSettings,
        generatedProject.tree
      );
      
      // Add deployment config to files
      const updatedFiles = { ...generatedProject.files };
      
      switch (platform) {
        case 'vercel':
          updatedFiles['vercel.json'] = config;
          break;
        case 'netlify':
          updatedFiles['netlify.toml'] = config;
          break;
        case 'railway':
          updatedFiles['railway.json'] = config;
          break;
        case 'digitalocean':
          updatedFiles['.do/app.yaml'] = config;
          break;
      }
      
      setGeneratedProject({
        ...generatedProject,
        files: updatedFiles
      });
      
      // Open deployment platform
      const deploymentUrl = getDeploymentUrl(platform, projectSettings.name || 'my-project');
      window.open(deploymentUrl, '_blank');
      
    } catch (error) {
      console.error('Error setting up deployment:', error);
      alert('Error setting up deployment. Please try again.');
    }
  };

  const handleDownload = async () => {
    if (!generatedProject) return;
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add all files to zip
      Object.entries(generatedProject.files).forEach(([path, content]) => {
        zip.file(path, content);
      });
      
      // Generate enhanced documentation
      const deploymentGuide = generateDeploymentGuide(generatedProject.template, projectSettings);
      zip.file('DEPLOYMENT.md', deploymentGuide);
      
      const setupScript = generateSetupScript(projectSettings);
      zip.file('setup.sh', setupScript);
      
      // VS Code configuration
      zip.file('.vscode/settings.json', generateVSCodeSettings());
      zip.file('.vscode/extensions.json', generateVSCodeExtensions());
      
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });
      
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectSettings.name || 'project'}-complete.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating download:', error);
      alert('Error generating download. Please try again.');
    }
  };

  if (showPreview && generatedProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              ← Back to Generator
            </button>
          </div>
          
          <EnhancedPreview
            tree={generatedProject.tree}
            files={generatedProject.files}
            settings={projectSettings}
            template={generatedProject.template}
            onDeploy={handleDeploy}
            onDownload={handleDownload}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <WizardHeader />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <WizardStep
                  step={step}
                  index={index}
                  currentStep={currentStep}
                  isLast={index === steps.length - 1}
                  onClick={() => handleStepClick(index)}
                />
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-300 ml-8" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {currentStep === 0 && (
            <TemplateSelection
              templates={templates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
          )}

          {currentStep === 1 && (
            <ProjectConfiguration
              settings={projectSettings}
              onSettingsChange={setProjectSettings}
              configurations={configurations}
              onConfigurationChange={setConfigurations}
            />
          )}

          {currentStep === 2 && (
            <ProjectPreview
              selectedTemplate={selectedTemplateData}
              settings={projectSettings}
              configurations={configurations}
            />
          )}

          {currentStep === 3 && (
            <ProjectGeneration
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          )}

          {/* Navigation */}
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            isGenerating={isGenerating}
            onPrevious={handlePrevious}
            onNext={currentStep === steps.length - 1 ? handleGenerate : handleNext}
          />
        </div>

        {/* Feature highlights at bottom */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureHighlight
            icon="⚡"
            title="Lightning Fast"
            description="Generate complete projects in seconds, not hours. Pre-configured and optimized."
            color="from-violet-500 to-purple-600"
          />
          <FeatureHighlight
            icon="🛡️"
            title="Production Ready"
            description="Security headers, performance optimizations, and best practices built-in."
            color="from-emerald-500 to-teal-600"
          />
          <FeatureHighlight
            icon="☁️"
            title="Deploy Anywhere"
            description="Optimized for Vercel, Netlify, Railway, and other modern platforms."
            color="from-blue-500 to-cyan-600"
          />
        </div>
      </div>
    </div>
  );
};

// Import WizardStep from the components we created earlier
import { WizardStep } from './wizard/WizardStep';

// Feature Highlight Component
interface FeatureHighlightProps {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  icon,
  title,
  description,
  color
}) => {
  return (
    <div className="text-center">
      <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Helper functions (these should be moved to separate utility files)
const generateDeploymentGuide = (template: Template, settings: ProjectSettings): string => {
  return `# 🚀 Deployment Guide for ${settings.name || template.name}

## Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 3. Visit Your App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Template Features

${template.features.map(f => `- ✅ ${f}`).join('\n')}

## Tech Stack

- **Framework:** ${template.stack.framework.toUpperCase()}
- **Styling:** ${template.stack.styling}
- **Database:** ${template.stack.database || 'None'}
- **Authentication:** ${template.stack.auth || 'None'}
- **Deployment:** ${template.stack.deployment}

## License

${settings.license} License
`;
};

const generateSetupScript = (settings: ProjectSettings): string => {
  return `#!/bin/bash

# ${settings.name || 'Project'} Setup Script
echo "🚀 Setting up ${settings.name || 'your project'}..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    echo "NEXT_PUBLIC_APP_NAME=\\"${settings.name || 'My App'}\\"" > .env.local
fi

echo "✅ Setup complete!"
echo "Run 'npm run dev' to start the development server"
`;
};

const generateVSCodeSettings = (): string => {
  return JSON.stringify({
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "typescript.preferences.importModuleSpecifier": "relative",
    "tailwindCSS.includeLanguages": {
      "typescript": "html",
      "typescriptreact": "html"
    }
  }, null, 2);
};

const generateVSCodeExtensions = (): string => {
  return JSON.stringify({
    "recommendations": [
      "bradlc.vscode-tailwindcss",
      "esbenp.prettier-vscode",
      "ms-vscode.vscode-typescript-next",
      "dbaeumer.vscode-eslint"
    ]
  }, null, 2);
};

export default FileTreeGenerator;
