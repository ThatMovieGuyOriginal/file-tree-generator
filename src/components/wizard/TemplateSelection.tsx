// src/components/wizard/TemplateSelection.tsx
import React, { useState } from 'react';
import { Template } from '@/lib/template-manager';
import { Sparkles, Code, ShoppingBag, BarChart3, FileText, Zap, Users, Shield, Palette, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';

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

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'saas': return 'from-violet-500 to-purple-600';
    case 'ecommerce': return 'from-emerald-500 to-teal-600';
    case 'dashboard': return 'from-blue-500 to-cyan-600';
    case 'blog': return 'from-orange-500 to-red-600';
    case 'api': return 'from-green-500 to-emerald-600';
    default: return 'from-gray-500 to-slate-600';
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

interface CategoryCarouselProps {
  category: string;
  templates: Template[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  category,
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const templatesPerPage = 3;
  const totalPages = Math.ceil(templates.length / templatesPerPage);
  
  const currentTemplates = templates.slice(
    currentPage * templatesPerPage,
    (currentPage + 1) * templatesPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const categoryIcon = getCategoryIcon(category);
  const categoryColor = getCategoryColor(category);

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${categoryColor} text-white shadow-lg`}>
            {categoryIcon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 capitalize">{category} Templates</h3>
            <p className="text-gray-600">
              {templates.length} professional template{templates.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1 px-3">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i === currentPage ? 'bg-indigo-600 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[400px]">
        {currentTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const complexityConfig = getComplexityBadge(template.complexity);

          return (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template.id)}
              className={`
                group relative bg-white rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden border-2
                ${isSelected 
                  ? 'ring-4 ring-indigo-500/30 shadow-2xl scale-105 border-indigo-500' 
                  : 'hover:shadow-xl hover:scale-102 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              )}

              {/* Header with Gradient */}
              <div className={`p-6 bg-gradient-to-r ${template.color} text-white relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }} />
                </div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${complexityConfig.bg} ${complexityConfig.text}`}>
                      {complexityConfig.label}
                    </span>
                    <span className="text-white/80 text-sm">{template.estimatedTime}</span>
                  </div>
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
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {template.features.slice(0, 3).map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                    {template.features.length > 3 && (
                      <p className="text-xs text-gray-500 mt-1">
                        +{template.features.length - 3} more features
                      </p>
                    )}
                  </div>
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
                      ? 'bg-indigo-600 text-white shadow-lg' 
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

              {/* Hover Effect */}
              {!isSelected && (
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  // Group templates by category
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

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

      {/* Category Carousels */}
      <div className="space-y-16">
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <CategoryCarousel
            key={category}
            category={category}
            templates={categoryTemplates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={onTemplateSelect}
          />
        ))}
      </div>

      {/* Selected Template Summary */}
      {selectedTemplateData && (
        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 bg-gradient-to-r ${selectedTemplateData.color} rounded-xl text-white`}>
              <span className="text-2xl">{selectedTemplateData.icon}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-indigo-900">{selectedTemplateData.name} Selected</h3>
              <p className="text-indigo-700">{selectedTemplateData.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {selectedTemplateData.features.length}
              </div>
              <div className="text-sm text-indigo-700 font-medium">Features Included</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {selectedTemplateData.estimatedTime}
              </div>
              <div className="text-sm text-green-700 font-medium">Setup Time</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {selectedTemplateData.complexity === 'starter' ? '⭐' : 
                 selectedTemplateData.complexity === 'intermediate' ? '⭐⭐' : '⭐⭐⭐'}
              </div>
              <div className="text-sm text-purple-700 font-medium">Complexity</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-orange-700 font-medium">Production Ready</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to customize your template?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Each template is fully customizable and production-ready. You can modify any template 
            to match your exact requirements in the next step.
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
