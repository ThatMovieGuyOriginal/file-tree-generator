// src/components/wizard/TemplateSelection.tsx
import React, { useState } from 'react';
import { Template } from '@/lib/template-manager';
import { Sparkles, Code, ShoppingBag, BarChart3, FileText, Zap, Users, Shield, Palette, Clock, Star } from 'lucide-react';

interface TemplateSelectionProps {
  templates: Template[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'saas': return <Users className="w-5 h-5" />;
    case 'ecommerce': return <ShoppingBag className="w-5 h-5" />;
    case 'dashboard': return <BarChart3 className="w-5 h-5" />;
    case 'blog': return <FileText className="w-5 h-5" />;
    case 'api': return <Zap className="w-5 h-5" />;
    default: return <Code className="w-5 h-5" />;
  }
};

const getComplexityBadge = (complexity: string) => {
  const configs = {
    starter: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Beginner Friendly' },
    intermediate: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Intermediate' },
    advanced: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Advanced Pro' }
  };
  return configs[complexity as keyof typeof configs] || configs.starter;
};

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Group templates by category for better organization
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-screen">
      {/* Enhanced Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full text-white text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Professional Templates
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-violet-900 bg-clip-text text-transparent mb-4">
          Choose Your Perfect Template
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Start with a professionally crafted template designed for modern applications. 
          Each template includes production-ready features and best practices.
        </p>
      </div>

      {/* Category Sections */}
      <div className="space-y-12">
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category}>
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
                {getCategoryIcon(category)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 capitalize">{category} Templates</h3>
                <p className="text-gray-600 text-sm">
                  {categoryTemplates.length} professional template{categoryTemplates.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTemplates.map((template) => {
                const isSelected = selectedTemplate === template.id;
                const isHovered = hoveredTemplate === template.id;
                const complexityConfig = getComplexityBadge(template.complexity);

                return (
                  <div
                    key={template.id}
                    onClick={() => onTemplateSelect(template.id)}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                    className={`
                      group relative bg-white rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden
                      ${isSelected 
                        ? 'ring-2 ring-indigo-500 shadow-2xl scale-105 border-indigo-200' 
                        : 'hover:shadow-xl hover:scale-102 border border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {/* Header with Gradient */}
                    <div className={`p-6 bg-gradient-to-r ${template.color} text-white relative overflow-hidden`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }} />
                      </div>
                      
                      <div className="relative z-10 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{template.icon}</div>
                          <div>
                            <h3 className="text-xl font-bold">{template.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${complexityConfig.bg} ${complexityConfig.text}`}>
                                {complexityConfig.label}
                              </span>
                              <span className="text-white/80 text-sm">{template.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                        {template.description}
                      </p>

                      {/* Features Grid */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          Included Features
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {template.features.slice(0, 4).map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              <span className="truncate">{feature}</span>
                            </div>
                          ))}
                        </div>
                        {template.features.length > 4 && (
                          <p className="text-xs text-gray-500 mt-2">
                            +{template.features.length - 4} more features
                          </p>
                        )}
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {template.stack.framework.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                          {template.stack.styling}
                        </span>
                        {template.stack.database && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            {template.stack.database}
                          </span>
                        )}
                      </div>

                      {/* Action Area */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-yellow-500">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">Pro Quality</span>
                        </div>
                        
                        <div className={`
                          flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                          ${isSelected 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-700 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                          }
                        `}>
                          {isSelected ? (
                            <>
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              Selected
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Select
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    {isHovered && !isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/10 to-transparent pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Can't find the perfect template?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Each template is fully customizable and production-ready. You can modify any template 
            to match your exact requirements after generation.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span>Setup in minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Production ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Fully customizable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
