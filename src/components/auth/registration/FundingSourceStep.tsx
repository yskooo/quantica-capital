
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { SourceOfFunding } from "@/types/models";

const fundingSchema = z.object({
  Nature_of_Work: z.string().min(2, { message: "Please enter your occupation or nature of work." }),
  'Business/School_Name': z.string().min(2, { message: "Please enter your company or school name." }),
  'Office/School_Address': z.string().min(5, { message: "Please enter your office or school address." }),
  'Office/School_Number': z.string().optional(),
  Valid_ID: z.enum(['Driver\'s License', 'Passport', 'SSS ID', 'PhilHealth ID', 'Others']),
  Source_of_Income: z.enum(['Salary', 'Business', 'Remittance', 'Scholarship', 'Pension', 'Others']),
});

type FundingFormValues = z.infer<typeof fundingSchema>;

interface FundingSourceStepProps {
  onNext: (data: Omit<SourceOfFunding, "Funding_ID">) => void;
  onBack: () => void;
  defaultValues?: Partial<SourceOfFunding>;
}

export function FundingSourceStep({ onNext, onBack, defaultValues }: FundingSourceStepProps) {
  const form = useForm<FundingFormValues>({
    resolver: zodResolver(fundingSchema),
    defaultValues: {
      Nature_of_Work: defaultValues?.Nature_of_Work || "",
      'Business/School_Name': defaultValues?.['Business/School_Name'] || "",
      'Office/School_Address': defaultValues?.['Office/School_Address'] || "",
      'Office/School_Number': defaultValues?.['Office/School_Number'] || "",
      Valid_ID: (defaultValues?.Valid_ID as any) || "Passport",
      Source_of_Income: (defaultValues?.Source_of_Income as any) || "Salary",
    },
  });

  function onSubmit(data: FundingFormValues) {
    // Ensure all required properties are provided before calling onNext
    const fundingSource: Omit<SourceOfFunding, "Funding_ID"> = {
      Nature_of_Work: data.Nature_of_Work,
      'Business/School_Name': data['Business/School_Name'],
      'Office/School_Address': data['Office/School_Address'],
      'Office/School_Number': data['Office/School_Number'],
      Valid_ID: data.Valid_ID,
      Source_of_Income: data.Source_of_Income,
    };
    
    onNext(fundingSource);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="Nature_of_Work"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation / Nature of Work</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Software Engineer, Student" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Business/School_Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name / Educational Institution</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Acme Inc., University of Technology" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Office/School_Address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Office / School Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Business Ave, City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Office/School_Number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company / School Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. +1 (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="Valid_ID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid ID Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Driver's License">Driver's License</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="SSS ID">SSS ID</SelectItem>
                    <SelectItem value="PhilHealth ID">PhilHealth ID</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Source_of_Income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Source of Income</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Remittance">Remittance</SelectItem>
                    <SelectItem value="Scholarship">Scholarship</SelectItem>
                    <SelectItem value="Pension">Pension</SelectItem>
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
