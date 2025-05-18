
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportingService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Download, FileText, Search, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const TradeConfirmations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [viewConfirmation, setViewConfirmation] = useState<string | null>(null);
  
  // Custom date range (in a real app, you'd use a date picker)
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  // Calculate date range based on selection
  const getDateRange = () => {
    switch (dateRange) {
      case "week":
        return { startDate: format(lastWeek, "yyyy-MM-dd") };
      case "month":
        return { startDate: format(lastMonth, "yyyy-MM-dd") };
      default:
        return {};
    }
  };

  // Fetch trade confirmations with filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['trade-confirmations', dateRange],
    queryFn: () => reportingService.getTradeConfirmations(getDateRange()),
    // Mock data for preview
    initialData: { 
      data: [
        { 
          id: "tc-001", 
          tradeId: "TR-9876",
          symbol: "AAPL", 
          side: "BUY", 
          quantity: 10, 
          price: 190.50, 
          fees: 2.99, 
          total: 1907.99, 
          executionTime: "2025-05-17T14:23:15.000Z", 
          settlementDate: "2025-05-19T00:00:00.000Z",
          status: "SETTLED",
          broker: "Quantica Securities",
          accountId: "ACC123456",
        },
        { 
          id: "tc-002", 
          tradeId: "TR-9875",
          symbol: "MSFT", 
          side: "SELL", 
          quantity: 5, 
          price: 335.75, 
          fees: 2.99, 
          total: 1675.76, 
          executionTime: "2025-05-15T10:15:22.000Z", 
          settlementDate: "2025-05-17T00:00:00.000Z",
          status: "SETTLED",
          broker: "Quantica Securities",
          accountId: "ACC123456",
        },
        { 
          id: "tc-003", 
          tradeId: "TR-9874",
          symbol: "NVDA", 
          side: "BUY", 
          quantity: 2, 
          price: 950.25, 
          fees: 2.99, 
          total: 1903.49, 
          executionTime: "2025-05-12T09:31:05.000Z", 
          settlementDate: "2025-05-14T00:00:00.000Z",
          status: "SETTLED",
          broker: "Quantica Securities",
          accountId: "ACC123456",
        },
        { 
          id: "tc-004", 
          tradeId: "TR-9873",
          symbol: "TSLA", 
          side: "SELL", 
          quantity: 3, 
          price: 245.30, 
          fees: 2.99, 
          total: 733.91, 
          executionTime: "2025-05-10T15:45:30.000Z", 
          settlementDate: "2025-05-12T00:00:00.000Z",
          status: "SETTLED",
          broker: "Quantica Securities",
          accountId: "ACC123456",
        }
      ], 
      error: null 
    }
  });
  
  // Details query for viewing a confirmation
  const { data: confirmationDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['trade-confirmation-details', viewConfirmation],
    queryFn: () => viewConfirmation ? reportingService.getTradeConfirmationById(viewConfirmation) : null,
    enabled: !!viewConfirmation,
    // Mock data for preview
    initialData: viewConfirmation ? { 
      data: data?.data.find(conf => conf.id === viewConfirmation) || null,
      error: null 
    } : null
  });
  
  // Filter confirmations based on search term
  const filteredConfirmations = data?.data?.filter(confirmation =>
    confirmation.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    confirmation.tradeId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Handle download
  const handleDownload = async (id: string) => {
    try {
      const response = await reportingService.downloadTradeConfirmation(id);
      if (response.data?.downloadUrl) {
        // In a real app, this would trigger a download
        toast.success("Download started");
      } else {
        toast.error("Failed to download confirmation");
      }
    } catch (error) {
      toast.error("Error downloading confirmation");
    }
  };
  
  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Trade Confirmations</CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by symbol or trade ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px] flex-shrink-0">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="week">Past week</SelectItem>
                <SelectItem value="month">Past month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-6">Loading trade confirmations...</div>
          ) : error ? (
            <div className="text-center text-destructive p-6">Error loading trade confirmations</div>
          ) : filteredConfirmations.length === 0 ? (
            <div className="text-center text-muted-foreground p-6">No trade confirmations found</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Trade ID</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConfirmations.map((confirmation) => (
                    <TableRow key={confirmation.id}>
                      <TableCell>
                        {new Date(confirmation.executionTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{confirmation.tradeId}</TableCell>
                      <TableCell className="font-medium">{confirmation.symbol}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={confirmation.side === "BUY" 
                            ? "bg-market-bull/10 text-market-bull border-market-bull/20" 
                            : "bg-market-bear/10 text-market-bear border-market-bear/20"
                          }
                        >
                          {confirmation.side}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{confirmation.quantity}</TableCell>
                      <TableCell className="text-right">${confirmation.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${confirmation.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {confirmation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setViewConfirmation(confirmation.id)}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDownload(confirmation.id)}
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

      {/* Confirmation Detail Dialog */}
      <Dialog open={!!viewConfirmation} onOpenChange={(isOpen) => !isOpen && setViewConfirmation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Trade Confirmation</DialogTitle>
          </DialogHeader>
          {isLoadingDetails ? (
            <div className="flex justify-center p-6">Loading confirmation details...</div>
          ) : confirmationDetails?.data ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="font-semibold text-lg">
                    {confirmationDetails.data.side} {confirmationDetails.data.symbol}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Trade ID: {confirmationDetails.data.tradeId}
                  </p>
                </div>
                <Badge 
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {confirmationDetails.data.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Execution Time</p>
                  <p>
                    {new Date(confirmationDetails.data.executionTime).toLocaleDateString()} 
                    {" "}
                    {new Date(confirmationDetails.data.executionTime).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Settlement Date</p>
                  <p>{new Date(confirmationDetails.data.settlementDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                  <p>{confirmationDetails.data.quantity} shares</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p>${confirmationDetails.data.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fees</p>
                  <p>${confirmationDetails.data.fees.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="font-semibold">${confirmationDetails.data.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Broker</p>
                  <p>{confirmationDetails.data.broker}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account</p>
                  <p>{confirmationDetails.data.accountId}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-destructive p-6">Failed to load confirmation details</div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setViewConfirmation(null)}
            >
              Close
            </Button>
            {confirmationDetails?.data && (
              <Button
                onClick={() => handleDownload(confirmationDetails.data.id)}
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

export default TradeConfirmations;
