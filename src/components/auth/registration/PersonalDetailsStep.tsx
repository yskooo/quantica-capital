
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PersonalData } from "@/types/models";

const personalSchema = z.object({
  P_Name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  P_Address: z.string().min(5, { message: "Please enter your full address." }),
  P_Postal_Code: z.string().min(3, { message: "Please enter a valid postal code." }),
  P_Cell_Number: z.string()
    .min(10, { message: "Please enter a valid phone number." })
    .regex(/^(\+63|0)[0-9]{10}$/, { message: "Please enter a valid Philippine phone number (e.g., +639123456789 or 09123456789)" }),
  Date_of_Birth: z.date({
    required_error: "Please select your date of birth.",
  }),
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
      Date_of_Birth: defaultValues?.Date_of_Birth ? new Date(defaultValues.Date_of_Birth) : undefined,
      Employment_Status: (defaultValues?.Employment_Status as any) || "Employed",
      Purpose_of_Opening: (defaultValues?.Purpose_of_Opening as any) || "Savings",
    },
  });

  function onSubmit(data: PersonalFormValues) {
    // Ensure all required properties are provided before calling onNext
    const personalData: Omit<PersonalData, "Funding_ID" | "Bank_Acc_No" | "Acc_ID"> = { 
      P_Name: data.P_Name,
      P_Address: data.P_Address,
      P_Postal_Code: data.P_Postal_Code,
      P_Cell_Number: data.P_Cell_Number, // Keep as string for backend
      P_Email: defaultValues?.P_Email || "",
      Date_of_Birth: data.Date_of_Birth.toISOString(),
      Employment_Status: data.Employment_Status,
      Purpose_of_Opening: data.Purpose_of_Opening
    };
    
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
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="123 Main St, City" {...field} />
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
                <Input placeholder="12345" {...field} />
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
                  placeholder="+639123456789 or 09123456789" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Enter your Philippine mobile phone number (e.g., +639123456789 or 09123456789)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Date_of_Birth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
