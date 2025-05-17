
import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface FundingFormProps {
  action: "deposit" | "withdraw";
}

const FundingForm = ({ action }: FundingFormProps) => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      
      if (action === "deposit") {
        toast.success(`$${amount} successfully deposited to your account`);
      } else {
        toast.success(`$${amount} withdrawal initiated`);
      }
      
      setAmount("");
    }, 1500);
  };

  const presetAmounts = ["100", "500", "1,000", "5,000"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount ({action === "deposit" ? "to deposit" : "to withdraw"})</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="amount"
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-9 font-medium text-lg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Quick Select</Label>
        <div className="grid grid-cols-4 gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant="outline"
              onClick={() => setAmount(preset.replace(",", ""))}
              className="text-sm"
            >
              ${preset}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input id="description" placeholder={action === "deposit" ? "Funding trading account" : "Withdraw to bank"} />
      </div>

      <div className="space-y-2 bg-secondary/10 p-4 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Transaction Fee:</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total {action === "deposit" ? "Deposit" : "Withdrawal"}:</span>
          <span>${amount ? parseFloat(amount.replace(/,/g, "")).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={isProcessing || !amount}
        >
          {isProcessing ? (
            "Processing..."
          ) : (
            <>
              {action === "deposit" ? (
                <>
                  <ArrowDownLeft className="mr-2 h-4 w-4" /> 
                  Deposit Funds
                </>
              ) : (
                <>
                  <ArrowUpRight className="mr-2 h-4 w-4" /> 
                  Withdraw Funds
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FundingForm;
