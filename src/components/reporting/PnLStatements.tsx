
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportingService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { Download, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const periodOptions = [
  { value: "all", label: "All Periods" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annual" },
];

const yearOptions = [2025, 2024, 2023];

const PnLStatements = () => {
  const [period, setPeriod] = useState("all");
  const [year, setYear] = useState<number>(2025);
  const [viewStatementId, setViewStatementId] = useState<string | null>(null);
  
  // Fetch PnL statements with filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pnl-statements', period, year],
    queryFn: () => reportingService.getPnLStatements({ period, year }),
    // Mock data for preview
    initialData: { 
      data: [
        {
          id: "pnl-001",
          period: "MONTHLY",
          startDate: "2025-04-01",
          endDate: "2025-04-30",
          totalPnL: 2458.75,
          realizedPnL: 1875.25,
          unrealizedPnL: 583.50,
          trades: 12,
          fees: 35.88,
          tax: 0,
          generatedAt: "2025-05-02T10:15:30.000Z",
          status: "GENERATED",
        },
        {
          id: "pnl-002",
          period: "MONTHLY",
          startDate: "2025-03-01",
          endDate: "2025-03-31",
          totalPnL: -1245.50,
          realizedPnL: -850.75,
          unrealizedPnL: -394.75,
          trades: 8,
          fees: 23.92,
          tax: 0,
          generatedAt: "2025-04-02T09:30:15.000Z",
          status: "GENERATED",
        },
        {
          id: "pnl-003",
          period: "QUARTERLY",
          startDate: "2025-01-01",
          endDate: "2025-03-31",
          totalPnL: 6542.30,
          realizedPnL: 4257.85,
          unrealizedPnL: 2284.45,
          trades: 27,
          fees: 80.73,
          tax: 0,
          generatedAt: "2025-04-05T11:45:22.000Z",
          status: "GENERATED",
        },
        {
          id: "pnl-004",
          period: "ANNUALLY",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          totalPnL: 24689.75,
          realizedPnL: 18457.30,
          unrealizedPnL: 6232.45,
          trades: 98,
          fees: 292.02,
          tax: 3703.46,
          generatedAt: "2025-01-15T14:20:10.000Z",
          status: "GENERATED",
        },
      ], 
      error: null 
    }
  });
  
  // Details query for viewing a statement
  const { data: statementDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['pnl-statement-details', viewStatementId],
    queryFn: () => viewStatementId ? reportingService.getPnLStatementById(viewStatementId) : null,
    enabled: !!viewStatementId,
    // Mock data for preview
    initialData: viewStatementId ? { 
      data: data?.data.find(stmt => stmt.id === viewStatementId) || null,
      error: null 
    } : null
  });
  
  // Filter statements based on period and year
  const filteredStatements = data?.data?.filter(statement => {
    if (period !== "all" && statement.period.toLowerCase() !== period) return false;
    if (year && new Date(statement.startDate).getFullYear() !== year) return false;
    return true;
  }) || [];
  
  // Handle download
  const handleDownload = async (id: string) => {
    try {
      const response = await reportingService.downloadPnLStatement(id);
      if (response.data?.downloadUrl) {
        // In a real app, this would trigger a download
        toast.success("Download started");
      } else {
        toast.error("Failed to download statement");
      }
    } catch (error) {
      toast.error("Error downloading statement");
    }
  };
  
  const formatPeriodLabel = (statement: any) => {
    const startDate = new Date(statement.startDate);
    const endDate = new Date(statement.endDate);
    
    switch (statement.period) {
      case "MONTHLY":
        return `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`;
      case "QUARTERLY":
        const quarter = Math.floor(startDate.getMonth() / 3) + 1;
        return `Q${quarter} ${startDate.getFullYear()}`;
      case "ANNUALLY":
        return `Annual ${startDate.getFullYear()}`;
      default:
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
  };
  
  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Profit & Loss Statements</CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Statement Period</SelectLabel>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Year</SelectLabel>
                  {yearOptions.map((yearOption) => (
                    <SelectItem key={yearOption} value={yearOption.toString()}>
                      {yearOption}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-6">Loading PnL statements...</div>
          ) : error ? (
            <div className="text-center text-destructive p-6">Error loading PnL statements</div>
          ) : filteredStatements.length === 0 ? (
            <div className="text-center text-muted-foreground p-6">No PnL statements found for the selected criteria</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Total P&L</TableHead>
                    <TableHead className="text-right">Realized</TableHead>
                    <TableHead className="text-right">Unrealized</TableHead>
                    <TableHead className="text-right">Trades</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStatements.map((statement) => (
                    <TableRow key={statement.id}>
                      <TableCell className="font-medium">
                        {formatPeriodLabel(statement)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {statement.period}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${statement.totalPnL >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                        {statement.totalPnL >= 0 ? '+' : ''}${statement.totalPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </TableCell>
                      <TableCell className={`text-right ${statement.realizedPnL >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                        {statement.realizedPnL >= 0 ? '+' : ''}${statement.realizedPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </TableCell>
                      <TableCell className={`text-right ${statement.unrealizedPnL >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                        {statement.unrealizedPnL >= 0 ? '+' : ''}${statement.unrealizedPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </TableCell>
                      <TableCell className="text-right">
                        {statement.trades}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setViewStatementId(statement.id)}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDownload(statement.id)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statement Detail Dialog */}
      <Dialog open={!!viewStatementId} onOpenChange={(isOpen) => !isOpen && setViewStatementId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {statementDetails?.data && formatPeriodLabel(statementDetails.data)} P&L Statement
            </DialogTitle>
          </DialogHeader>
          {isLoadingDetails ? (
            <div className="flex justify-center p-6">Loading statement details...</div>
          ) : statementDetails?.data ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="font-semibold text-lg">
                    {formatPeriodLabel(statementDetails.data)}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {new Date(statementDetails.data.startDate).toLocaleDateString()} - 
                    {" "}
                    {new Date(statementDetails.data.endDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge 
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {statementDetails.data.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total P&L</p>
                  <p className={`font-semibold text-lg ${statementDetails.data.totalPnL >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                    {statementDetails.data.totalPnL >= 0 ? '+' : ''}
                    ${statementDetails.data.totalPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Generated Date</p>
                  <p>
                    {new Date(statementDetails.data.generatedAt).toLocaleDateString()} 
                    {" "}
                    {new Date(statementDetails.data.generatedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Realized P&L</p>
                  <p className={statementDetails.data.realizedPnL >= 0 ? 'text-market-bull' : 'text-market-bear'}>
                    {statementDetails.data.realizedPnL >= 0 ? '+' : ''}
                    ${statementDetails.data.realizedPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unrealized P&L</p>
                  <p className={statementDetails.data.unrealizedPnL >= 0 ? 'text-market-bull' : 'text-market-bear'}>
                    {statementDetails.data.unrealizedPnL >= 0 ? '+' : ''}
                    ${statementDetails.data.unrealizedPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                  <p>{statementDetails.data.trades}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Fees</p>
                  <p>${statementDetails.data.fees.toFixed(2)}</p>
                </div>
                {statementDetails.data.tax > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tax</p>
                    <p>${statementDetails.data.tax.toFixed(2)}</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Performance Summary</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  This statement summarizes your trading performance for {formatPeriodLabel(statementDetails.data)}.
                  You completed {statementDetails.data.trades} trades during this period with
                  {statementDetails.data.totalPnL >= 0 ? ' a profit' : ' a loss'} of
                  ${Math.abs(statementDetails.data.totalPnL).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}.
                </p>
                
                <p className="text-sm">
                  For detailed transaction history, please download the full statement.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-destructive p-6">Failed to load statement details</div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setViewStatementId(null)}
            >
              Close
            </Button>
            {statementDetails?.data && (
              <Button
                onClick={() => handleDownload(statementDetails.data.id)}
              >
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PnLStatements;
