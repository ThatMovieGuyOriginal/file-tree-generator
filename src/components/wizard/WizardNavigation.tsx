// src/components/wizard/WizardNavigation.tsx
import React from 'react';
import { ChevronRight, Sparkles, Loader2 } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isGenerating: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  isGenerating,
  onPrevious,
  onNext
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="border-t border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onPrevious}
          disabled={isFirstStep}
          className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          Previous
        </button>
        
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentStep ? 'bg-indigo-600 w-8' : 
                index < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <button 
          onClick={onNext}
          disabled={isGenerating}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLastStep ? (
            isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            )
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
