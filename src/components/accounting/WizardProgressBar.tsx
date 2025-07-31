import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProcessingStep } from '@/types/accounting';

interface WizardProgressBarProps {
  currentStep: ProcessingStep['id'];
  onStepClick: (step: ProcessingStep['id']) => void;
}

const steps: ProcessingStep[] = [
  { id: 'tolka', name: 'Tolka', completed: false },
  { id: 'identifiera', name: 'Identifiera', completed: false },
  { id: 'bokfora', name: 'Bokföra', completed: false }
];

const WizardProgressBar: React.FC<WizardProgressBarProps> = ({ 
  currentStep, 
  onStepClick 
}) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = step.id === currentStep;
          const isClickable = index <= currentStepIndex;

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  isCompleted && "bg-green-500 border-green-500 text-white",
                  isCurrent && !isCompleted && "border-blue-500 bg-blue-50 text-blue-600",
                  !isCurrent && !isCompleted && index > currentStepIndex && "border-gray-300 text-gray-400",
                  isClickable && "cursor-pointer hover:bg-opacity-80"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </button>
              
              <div className="ml-3">
                <div className={cn(
                  "text-sm font-medium",
                  isCurrent && "text-blue-600",
                  isCompleted && "text-green-600",
                  !isCurrent && !isCompleted && "text-gray-500"
                )}>
                  {step.name}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-4",
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgressBar;