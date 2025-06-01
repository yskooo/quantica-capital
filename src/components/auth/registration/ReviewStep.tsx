
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RegistrationData } from "@/types/models";
import { format } from "date-fns";
import { Check, Loader2, User } from "lucide-react";

interface ReviewStepProps {
  data: Partial<RegistrationData>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ReviewStep({ data, onBack, onSubmit, isSubmitting }: ReviewStepProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Review Your Information</h2>
        <p className="text-muted-foreground">
          Please review all your information before submitting your application.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Full Name</p>
            <p className="font-medium">{data.personalData?.P_Name || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{data.personalData?.P_Email || data.credentials?.email || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Phone Number</p>
            <p className="font-medium">{data.personalData?.P_Cell_Number || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Date of Birth</p>
            <p className="font-medium">{formatDate(data.personalData?.Date_of_Birth)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Address</p>
            <p className="font-medium">{data.personalData?.P_Address || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Postal Code</p>
            <p className="font-medium">{data.personalData?.P_Postal_Code || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Employment Status</p>
            <p className="font-medium">{data.personalData?.Employment_Status || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Account Purpose</p>
            <p className="font-medium">{data.personalData?.Purpose_of_Opening || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Source of Funding */}
      <Card>
        <CardHeader>
          <CardTitle>Source of Funding</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Occupation / Nature of Work</p>
            <p className="font-medium">{data.sourceOfFunding?.Nature_of_Work || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Company / Institution</p>
            <p className="font-medium">{data.sourceOfFunding?.['Business/School_Name'] || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Office / School Address</p>
            <p className="font-medium">{data.sourceOfFunding?.['Office/School_Address'] || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Company / School Number</p>
            <p className="font-medium">{data.sourceOfFunding?.['Office/School_Number'] || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Valid ID Type</p>
            <p className="font-medium">{data.sourceOfFunding?.Valid_ID || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Source of Income</p>
            <p className="font-medium">{data.sourceOfFunding?.Source_of_Income || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Banking Information */}
      <Card>
        <CardHeader>
          <CardTitle>Banking Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Account Holder Name</p>
            <p className="font-medium">{data.bankDetails?.Bank_Acc_Name || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Bank Name</p>
            <p className="font-medium">{data.bankDetails?.Bank_Name || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Branch</p>
            <p className="font-medium">{data.bankDetails?.Branch || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Account Opening Date</p>
            <p className="font-medium">{formatDate(data.bankDetails?.Bank_Acc_Date_of_Opening)}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Contacts */}
      {data.contacts && data.contacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.contacts.map((contact, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center">
                    {contact.contactDetails.C_Name} 
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {contact.role}
                    </span>
                  </h4>
                  <span className="text-sm text-muted-foreground">{contact.relationship}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {contact.contactDetails.C_Email} • {contact.contactDetails.C_Contact_Number}
                </div>
                {index < data.contacts.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Actions */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Processing
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" /> 
              Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
