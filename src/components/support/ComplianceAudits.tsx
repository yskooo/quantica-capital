
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { complianceService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ClipboardList, Download, FileText, RefreshCw, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const auditSchema = z.object({
  type: z.enum(["ACCOUNT_ACTIVITY", "TRADING_PATTERN", "TAX_COMPLIANCE", "KYC_VERIFICATION"], {
    required_error: "Please select an audit type.",
  }),
  startDate: z.string({
    required_error: "Please select a start date.",
  }),
  endDate: z.string({
    required_error: "Please select an end date.",
  }),
  description: z.string().optional(),
});

const ComplianceAudits = () => {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [viewAuditId, setViewAuditId] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof auditSchema>>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      type: "ACCOUNT_ACTIVITY",
      startDate: format(new Date(new Date().setMonth(new Date().getMonth() - 1)), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      description: "",
    },
  });
  
  // Fetch audits
  const { data: audits, isLoading, refetch } = useQuery({
    queryKey: ["audits"],
    queryFn: () => complianceService.getAllAudits(),
    // Mock data for preview
    initialData: {
      data: [
        {
          id: "audit-001",
          requestId: "req-001",
          status: "COMPLETED",
          requestedAt: "2025-04-15T10:30:00.000Z",
          completedAt: "2025-04-20T14:45:22.000Z",
          type: "ACCOUNT_ACTIVITY",
          findings: "No suspicious account activities detected. All transactions are properly documented and verified.",
          recommendations: "Continue maintaining detailed records of transactions.",
          compliance: "COMPLIANT",
          auditor: "Compliance Department",
          startDate: "2025-03-01",
          endDate: "2025-03-31",
        },
        {
          id: "audit-002",
          requestId: "req-002",
          status: "IN_PROGRESS",
          requestedAt: "2025-05-10T09:15:30.000Z",
          type: "TRADING_PATTERN",
          startDate: "2025-04-01",
          endDate: "2025-04-30",
        }
      ],
      error: null,
    },
  });

  // Fetch audit details
  const { data: auditDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["audit", viewAuditId],
    queryFn: () => viewAuditId ? complianceService.getAuditById(viewAuditId) : null,
    enabled: !!viewAuditId,
    // Mock data for preview
    initialData: viewAuditId ? { 
      data: audits?.data.find(a => a.id === viewAuditId) || null,
      error: null 
    } : null
  });

  // Request a new audit
  const onSubmit = async (values: z.infer<typeof auditSchema>) => {
    try {
      const result = await complianceService.requestAudit(values);
      if (result.data) {
        toast.success("Audit requested successfully");
        setIsRequestDialogOpen(false);
        form.reset({
          type: "ACCOUNT_ACTIVITY",
          startDate: format(new Date(new Date().setMonth(new Date().getMonth() - 1)), "yyyy-MM-dd"),
          endDate: format(new Date(), "yyyy-MM-dd"),
          description: "",
        });
        refetch();
      } else {
        toast.error("Failed to request audit");
      }
    } catch (error) {
      toast.error("Error requesting audit");
      console.error("Request audit error:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Requested</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="bg-market-bull/10 text-market-bull border-market-bull/20">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-market-bear/10 text-market-bear border-market-bear/20">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getComplianceBadge = (compliance: string) => {
    switch (compliance) {
      case "COMPLIANT":
        return <Badge variant="outline" className="bg-market-bull/10 text-market-bull border-market-bull/20">Compliant</Badge>;
      case "NON_COMPLIANT":
        return <Badge variant="outline" className="bg-market-bear/10 text-market-bear border-market-bear/20">Non-Compliant</Badge>;
      case "PARTIALLY_COMPLIANT":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Partially Compliant</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Pending</Badge>;
      default:
        return <Badge variant="outline">{compliance}</Badge>;
    }
  };

  const getAuditTypeBadge = (type: string) => {
    switch (type) {
      case "ACCOUNT_ACTIVITY":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Account Activity</Badge>;
      case "TRADING_PATTERN":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Trading Pattern</Badge>;
      case "TAX_COMPLIANCE":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Tax Compliance</Badge>;
      case "KYC_VERIFICATION":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">KYC Verification</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Download audit report
  const handleDownload = async (id: string) => {
    toast.success("Audit report download started");
    // In a real app, this would trigger a download
  };

  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-semibold">Compliance Audits</CardTitle>
            <CardDescription>Request and view compliance audit reports</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <ClipboardList className="h-4 w-4 mr-2" /> Request Audit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Request Compliance Audit</DialogTitle>
                  <DialogDescription>
                    Specify the type and date range for your compliance audit request.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Audit Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an audit type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ACCOUNT_ACTIVITY">Account Activity</SelectItem>
                              <SelectItem value="TRADING_PATTERN">Trading Pattern</SelectItem>
                              <SelectItem value="TAX_COMPLIANCE">Tax Compliance</SelectItem>
                              <SelectItem value="KYC_VERIFICATION">KYC Verification</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <input 
                                type="date" 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <input 
                                type="date" 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide any additional context for this audit request..." 
                              className="min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Request Audit</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6">Loading audits...</div>
          ) : audits?.data?.length === 0 ? (
            <div className="text-center p-6 border rounded-md bg-background/50">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium mb-1">No audits found</h3>
              <p className="text-muted-foreground mb-4">You haven't requested any compliance audits yet.</p>
              <Button onClick={() => setIsRequestDialogOpen(true)}>
                <ClipboardList className="h-4 w-4 mr-2" /> Request Audit
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Requested</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    {audits?.data.some(audit => audit.compliance) && (
                      <TableHead>Compliance</TableHead>
                    )}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audits?.data.map((audit) => (
                    <TableRow key={audit.id} className="hover:bg-muted/30">
                      <TableCell>
                        {new Date(audit.requestedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getAuditTypeBadge(audit.type)}
                      </TableCell>
                      <TableCell>
                        {new Date(audit.startDate).toLocaleDateString()} - {new Date(audit.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(audit.status)}
                      </TableCell>
                      {audits.data.some(a => a.compliance) && (
                        <TableCell>
                          {audit.compliance ? getComplianceBadge(audit.compliance) : "-"}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setViewAuditId(audit.id)}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          {audit.status === "COMPLETED" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDownload(audit.id)}
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          )}
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

      {/* Audit Detail Dialog */}
      <Dialog open={!!viewAuditId} onOpenChange={(isOpen) => !isOpen && setViewAuditId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Compliance Audit Details</DialogTitle>
          </DialogHeader>
          {isLoadingDetails ? (
            <div className="flex justify-center p-6">Loading audit details...</div>
          ) : auditDetails?.data ? (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-2 pb-4 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Requested: {new Date(auditDetails.data.requestedAt).toLocaleDateString()}
                  </p>
                  {auditDetails.data.completedAt && (
                    <p className="text-sm text-muted-foreground">
                      Completed: {new Date(auditDetails.data.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {getStatusBadge(auditDetails.data.status)}
                  {getAuditTypeBadge(auditDetails.data.type)}
                  {auditDetails.data.compliance && getComplianceBadge(auditDetails.data.compliance)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Audit Period</h3>
                  <p>
                    {new Date(auditDetails.data.startDate).toLocaleDateString()} - {new Date(auditDetails.data.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                {auditDetails.data.auditor && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Auditor</h3>
                    <p>{auditDetails.data.auditor}</p>
                  </div>
                )}
              </div>
              
              {auditDetails.data.findings && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Findings</h3>
                  <p className="mt-1">{auditDetails.data.findings}</p>
                </div>
              )}
              
              {auditDetails.data.recommendations && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Recommendations</h3>
                  <p className="mt-1">{auditDetails.data.recommendations}</p>
                </div>
              )}
              
              {auditDetails.data.status === "IN_PROGRESS" && (
                <div className="pt-4 border-t">
                  <p className="font-medium">This audit is currently in progress.</p>
                  <p className="text-muted-foreground">Our compliance team is reviewing your account activities for the selected period. You will be notified when the audit is complete.</p>
                </div>
              )}
              
              {auditDetails.data.status === "REQUESTED" && (
                <div className="pt-4 border-t">
                  <p className="font-medium">This audit has been requested and is pending review.</p>
                  <p className="text-muted-foreground">Our compliance team will begin processing your audit request soon.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-destructive p-6">Failed to load audit details</div>
          )}
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setViewAuditId(null)}
            >
              Close
            </Button>
            {auditDetails?.data?.status === "COMPLETED" && (
              <Button
                onClick={() => handleDownload(auditDetails.data.id)}
              >
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComplianceAudits;
