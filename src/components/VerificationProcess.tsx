
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, LoaderCircle, AlertCircle } from 'lucide-react';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
}

interface VerificationProcessProps {
  isVerifying: boolean;
  verificationComplete: boolean;
  verificationError: boolean;
  currentStep: number;
  className?: string;
}

const VerificationProcess: React.FC<VerificationProcessProps> = ({
  isVerifying,
  verificationComplete,
  verificationError,
  currentStep,
  className,
}) => {
  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: 'document-analysis',
      title: 'Document Analysis',
      description: 'Analyzing document structure and content'
    },
    {
      id: 'data-extraction',
      title: 'Data Extraction',
      description: 'Extracting key information from the document'
    },
    {
      id: 'verification',
      title: 'Verification',
      description: 'Checking for potential inconsistencies and fraud indicators'
    },
    {
      id: 'validation',
      title: 'Validation',
      description: 'Final validation and result generation'
    }
  ]);

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)}>
      <div className="space-y-8">
        {steps.map((step, index) => {
          // Determine step status
          const isActive = currentStep === index;
          const isCompleted = currentStep > index || (verificationComplete && index === steps.length - 1);
          const isFailed = verificationError && index === currentStep;
          
          // Determine step styling
          const stepClassName = cn(
            "relative pl-10 transition-all duration-300",
            isActive && !isFailed ? "opacity-100" : "opacity-70",
          );
          
          // Determine connection line styling
          const hasLine = index < steps.length - 1;
          const lineClassName = cn(
            "absolute left-[0.9375rem] top-6 w-px h-12 -ml-px",
            isCompleted && currentStep > index ? "bg-verification-success" : "bg-border",
            isFailed ? "bg-verification-error" : ""
          );
          
          return (
            <div key={step.id} className={stepClassName}>
              {/* Status Icon */}
              <div className="absolute left-0 top-0.5">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-verification-success animate-fade-in" />
                ) : isFailed ? (
                  <AlertCircle className="w-5 h-5 text-verification-error animate-fade-in" />
                ) : isActive ? (
                  <LoaderCircle className="w-5 h-5 text-verification-info animate-spin-slow" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border bg-background" />
                )}
              </div>
              
              {/* Connection Line */}
              {hasLine && <div className={lineClassName} />}
              
              {/* Step Content */}
              <div>
                <h3 className={cn(
                  "text-sm font-semibold mb-1",
                  isCompleted ? "text-verification-success" : "",
                  isFailed ? "text-verification-error" : "",
                  isActive && !isFailed ? "text-verification-info" : ""
                )}>
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationProcess;
