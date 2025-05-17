
import { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronDown,
  Download,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockTransactions = [
  {
    id: "trx-001",
    date: "2025-05-15",
    type: "deposit",
    amount: 5000,
    status: "completed",
    method: "Bank Transfer",
    description: "Initial deposit",
  },
  {
    id: "trx-002",
    date: "2025-05-10",
    type: "withdrawal",
    amount: 1200,
    status: "completed",
    method: "Bank Transfer",
    description: "Monthly profits",
  },
  {
    id: "trx-003",
    date: "2025-05-05",
    type: "deposit",
    amount: 3000,
    status: "completed",
    method: "Bank Transfer",
    description: "Trading funds",
  },
  {
    id: "trx-004",
    date: "2025-05-01",
    type: "withdrawal",
    amount: 500,
    status: "pending",
    method: "Bank Transfer",
    description: "",
  },
  {
    id: "trx-005",
    date: "2025-04-28",
    type: "deposit",
    amount: 2000,
    status: "completed",
    method: "Bank Transfer",
    description: "Investment capital",
  }
];

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || 
      transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select 
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[140px] flex-shrink-0">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {transaction.type === "deposit" ? (
                      <Badge variant="outline" className="bg-market-bull/10 text-market-bull border-market-bull/20">
                        <ArrowDownLeft className="mr-1 h-3 w-3" />
                        Deposit
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-market-bear/10 text-market-bear border-market-bear/20">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        Withdrawal
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className={transaction.type === "deposit" ? "text-market-bull" : "text-market-bear"}>
                  {transaction.type === "deposit" ? "+" : "-"}
                  ${transaction.amount.toLocaleString()}
                </TableCell>
                <TableCell>{transaction.method}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={transaction.status === "completed" 
                      ? "bg-primary/10 text-primary border-primary/20" 
                      : "bg-accent/10 text-accent border-accent/20"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.description || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionHistory;
