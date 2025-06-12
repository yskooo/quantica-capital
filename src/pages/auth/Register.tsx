import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertTriangle, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RegistrationStepper } from "@/components/auth/RegistrationStepper";
import {
  AccountStep,
  BankingDetailsStep,
  ContactsStep,
  FundingSourceStep,
  PersonalDetailsStep,
  ReviewStep,
} from "@/components/auth/registration";
import {
  RegistrationData,
  PersonalData,
  SourceOfFunding,
  BankDetails,
  ContactRole
} from "@/types/models";
import { registrationService } from "@/services/api/registration";

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** ------------------------------------------------------------------
   *  ⬇️ STATE
   *  ------------------------------------------------------------------ */
  const [formData, setFormData] = useState<Partial<RegistrationData>>({
    credentials: { email: "", password: "" },
    personalData: {} as PersonalData,
    sourceOfFunding: {} as SourceOfFunding,
    bankDetails: {} as BankDetails,
    contacts: [] as ContactRole[]
  });

  /** ------------------------------------------------------------------
   *  ⬇️ STEP HANDLERS
   *  ------------------------------------------------------------------ */
  const handleAccountSubmit = (data: { email: string; password: string }) => {
    setFormData(prev => ({
      ...prev,
      credentials: data,
      personalData: {
        ...(prev.personalData as PersonalData),
        P_Email: data.email // 1️⃣ seed P_Email early
      }
    }));
    setCurrentStep(1);
  };

  const handlePersonalDetailsSubmit = (
    data: Omit<PersonalData, "Funding_ID" | "Bank_Acc_No" | "Acc_ID">
  ) => {
    setFormData(prev => ({
      ...prev,
      personalData: {
        ...prev.personalData,
        ...data,
        // 2️⃣ keep whichever has a value – the form field or the account email
        P_Email: data.P_Email ?? prev.credentials?.email ?? ""
      }
    }));
    setCurrentStep(2);
  };

  const handleFundingSourceSubmit = (
    data: Omit<SourceOfFunding, "Funding_ID">
  ) => {
    setFormData(prev => ({
      ...prev,
      sourceOfFunding: { ...(prev.sourceOfFunding as SourceOfFunding), ...data }
    }));
    setCurrentStep(3);
  };

  const handleBankingDetailsSubmit = (data: Omit<BankDetails, "Bank_Acc_No">) => {
    setFormData(prev => ({ ...prev, bankDetails: data }));
    setCurrentStep(4);
  };

  const handleContactsSubmit = (contacts: ContactRole[]) => {
    setFormData(prev => ({ ...prev, contacts }));
    setCurrentStep(5);
  };

  /** ------------------------------------------------------------------
 *  ⬇️ FINAL SUBMIT
 *  ------------------------------------------------------------------ */
const handleSubmitRegistration = async () => {
  setIsSubmitting(true);

  /* ⚙️ Build a payload that ALWAYS carries an e-mail in personalData.P_Email */
  const payload: RegistrationData = {
    ...formData as RegistrationData,
    personalData: {
      ...(formData.personalData as PersonalData),
      P_Email:
        formData.personalData?.P_Email ||          // what the user typed in the personal step
        formData.credentials?.email  ||            // fallback to account-step email
        ""                                         // final fallback: empty string
    }
  };

  /* 🐞 quick sanity check in the console */
  console.log("✔️ P_Email being sent:", payload.personalData.P_Email);
  console.log("FINAL payload being sent:", JSON.stringify(payload, null, 2));

  try {
    const response = await registrationService.register(payload);

    if (response.error) {
      toast.error("Registration failed", { description: response.error });
      return;
    }

    if (
      response.data &&
      typeof response.data === "object" &&
      "token" in response.data
    ) {
      localStorage.setItem("auth_token", response.data.token as string);
    }

    if (
      response.data &&
      typeof response.data === "object" &&
      "user" in response.data
    ) {
      localStorage.setItem("user_data", JSON.stringify(response.data.user));
    }

    toast.success("Registration successful!", {
      description: "Your account has been created successfully.",
      action: { label: "Go to Dashboard", onClick: () => navigate("/profile") }
    });

    navigate("/profile");
  } catch (error) {
    console.error("Registration error:", error);
    toast.error("Registration failed", {
      description:
        error instanceof Error
          ? error.message
          : "There was an error processing your application. Please try again."
    });
  } finally {
    setIsSubmitting(false);
  }
};

  /** ------------------------------------------------------------------
   *  ⬇️ RENDER
   *  ------------------------------------------------------------------ */
  return (
    <>
      <Navbar />
      <main className="container max-w-4xl py-10 md:py-16 px-4">
        <Card className="glass-card overflow-hidden border-muted/50">
          <CardContent className="p-6 md:p-8 pb-8">
            <RegistrationStepper
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              formData={formData}
            />

            {/* ————— STEP CONTENT ————— */}
            {currentStep === 0 && (
              <AccountStep
                onNext={handleAccountSubmit}
                defaultValues={formData.credentials}
              />
            )}

            {currentStep === 1 && (
              <PersonalDetailsStep
                onNext={handlePersonalDetailsSubmit}
                onBack={() => setCurrentStep(0)}
                defaultValues={formData.personalData}
              />
            )}

            {currentStep === 2 && (
              <FundingSourceStep
                onNext={handleFundingSourceSubmit}
                onBack={() => setCurrentStep(1)}
                defaultValues={formData.sourceOfFunding}
              />
            )}

            {currentStep === 3 && (
              <BankingDetailsStep
                onNext={handleBankingDetailsSubmit}
                onBack={() => setCurrentStep(2)}
                defaultValues={formData.bankDetails}
              />
            )}

            {currentStep === 4 && (
              <>
                {/* <Alert className="bg-muted/50 mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Required Information</AlertTitle>
                  <AlertDescription>
                    You must add at least one contact with the role “Kin” to
                    proceed.
                  </AlertDescription>
                </Alert> */}

                <ContactsStep
                  onNext={handleContactsSubmit}
                  onBack={() => setCurrentStep(3)}
                  defaultValues={formData.contacts}
                />
              </>
            )}

            {currentStep === 5 && (
              <>
                <ReviewStep
                  data={formData}
                  onBack={() => setCurrentStep(4)}
                  onSubmit={handleSubmitRegistration}
                  isSubmitting={isSubmitting}
                />
                <Alert variant="default" className="bg-primary/10 mt-6">
                  <Check className="h-4 w-4 text-primary" />
                  <AlertTitle>Application ready for submission</AlertTitle>
                  <AlertDescription className="text-muted-foreground">
                    By clicking submit, you agree to our Terms of Service and
                    Privacy Policy. Your application will be reviewed within
                    1-2 business days.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Register;
