import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PersonalData } from "@/types/models";

const personalSchema = z.object({
  P_Name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  P_Address: z.string().min(5, { message: "Please enter your full address." }),
  P_Postal_Code: z.string().min(3, { message: "Please enter a valid postal code." }),
  P_Cell_Number: z.string()
    .length(11, { message: "Phone number must be exactly 11 digits." })
    .regex(/^09\d{9}$/, { message: "Please use format: 09XXXXXXXXX" }),
  Date_of_Birth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please use format: YYYY-MM-DD" }),
  Employment_Status: z.enum(['Employed', 'Unemployed', 'Self-Employed', 'Student', 'Retired']),
  Purpose_of_Opening: z.enum(['Savings', 'Investment', 'Business', 'Personal Use', 'Others']),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

interface PersonalDetailsStepProps {
  onNext: (data: Omit<PersonalData, "Funding_ID" | "Bank_Acc_No" | "Acc_ID">) => void;
  onBack: () => void;
  defaultValues?: Partial<PersonalData>;
}

export function PersonalDetailsStep({ onNext, onBack, defaultValues }: PersonalDetailsStepProps) {
  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      P_Name: defaultValues?.P_Name || "",
      P_Address: defaultValues?.P_Address || "",
      P_Postal_Code: defaultValues?.P_Postal_Code || "",
      P_Cell_Number: defaultValues?.P_Cell_Number?.toString() || "",
      Date_of_Birth: defaultValues?.Date_of_Birth || "",
      Employment_Status: (defaultValues?.Employment_Status as any) || "Employed",
      Purpose_of_Opening: (defaultValues?.Purpose_of_Opening as any) || "Savings",
    },
  });

  // Handle phone number input to restrict to 11 digits
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    
    // Limit to 11 digits
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    // Ensure it starts with 09 if user types digits
    if (value.length > 0 && !value.startsWith('09')) {
      if (value.startsWith('9')) {
        value = '0' + value;
      } else if (value.length >= 2 && !value.startsWith('09')) {
        // If user types something that doesn't start with 09, replace it
        value = '09' + value.slice(2);
      }
    }
    
    onChange(value);
  };

  function onSubmit(data: PersonalFormValues) {
    // Normalize phone number for backend validation
    let normalizedPhone = data.P_Cell_Number.replace(/\D/g, ''); // Remove all non-digits
    
    // Convert to standard format for backend
    if (normalizedPhone.startsWith('09')) {
      normalizedPhone = '63' + normalizedPhone.substring(1);
    } else if (normalizedPhone.startsWith('639')) {
      normalizedPhone = normalizedPhone;
    }
    
    const personalData: Omit<PersonalData, "Funding_ID" | "Bank_Acc_No" | "Acc_ID"> = { 
      P_Name: data.P_Name,
      P_Address: data.P_Address,
      P_Postal_Code: data.P_Postal_Code,
      P_Cell_Number: parseInt(normalizedPhone), // Convert to number as expected by backend
      P_Email: defaultValues?.P_Email || "",
      Date_of_Birth: data.Date_of_Birth, // Send as YYYY-MM-DD string
      Employment_Status: data.Employment_Status,
      Purpose_of_Opening: data.Purpose_of_Opening
    };
    
    console.log("Personal data being sent:", personalData);
    onNext(personalData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="P_Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Juan Dela Cruz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="P_Address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Rizal Street, Barangay San Jose, Quezon City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="P_Postal_Code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="1100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="P_Cell_Number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="09171234567" 
                  maxLength={11}
                  value={field.value}
                  onChange={(e) => handlePhoneNumberChange(e, field.onChange)}
                />
              </FormControl>
              <FormDescription>
                Enter your 11-digit mobile phone number (e.g., 09171234567)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Date_of_Birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="1990-01-15" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Enter date in YYYY-MM-DD format (e.g., 1990-01-15)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="Employment_Status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Purpose_of_Opening"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose of Opening Account</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Personal Use">Personal Use</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
}
