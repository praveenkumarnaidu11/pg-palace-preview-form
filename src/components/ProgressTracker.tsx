
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  totalSteps,
  labels = [],
  className
}) => {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between mb-1 text-xs text-gray-500 md:text-sm">
        {labels.length ? (
          labels.map((label, index) => (
            <div 
              key={index} 
              className={cn(
                "flex flex-col items-center space-y-1 transition-colors",
                index < currentStep ? "text-purple-600 font-medium" : ""
              )}
            >
              <div 
                className={cn(
                  "rounded-full w-6 h-6 flex items-center justify-center text-xs border",
                  index < currentStep 
                    ? "bg-purple-600 text-white border-purple-600" 
                    : index === currentStep 
                      ? "border-purple-600 text-purple-600" 
                      : "border-gray-300 text-gray-400"
                )}
              >
                {index + 1}
              </div>
              <span className="hidden sm:block">{label}</span>
            </div>
          ))
        ) : (
          <>
            <span>Start</span>
            <span>{`${progress}%`}</span>
            <span>Complete</span>
          </>
        )}
      </div>
      
      <Progress 
        value={progress} 
        className="h-2 bg-gray-200" 
      />
    </div>
  );
};

export default ProgressTracker;
