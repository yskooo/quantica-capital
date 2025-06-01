
import { useState } from "react";
import { 
  RegistrationData, 
  PersonalData, 
  SourceOfFunding, 
  BankDetails,
  ContactRole 
} from "@/types/models";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Steps in the registration process
const steps = [
  { id: 'account', name: 'Account' },
  { id: 'personal', name: 'Personal Details' },
  { id: 'funding', name: 'Source of Funds' },
  { id: 'banking', name: 'Banking Details' },
  { id: 'contacts', name: 'Emergency Contacts' },
  { id: 'review', name: 'Review' }
];

interface RegistrationStepperProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: Partial<RegistrationData>;
}

export function RegistrationStepper({ 
  currentStep, 
  setCurrentStep, 
  formData 
}: RegistrationStepperProps) {
  // Determine if a step is complete based on formData
  const isStepComplete = (stepId: string): boolean => {
    switch (stepId) {
      case 'account':
        return !!formData.credentials?.email && 
               !!formData.credentials?.password && 
               formData.credentials.password.length >= 8;
      case 'personal':
        return !!formData.personalData?.P_Name && 
               !!formData.personalData?.P_Address && 
               !!formData.personalData?.P_Email && 
               !!formData.personalData?.P_Cell_Number && 
               !!formData.personalData?.Date_of_Birth;
      case 'funding':
        return !!formData.sourceOfFunding?.Nature_of_Work && 
               !!formData.sourceOfFunding?.Source_of_Income;
      case 'banking':
        return !!formData.bankDetails?.Bank_Name;
      case 'contacts':
        return formData.contacts && formData.contacts.length > 0 && 
               formData.contacts.some(c => c.role === 'Kin' && !!c.contactDetails?.C_Name);
      case 'review':
        // Review is a final check, not a data entry step
        return false;
      default:
        return false;
    }
  };

  return (
    <nav aria-label="Registration Progress" className="w-full mb-8">
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = index < currentStep || isStepComplete(step.id);
          
          return (
            <li 
              key={step.id}
              className={cn(
                "flex items-center", 
                index < steps.length - 1 ? "flex-1" : ""
              )}
            >
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border transition-all",
                    isActive && "border-primary bg-primary text-primary-foreground",
                    isCompleted && !isActive && "border-primary bg-primary/20 text-primary",
                    !isActive && !isCompleted && "border-muted-foreground/30 text-muted-foreground"
                  )}
                  onClick={() => {
                    // Allow navigation to previous steps or completed steps
                    if (index < currentStep || isCompleted) {
                      setCurrentStep(index);
                    }
                  }}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span 
                  className={cn(
                    "mt-1 text-xs hidden md:block",
                    isActive && "font-medium text-foreground",
                    isCompleted && !isActive && "text-primary",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-px mx-2", 
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
