
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

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

const accountSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email address." })
    .max(60, { message: "Email cannot exceed 60 characters." }),
  password: z.string()
    .min(4, { message: "PIN must be at least 4 digits." })
    .regex(/^\d+$/, { message: "PIN must contain only numbers." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "PINs do not match.",
  path: ["confirmPassword"],
});


type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountStepProps {
  onNext: (data: { email: string; password: string }) => void;
  defaultValues?: { email: string; password: string };
}

export function AccountStep({ onNext, defaultValues }: AccountStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: defaultValues?.email || "",
      password: defaultValues?.password || "",
      confirmPassword: defaultValues?.password || "",
    },
  });

  function onSubmit(data: AccountFormValues) {
    console.log("Account step data:", { email: data.email });
    onNext({ 
      email: data.email, 
      password: data.password 
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (P_Email)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="name@example.com" 
                  type="email" 
                  autoComplete="email"
                  maxLength={60}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="pr-10" 
                    {...field} 
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button type="submit" className="w-full">Continue</Button>
        </div>
      </form>
    </Form>
  );
}
