
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
import { BankDetails } from "@/types/models";

const bankSchema = z.object({
  Bank_Acc_Name: z.string().min(2, { message: "Please enter the account holder name." }),
  Bank_Acc_Date_of_Opening: z.string().min(1, { message: "Please enter the account opening date." }),
  Bank_Name: z.string().min(2, { message: "Please enter the bank name." }),
  Branch: z.string().min(2, { message: "Please enter the branch name." }),
});

type BankFormValues = z.infer<typeof bankSchema>;

interface BankingDetailsStepProps {
  onNext: (data: Omit<BankDetails, 'Bank_Acc_No'>) => void;
  onBack: () => void;
  defaultValues?: Partial<BankDetails>;
}

export function BankingDetailsStep({ onNext, onBack, defaultValues }: BankingDetailsStepProps) {
  const form = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      Bank_Acc_Name: defaultValues?.Bank_Acc_Name || "",
      Bank_Acc_Date_of_Opening: defaultValues?.Bank_Acc_Date_of_Opening || "",
      Bank_Name: defaultValues?.Bank_Name || "",
      Branch: defaultValues?.Branch || "",
    },
  });

  function onSubmit(data: BankFormValues) {
    const bankDetails: Omit<BankDetails, 'Bank_Acc_No'> = {
      Bank_Acc_Name: data.Bank_Acc_Name,
      Bank_Acc_Date_of_Opening: data.Bank_Acc_Date_of_Opening,
      Bank_Name: data.Bank_Name,
      Branch: data.Branch,
    };
    
    onNext(bankDetails);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="Bank_Acc_Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="Bank_Acc_Date_of_Opening"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Opening Date</FormLabel>
              <FormControl>
                <Input 
                  placeholder="YYYY-MM-DD (e.g. 2024-01-15)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="Bank_Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Chase Bank" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Main Street Branch" {...field} />
                </FormControl>
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
