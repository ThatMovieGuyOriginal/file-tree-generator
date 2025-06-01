// src/components/FileTreeGenerator.tsx - Updated with streamlined workflow
'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Settings, Eye, Rocket, Database, Shield, Palette, TestTube, Check, Loader2 } from 'lucide-react';
import { TreeNode as TreeNodeType } from 'src/types/fileTree';
import { ProjectSettings } from 'src/types/project';
import { templateManager, Template } from 'src/lib/template-manager';
import { deploymentManager, DeploymentPlatform } from 'src/lib/deployment-manager';
import { pluginManager } from 'src/lib/pluginManager';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardNavigation } from './wizard/WizardNavigation';
import { WizardStep } from './wizard/WizardStep';
import { TemplateSelection } from './wizard/TemplateSelection';
import { ProjectConfiguration } from './wizard/ProjectConfiguration';
import { ProjectPreview } from './wizard/ProjectPreview';
import { StreamlinedGeneration } from './wizard/StreamlinedGeneration';

const FileTreeGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('nextjs-saas-complete');
  const [configurations, setConfigurations] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<{
    tree: TreeNodeType;
    files: Record<string, string>;
    template: Template;
    actualStats: {
      totalFiles: number;
      totalLines: number;
      totalSize: number;
      dependencies: number;
      devDependencies: number;
    };
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
    const initializeGenerators = async () => {
      try {
        await pluginManager.initialize();
        setTemplates(templateManager.getAllTemplates());
        setDeploymentPlatforms(deploymentManager.getAllPlatforms());
        
        const availablePlugins = pluginManager.getAllPlugins();
        const defaultPlugin = availablePlugins.find(p => p.id === 'nextjs');
        
        setConfigurations({
          database: 'prisma',
          auth: 'nextauth',
          ui: 'shadcn',
          testing: 'vitest',
          selectedPlugin: defaultPlugin?.id || 'nextjs'
        });
      } catch (error) {
        console.error('Failed to initialize generators:', error);
        setTemplates(templateManager.getAllTemplates());
        setDeploymentPlatforms(deploymentManager.getAllPlatforms());
      }
    };
    
    initializeGenerators();
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
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const calculateActualStats = (files: Record<string, string>, template: Template) => {
    const totalFiles = Object.keys(files).length;
    const totalLines = Object.values(files).reduce((acc, content) => 
      acc + content.split('\n').length, 0
    );
    const totalSize = Object.values(files).reduce((acc, content) => 
      acc + new Blob([content]).size, 0
    );

    // Calculate actual dependencies from package.json
    let dependencies = 0;
    let devDependencies = 0;
    
    const packageJsonContent = files['package.json'];
    if (packageJsonContent) {
      try {
        const packageJson = JSON.parse(packageJsonContent);
        dependencies = Object.keys(packageJson.dependencies || {}).length;
        devDependencies = Object.keys(packageJson.devDependencies || {}).length;
      } catch (error) {
        console.error('Error parsing package.json for stats:', error);
        // Set to NaN if we can't calculate
        dependencies = NaN;
        devDependencies = NaN;
      }
    } else {
      // Set to NaN if package.json doesn't exist
      dependencies = NaN;
      devDependencies = NaN;
    }

    return {
      totalFiles,
      totalLines,
      totalSize,
      dependencies,
      devDependencies
    };
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
      
      const actualStats = calculateActualStats(files, selectedTemplateData);
      
      setGeneratedProject({
        tree,
        files,
        template: selectedTemplateData,
        actualStats
      });
      
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
      
      const actualStats = calculateActualStats(updatedFiles, generatedProject.template);
      
      setGeneratedProject({
        ...generatedProject,
        files: updatedFiles,
        actualStats
      });
      
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
      
      Object.entries(generatedProject.files).forEach(([path, content]) => {
        zip.file(path, content);
      });
      
      const deploymentGuide = generateDeploymentGuide(generatedProject.template, projectSettings, generatedProject.actualStats);
      zip.file('DEPLOYMENT.md', deploymentGuide);
      
      const setupScript = generateSetupScript(projectSettings);
      zip.file('setup.sh', setupScript);
      
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
            <StreamlinedGeneration
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              generatedProject={generatedProject}
              settings={projectSettings}
              onDeploy={handleDeploy}
              onDownload={handleDownload}
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

// Helper functions for generating actual stats-based content
const generateDeploymentGuide = (template: Template, settings: ProjectSettings, actualStats: any): string => {
  return `# 🚀 Deployment Guide for ${settings.name || template.name}

## Project Statistics

- **Total Files Generated:** ${actualStats.totalFiles}
- **Total Lines of Code:** ${actualStats.totalLines.toLocaleString()}
- **Project Size:** ${Math.round(actualStats.totalSize / 1024)}KB
- **Dependencies:** ${isNaN(actualStats.dependencies) ? 'Unable to calculate' : actualStats.dependencies}
- **Dev Dependencies:** ${isNaN(actualStats.devDependencies) ? 'Unable to calculate' : actualStats.devDependencies}

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

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

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

const getDeploymentUrl = (platform: DeploymentPlatform['id'], projectName: string): string => {
  const encodedName = encodeURIComponent(projectName);
  
  switch (platform) {
    case 'vercel':
      return `https://vercel.com/new/clone?repository-url=https://github.com/yourusername/${encodedName}`;
    case 'netlify':
      return `https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/${encodedName}`;
    case 'railway':
      return `https://railway.app/new/template?template=https://github.com/yourusername/${encodedName}`;
    case 'digitalocean':
      return `https://cloud.digitalocean.com/apps/new?repo=https://github.com/yourusername/${encodedName}`;
    default:
      return 'https://github.com';
  }
};

export default FileTreeGenerator;
