
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { complianceService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PlusCircle, AlertTriangle, MessageSquare, RefreshCw, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const disputeSchema = z.object({
  type: z.enum(["TRADE_ERROR", "FEE_DISPUTE", "UNAUTHORIZED_TRANSACTION", "SYSTEM_ERROR", "OTHER"], {
    required_error: "Please select a dispute type.",
  }),
  relatedId: z.string().optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  requestedResolution: z.string().min(10, {
    message: "Requested resolution must be at least 10 characters.",
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    required_error: "Please select a priority level.",
  }),
});

const DisputeResolution = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDisputeId, setViewDisputeId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof disputeSchema>>({
    resolver: zodResolver(disputeSchema),
    defaultValues: {
      type: "TRADE_ERROR",
      priority: "MEDIUM",
      description: "",
      requestedResolution: "",
    },
  });
  
  // Fetch disputes
  const { data: disputes, isLoading, refetch } = useQuery({
    queryKey: ["disputes"],
    queryFn: () => complianceService.getAllDisputes(),
    // Mock data for preview
    initialData: {
      data: [
        {
          id: "disp-001",
          type: "TRADE_ERROR",
          description: "Order executed at wrong price. Market order for AAPL was filled at $195.50 but should have been around $192.50.",
          requestedResolution: "Adjust the trade to reflect the correct market price at the time of execution.",
          relatedId: "TR-9876",
          status: "UNDER_REVIEW",
          submittedAt: "2025-05-16T09:23:15.000Z",
          updatedAt: "2025-05-17T14:10:22.000Z",
          assignedTo: "Compliance Team",
          expectedResolutionDate: "2025-05-20T00:00:00.000Z",
          priority: "HIGH",
          comments: [
            {
              id: "com-001",
              disputeId: "disp-001",
              authorId: "user123",
              authorType: "CLIENT",
              content: "Please check the market data for this time period.",
              timestamp: "2025-05-16T09:23:15.000Z",
            },
            {
              id: "com-002",
              disputeId: "disp-001",
              authorId: "support456",
              authorType: "SUPPORT",
              content: "We're looking into this issue and checking the execution data.",
              timestamp: "2025-05-17T14:10:22.000Z",
            }
          ]
        },
        {
          id: "disp-002",
          type: "FEE_DISPUTE",
          description: "Charged a fee of $15.50 for transfer that should have been free according to my account tier.",
          requestedResolution: "Refund the fee and ensure correct fee structure is applied to my account.",
          status: "SUBMITTED",
          submittedAt: "2025-05-15T16:42:30.000Z",
          updatedAt: "2025-05-15T16:42:30.000Z",
          priority: "MEDIUM",
          comments: []
        }
      ],
      error: null,
    },
  });

  // Fetch dispute details
  const { data: disputeDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["dispute", viewDisputeId],
    queryFn: () => viewDisputeId ? complianceService.getDisputeById(viewDisputeId) : null,
    enabled: !!viewDisputeId,
    // Mock data for preview
    initialData: viewDisputeId ? { 
      data: disputes?.data.find(d => d.id === viewDisputeId) || null,
      error: null 
    } : null
  });

  // Submit new dispute
  const onSubmit = async (values: z.infer<typeof disputeSchema>) => {
    try {
      const result = await complianceService.submitDispute(values);
      if (result.data) {
        toast.success("Dispute submitted successfully");
        setIsDialogOpen(false);
        form.reset();
        refetch();
      } else {
        toast.error("Failed to submit dispute");
      }
    } catch (error) {
      toast.error("Error submitting dispute");
      console.error("Submit dispute error:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Submitted</Badge>;
      case "UNDER_REVIEW":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Under Review</Badge>;
      case "RESOLVED":
        return <Badge variant="outline" className="bg-market-bull/10 text-market-bull border-market-bull/20">Resolved</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-market-bear/10 text-market-bear border-market-bear/20">Rejected</Badge>;
      case "MORE_INFO_NEEDED":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">More Info Needed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "LOW":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Low</Badge>;
      case "MEDIUM":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium</Badge>;
      case "HIGH":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">High</Badge>;
      case "CRITICAL":
        return <Badge variant="outline" className="bg-market-bear/10 text-market-bear border-market-bear/20">Critical</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getDisputeTypeBadge = (type: string) => {
    switch (type) {
      case "TRADE_ERROR":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Trade Error</Badge>;
      case "FEE_DISPUTE":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Fee Dispute</Badge>;
      case "UNAUTHORIZED_TRANSACTION":
        return <Badge variant="outline" className="bg-market-bear/10 text-market-bear border-market-bear/20">Unauthorized</Badge>;
      case "SYSTEM_ERROR":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">System Error</Badge>;
      case "OTHER":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Other</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-semibold">Dispute Resolution</CardTitle>
            <CardDescription>Submit and track dispute requests</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" /> New Dispute
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Submit a Dispute</DialogTitle>
                  <DialogDescription>
                    Provide details about your dispute. Our compliance team will review your submission.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dispute Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a dispute type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TRADE_ERROR">Trade Error</SelectItem>
                              <SelectItem value="FEE_DISPUTE">Fee Dispute</SelectItem>
                              <SelectItem value="UNAUTHORIZED_TRANSACTION">Unauthorized Transaction</SelectItem>
                              <SelectItem value="SYSTEM_ERROR">System Error</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="relatedId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Related ID (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Trade ID, Transaction ID, etc." {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide reference ID if applicable (e.g., trade or transaction ID)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                              <SelectItem value="CRITICAL">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your dispute in detail..." 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requestedResolution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requested Resolution</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What resolution are you seeking?" 
                              className="min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Submit Dispute</Button>
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
            <div className="flex justify-center p-6">Loading disputes...</div>
          ) : disputes?.data?.length === 0 ? (
            <div className="text-center p-6 border rounded-md bg-background/50">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium mb-1">No disputes found</h3>
              <p className="text-muted-foreground mb-4">You haven't submitted any disputes yet.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" /> Submit Dispute
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes?.data.map((dispute) => (
                    <TableRow key={dispute.id} className="hover:bg-muted/30">
                      <TableCell>
                        {new Date(dispute.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getDisputeTypeBadge(dispute.type)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {dispute.description}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(dispute.status)}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(dispute.priority)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setViewDisputeId(dispute.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dispute Detail Dialog */}
      <Dialog open={!!viewDisputeId} onOpenChange={(isOpen) => !isOpen && setViewDisputeId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Dispute Details</DialogTitle>
          </DialogHeader>
          {isLoadingDetails ? (
            <div className="flex justify-center p-6">Loading dispute details...</div>
          ) : disputeDetails?.data ? (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-2 pb-4 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Submitted: {new Date(disputeDetails.data.submittedAt).toLocaleDateString()}
                    {" "}
                    {new Date(disputeDetails.data.submittedAt).toLocaleTimeString()}
                  </p>
                  {disputeDetails.data.expectedResolutionDate && (
                    <p className="text-sm text-muted-foreground">
                      Expected Resolution: {new Date(disputeDetails.data.expectedResolutionDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {getStatusBadge(disputeDetails.data.status)}
                  {getPriorityBadge(disputeDetails.data.priority)}
                  {getDisputeTypeBadge(disputeDetails.data.type)}
                </div>
              </div>
              
              {disputeDetails.data.relatedId && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Related ID</h3>
                  <p>{disputeDetails.data.relatedId}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{disputeDetails.data.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Requested Resolution</h3>
                <p className="mt-1">{disputeDetails.data.requestedResolution}</p>
              </div>
              
              {disputeDetails.data.assignedTo && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
                  <p>{disputeDetails.data.assignedTo}</p>
                </div>
              )}
              
              {disputeDetails.data.resolutionDetails && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Resolution Details</h3>
                  <p>{disputeDetails.data.resolutionDetails}</p>
                </div>
              )}
              
              {/* Comments section */}
              {disputeDetails.data.comments && disputeDetails.data.comments.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-4">Communication History</h3>
                  <div className="space-y-4">
                    {disputeDetails.data.comments.map((comment) => (
                      <div 
                        key={comment.id} 
                        className={`p-3 rounded-lg ${
                          comment.authorType === "CLIENT" 
                            ? "bg-primary/10 ml-8" 
                            : "bg-muted mr-8"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">
                            {comment.authorType === "CLIENT" ? "You" : comment.authorType}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleDateString()}{" "}
                            {new Date(comment.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Reply section if dispute is still active */}
              {disputeDetails.data.status !== "RESOLVED" && disputeDetails.data.status !== "REJECTED" && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Add Response</h3>
                  <Textarea placeholder="Type your message here..." className="min-h-[100px] mb-3" />
                  <div className="flex justify-end">
                    <Button>Send Response</Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-destructive p-6">Failed to load dispute details</div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className={disputeDetails?.data?.status === "SUBMITTED" ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "hidden"}
              onClick={() => {
                toast.success("Dispute cancelled successfully");
                setViewDisputeId(null);
                refetch();
              }}
            >
              <X className="h-4 w-4 mr-2" /> Cancel Dispute
            </Button>
            <Button 
              variant="outline"
              onClick={() => setViewDisputeId(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisputeResolution;
