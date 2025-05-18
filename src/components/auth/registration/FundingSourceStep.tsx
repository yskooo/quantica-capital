
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
  natureOfWork: z.string().min(2, { message: "Please enter your occupation or nature of work." }),
  businessNameOrEducInstitution: z.string().min(2, { message: "Please enter your company or school name." }),
  officeSchoolAddress: z.string().min(5, { message: "Please enter your office or school address." }),
  companySchoolNumber: z.string().optional(),
  validId: z.enum(['Driver\'s License', 'Passport', 'SSS ID', 'PhilHealth', 'Other']),
  sourceOfIncome: z.enum(['Salary', 'Business', 'Remittance', 'Scholarship', 'Allowance']),
});

type FundingFormValues = z.infer<typeof fundingSchema>;

interface FundingSourceStepProps {
  onNext: (data: Omit<SourceOfFunding, "fundingId">) => void;
  onBack: () => void;
  defaultValues?: Partial<SourceOfFunding>;
}

export function FundingSourceStep({ onNext, onBack, defaultValues }: FundingSourceStepProps) {
  const form = useForm<FundingFormValues>({
    resolver: zodResolver(fundingSchema),
    defaultValues: {
      natureOfWork: defaultValues?.natureOfWork || "",
      businessNameOrEducInstitution: defaultValues?.businessNameOrEducInstitution || "",
      officeSchoolAddress: defaultValues?.officeSchoolAddress || "",
      companySchoolNumber: defaultValues?.companySchoolNumber || "",
      validId: (defaultValues?.validId as any) || "Passport",
      sourceOfIncome: (defaultValues?.sourceOfIncome as any) || "Salary",
    },
  });

  function onSubmit(data: FundingFormValues) {
    onNext(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="natureOfWork"
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
          name="businessNameOrEducInstitution"
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
          name="officeSchoolAddress"
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
          name="companySchoolNumber"
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
            name="validId"
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
                    <SelectItem value="PhilHealth">PhilHealth</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sourceOfIncome"
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
                    <SelectItem value="Allowance">Allowance</SelectItem>
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
