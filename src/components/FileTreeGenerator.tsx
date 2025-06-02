// src/components/FileTreeGenerator.tsx - test
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, Settings, Eye, Rocket } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { TreeNode as TreeNodeType } from 'src/types/fileTree';
import { ProjectSettings } from 'src/types/project';
import { templateManager, Template } from 'src/lib/template-manager';
import { deploymentManager, DeploymentPlatform } from 'src/lib/deployment-manager';
import { pluginManager } from 'src/lib/pluginManager';
import { measureTime, performanceMonitor } from '@/lib/performance/performance-monitor';
import { trackEvent, eventTracker } from '@/lib/analytics/event-tracker';
import { projectGenerationLimiter, withRateLimit } from '@/lib/utils/rate-limiter';
import { reportError } from '@/lib/analytics/error-tracker';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardNavigation } from './wizard/WizardNavigation';
import { WizardStep } from './wizard/WizardStep';
import { TemplateSelection } from './wizard/TemplateSelection';
import { ProjectConfiguration } from './wizard/ProjectConfiguration';
import { ProjectGeneration } from './wizard/ProjectGeneration';
import { ProjectPreview } from './wizard/ProjectPreview';

interface GeneratedProject {
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
}

const FileTreeGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('nextjs-saas-complete');
  const [configurations, setConfigurations] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);
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
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 'template', name: 'Choose Template', icon: Sparkles },
    { id: 'configure', name: 'Configure', icon: Settings },
    { id: 'preview', name: 'Preview', icon: Eye },
    { id: 'generate', name: 'Generate', icon: Rocket }
  ];

  // Memoized expensive calculations
  const selectedTemplateData = useMemo(() => 
    templates.find(t => t.id === selectedTemplate), 
    [templates, selectedTemplate]
  );

  const calculateActualStats = useMemo(() => (files: Record<string, string>, template: Template) => {
    const stopTimer = measureTime('calculate_project_stats');
    
    try {
      const totalFiles = Object.keys(files).length;
      const totalLines = Object.values(files).reduce((acc, content) => 
        acc + content.split('\n').length, 0
      );
      const totalSize = Object.values(files).reduce((acc, content) => 
        acc + new Blob([content]).size, 0
      );

      let dependencies = 0;
      let devDependencies = 0;
      
      const packageJsonContent = files['package.json'];
      if (packageJsonContent) {
        try {
          const packageJson = JSON.parse(packageJsonContent);
          dependencies = Object.keys(packageJson.dependencies || {}).length;
          devDependencies = Object.keys(packageJson.devDependencies || {}).length;
        } catch (error) {
          reportError(new Error('Failed to parse package.json for stats'), { 
            context: { template: template.id }
          });
          dependencies = NaN;
          devDependencies = NaN;
        }
      } else {
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
    } finally {
      stopTimer();
    }
  }, []);

  useEffect(() => {
    const initializeGenerators = async () => {
      const stopTimer = measureTime('initialize_generators');
      
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

        trackEvent('app_initialized', {
          templates_count: templateManager.getAllTemplates().length,
          plugins_count: availablePlugins.length
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
        setError(errorMessage);
        reportError(error instanceof Error ? error : new Error(errorMessage));
        
        // Fallback initialization
        setTemplates(templateManager.getAllTemplates());
        setDeploymentPlatforms(deploymentManager.getAllPlatforms());
      } finally {
        stopTimer();
      }
    };
    
    initializeGenerators();

    // Track page view
    trackEvent('page_view', { page: 'file_tree_generator' });
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      trackEvent('wizard_step_completed', {
        from_step: currentStep,
        to_step: nextStep,
        step_name: steps[currentStep].name
      });
    }
  }, [currentStep, steps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      trackEvent('wizard_step_back', {
        from_step: currentStep,
        to_step: prevStep
      });
    }
  }, [currentStep]);

  const handleStepClick = useCallback((stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
      trackEvent('wizard_step_clicked', { step_index: stepIndex });
    }
  }, [currentStep]);

  const handleGenerate = useCallback(
    withRateLimit(
      projectGenerationLimiter,
      'user_session', // In a real app, use actual user ID
      async () => {
        if (!selectedTemplateData) {
          throw new Error('No template selected');
        }
        
        setIsGenerating(true);
        const stopTimer = measureTime('project_generation_total');
        
        try {
          const { tree, files } = templateManager.generateProjectFromTemplate(
            selectedTemplate,
            projectSettings,
            configurations
          );
          
          const actualStats = calculateActualStats(files, selectedTemplateData);
          
          const newProject: GeneratedProject = {
            tree,
            files,
            template: selectedTemplateData,
            actualStats
          };
          
          setGeneratedProject(newProject);
          
          // Track successful generation
          trackEvent('project_generated', {
            template_id: selectedTemplate,
            template_name: selectedTemplateData.name,
            file_count: actualStats.totalFiles,
            total_lines: actualStats.totalLines,
            project_size: actualStats.totalSize,
            configurations: JSON.stringify(configurations)
          });
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Generation failed';
          setError(errorMessage);
          reportError(error instanceof Error ? error : new Error(errorMessage), {
            context: {
              template: selectedTemplate,
              configurations,
              project_settings: projectSettings
            }
          });
          
          trackEvent('project_generation_failed', {
            template_id: selectedTemplate,
            error_message: errorMessage
          });
          
          throw error;
        } finally {
          setIsGenerating(false);
          stopTimer();
        }
      }
    ),
    [selectedTemplateData, selectedTemplate, projectSettings, configurations, calculateActualStats]
  );

  const handleDeploy = useCallback(async (platform: DeploymentPlatform['id']) => {
    if (!generatedProject) return;
    
    const stopTimer = measureTime('deployment_setup');
    
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
      
      trackEvent('deployment_initiated', {
        platform,
        template_id: selectedTemplate,
        project_name: projectSettings.name
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Deployment setup failed';
      setError(errorMessage);
      reportError(error instanceof Error ? error : new Error(errorMessage), {
        context: { platform, project_name: projectSettings.name }
      });
      
      trackEvent('deployment_failed', {
        platform,
        error_message: errorMessage
      });
      
      alert('Error setting up deployment. Please try again.');
    } finally {
      stopTimer();
    }
  }, [generatedProject, projectSettings, selectedTemplate, calculateActualStats]);

  const handleDownload = useCallback(async () => {
    if (!generatedProject) return;
    
    const stopTimer = measureTime('project_download');
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      Object.entries(generatedProject.files).forEach(([path, content]) => {
        zip.file(path, content);
      });
      
      // Add enhanced files
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
      
      trackEvent('project_downloaded', {
        template_id: selectedTemplate,
        project_name: projectSettings.name,
        file_count: generatedProject.actualStats.totalFiles,
        download_size: zipBlob.size
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      setError(errorMessage);
      reportError(error instanceof Error ? error : new Error(errorMessage));
      
      trackEvent('download_failed', {
        error_message: errorMessage
      });
      
      alert('Error generating download. Please try again.');
    } finally {
      stopTimer();
    }
  }, [generatedProject, projectSettings, selectedTemplate]);

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-4">Something went wrong</h1>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        reportError(error, { 
          componentStack: errorInfo.componentStack,
          context: { currentStep, selectedTemplate }
        });
      }}
    >
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
            <ErrorBoundary fallback={<div className="p-8 text-center">Error loading step content</div>}>
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
                  generatedProject={generatedProject}
                  settings={projectSettings}
                  onDeploy={handleDeploy}
                  onDownload={handleDownload}
                />
              )}
            </ErrorBoundary>

            {/* Navigation */}
            <WizardNavigation
              currentStep={currentStep}
              totalSteps={steps.length}
              isGenerating={isGenerating}
              onPrevious={handlePrevious}
              onNext={currentStep === steps.length - 1 ? handleGenerate : handleNext}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Helper functions (keeping file under 500 lines)
const getDeploymentUrl = (platform: DeploymentPlatform['id'], projectName: string): string => {
  const encodedName = encodeURIComponent(projectName);
  
  const urls = {
    'vercel': `https://vercel.com/new/clone?repository-url=https://github.com/yourusername/${encodedName}`,
    'netlify': `https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/${encodedName}`,
    'railway': `https://railway.app/new/template?template=https://github.com/yourusername/${encodedName}`,
    'digitalocean': `https://cloud.digitalocean.com/apps/new?repo=https://github.com/yourusername/${encodedName}`
  };
  
  return urls[platform] || 'https://github.com';
};

// These should be moved to separate utility files in a real implementation
const generateDeploymentGuide = (template: Template, settings: ProjectSettings, actualStats: any): string => {
  return `# 🚀 Deployment Guide for ${settings.name || template.name}\n\n## Project Statistics\n\n- **Total Files Generated:** ${actualStats.totalFiles}\n- **Total Lines of Code:** ${actualStats.totalLines.toLocaleString()}\n- **Project Size:** ${Math.round(actualStats.totalSize / 1024)}KB\n\n## Quick Start\n\n### 1. Install Dependencies\n\`\`\`bash\nnpm install\n\`\`\`\n\n### 2. Start Development Server\n\`\`\`bash\nnpm run dev\n\`\`\`\n\n### 3. Visit Your App\nOpen [http://localhost:3000](http://localhost:3000) in your browser.\n\n## License\n\n${settings.license} License`;
};

const generateSetupScript = (settings: ProjectSettings): string => {
  return `#!/bin/bash\n\n# ${settings.name || 'Project'} Setup Script\necho "🚀 Setting up ${settings.name || 'your project'}..."\n\nif ! command -v node &> /dev/null; then\n    echo "❌ Node.js is not installed. Please install Node.js 18+"\n    exit 1\nfi\n\necho "📦 Installing dependencies..."\nnpm install\n\necho "✅ Setup complete!"\necho "Run 'npm run dev' to start the development server"`;
};

const generateVSCodeSettings = (): string => {
  return JSON.stringify({
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "typescript.preferences.importModuleSpecifier": "relative"
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
