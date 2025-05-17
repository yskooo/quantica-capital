
import { useState } from "react";
import { Check, ChevronDown, CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Mock bank accounts data
const bankAccounts = [
  { id: "1", name: "Chase Bank", accountNumber: "****4532", type: "Checking" },
  { id: "2", name: "Bank of America", accountNumber: "****1234", type: "Savings" },
  { id: "3", name: "Wells Fargo", accountNumber: "****7890", type: "Checking" }
];

const BankAccountSelector = () => {
  const [open, setOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(bankAccounts[0]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Select Bank Account</h4>
        <Button variant="link" size="sm" className="h-auto p-0 text-primary">
          <Plus className="mr-2 h-3 w-3" /> Add New Account
        </Button>
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <span>{selectedBank.name} - {selectedBank.accountNumber}</span>
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {selectedBank.type}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search bank accounts..." className="h-9" />
            <CommandEmpty>No bank accounts found.</CommandEmpty>
            <CommandGroup>
              {bankAccounts.map((bank) => (
                <CommandItem
                  key={bank.id}
                  value={bank.name}
                  onSelect={() => {
                    setSelectedBank(bank);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 shrink-0 opacity-70" />
                    <span>{bank.name} - {bank.accountNumber}</span>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedBank.id === bank.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BankAccountSelector;
