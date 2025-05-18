
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { portfolioService } from "@/services/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Transaction type colors and icons
const getTransactionColor = (type: string) => {
  switch (type) {
    case 'BUY':
      return 'bg-market-bull/10 text-market-bull border-market-bull/20';
    case 'SELL':
      return 'bg-market-bear/10 text-market-bear border-market-bear/20';
    case 'DEPOSIT':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'WITHDRAWAL':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'DIVIDEND':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default:
      return 'bg-primary/10 text-primary border-primary/20';
  }
};

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'PENDING':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'FAILED':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'CANCELLED':
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    default:
      return 'bg-primary/10 text-primary border-primary/20';
  }
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const { data: transactionsResponse, isLoading } = useQuery({
    queryKey: ['portfolio-transactions'],
    queryFn: () => portfolioService.getTransactions()
  });
  
  // Filter transactions based on search term and type filter
  const filteredTransactions = transactionsResponse?.data?.filter(transaction => {
    const matchesSearch = searchTerm ? 
      (transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (transaction.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) || false)) : 
      true;
    
    const matchesType = typeFilter !== "all" ? transaction.type === typeFilter : true;
    
    return matchesSearch && matchesType;
  }) || [];
  
  // Paginate transactions
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
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
              <SelectTrigger className="w-[160px] flex-shrink-0">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BUY">Buy Orders</SelectItem>
                <SelectItem value="SELL">Sell Orders</SelectItem>
                <SelectItem value="DEPOSIT">Deposits</SelectItem>
                <SelectItem value="WITHDRAWAL">Withdrawals</SelectItem>
                <SelectItem value="DIVIDEND">Dividends</SelectItem>
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
                <TableHead>Symbol</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Loading transactions...</TableCell>
                </TableRow>
              ) : paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">No transactions found</TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {format(new Date(transaction.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTransactionColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.symbol || "-"}</TableCell>
                    <TableCell>
                      {transaction.quantity !== undefined ? transaction.quantity.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      {transaction.price !== undefined ? formatCurrency(transaction.price) : "-"}
                    </TableCell>
                    <TableCell className={
                      transaction.type === "BUY" || transaction.type === "WITHDRAWAL" 
                        ? "text-market-bear" 
                        : "text-market-bull"
                    }>
                      {(transaction.type === "BUY" || transaction.type === "WITHDRAWAL") ? "-" : "+"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredTransactions.length > itemsPerPage && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
