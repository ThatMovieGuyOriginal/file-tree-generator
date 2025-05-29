// src/components/wizard/WizardStep.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface WizardStepProps {
  step: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
  };
  index: number;
  currentStep: number;
  isLast: boolean;
  onClick?: () => void;
}

export const WizardStep: React.FC<WizardStepProps> = ({
  step,
  index,
  currentStep,
  isLast,
  onClick
}) => {
  const isActive = index === currentStep;
  const isCompleted = index < currentStep;
  const IconComponent = step.icon;

  return (
    <div className="flex items-center">
      <button
        onClick={onClick}
        className={`
          flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-105
          ${isActive ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg' :
            isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
        `}
      >
        {isCompleted ? <Check className="w-6 h-6" /> : <IconComponent className="w-6 h-6" />}
      </button>
      
      <div className="ml-3">
        <p className={`text-sm font-medium ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
          Step {index + 1}
        </p>
        <p className={`text-lg ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
          {step.name}
        </p>
      </div>
      
      {!isLast && (
        <div className="ml-8 w-16 h-0.5 bg-gray-300" />
      )}
    </div>
  );
};
