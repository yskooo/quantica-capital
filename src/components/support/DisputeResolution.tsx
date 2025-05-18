
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  XCircle,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { complianceService } from "@/services/api";
import { toast } from "sonner";
import { DisputeRequest, DisputeResponse } from "@/services/api/types";

const DisputeResolution = () => {
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch disputes
  const { data: disputesData, isLoading, refetch } = useQuery({
    queryKey: ['compliance-disputes'],
    queryFn: () => complianceService.getAllDisputes()
  });

  // Filter disputes based on search term and active tab
  const filteredDisputes = disputesData?.data?.filter(dispute => {
    const matchesSearch = 
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dispute.description && dispute.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "open" && 
        (dispute.status === "SUBMITTED" || 
         dispute.status === "UNDER_REVIEW" ||
         dispute.status === "MORE_INFO_NEEDED")) ||
      (activeTab === "resolved" && 
        (dispute.status === "RESOLVED" || 
         dispute.status === "REJECTED"));

    return matchesSearch && matchesTab;
  }) || [];

  // Dispute form schema
  const disputeFormSchema = z.object({
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

  // Form hook
  const form = useForm<z.infer<typeof disputeFormSchema>>({
    resolver: zodResolver(disputeFormSchema),
    defaultValues: {
      description: "",
      requestedResolution: "",
      relatedId: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof disputeFormSchema>) => {
    try {
      // Create dispute request with all required fields
      const disputeRequest: DisputeRequest = {
        type: values.type,
        description: values.description,
        requestedResolution: values.requestedResolution,
        priority: values.priority,
        relatedId: values.relatedId || "",
      };

      const result = await complianceService.submitDispute(disputeRequest);
      
      if (result.data) {
        toast.success("Dispute submitted successfully.");
        setIsDisputeDialogOpen(false);
        refetch();
        form.reset();
      } else {
        toast.error("Failed to submit dispute: " + result.error);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the dispute.");
      console.error(error);
    }
  };

  // Format dispute status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Submitted</Badge>;
      case "UNDER_REVIEW":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Under Review</Badge>;
      case "RESOLVED":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Resolved</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
      case "MORE_INFO_NEEDED":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">More Info Needed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format priority level
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "LOW":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Low</Badge>;
      case "MEDIUM":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium</Badge>;
      case "HIGH":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">High</Badge>;
      case "CRITICAL":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Critical</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Format dispute type
  const getTypeDisplay = (type: string) => {
    switch (type) {
      case "TRADE_ERROR":
        return "Trade Error";
      case "FEE_DISPUTE":
        return "Fee Dispute";
      case "UNAUTHORIZED_TRANSACTION":
        return "Unauthorized Transaction";
      case "SYSTEM_ERROR":
        return "System Error";
      case "OTHER":
        return "Other";
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle>Dispute Resolution</CardTitle>
          <Dialog open={isDisputeDialogOpen} onOpenChange={setIsDisputeDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">File a Dispute</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>File a Dispute</DialogTitle>
                <DialogDescription>
                  Submit a dispute for transaction issues, fees, or other concerns.
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dispute type" />
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
                        <FormDescription>
                          Select the category that best describes your dispute.
                        </FormDescription>
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
                          <Input 
                            placeholder="Transaction ID, Order ID, etc." 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Enter any relevant ID related to this dispute.
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="CRITICAL">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the urgency of your dispute.
                        </FormDescription>
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
                            placeholder="Describe the issue in detail..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide all relevant details about the issue.
                        </FormDescription>
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
                            placeholder="Describe how you would like this issue to be resolved..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What outcome are you seeking?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" className="w-full">Submit Dispute</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search disputes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading disputes...</div>
          ) : filteredDisputes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              <p>No disputes found</p>
              <p className="text-sm">File a new dispute to start the resolution process</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDisputes.map((dispute) => (
                <Card key={dispute.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row border-b">
                    <div className="p-4 flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div className="flex items-center gap-2 mb-2 md:mb-0">
                          <h3 className="font-medium">Dispute #{dispute.id.substring(0, 8)}</h3>
                          {getStatusBadge(dispute.status)}
                          {getPriorityBadge(dispute.priority)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Submitted on {new Date(dispute.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium">Type</p>
                          <p className="text-sm text-muted-foreground">{getTypeDisplay(dispute.type)}</p>
                        </div>
                        
                        {dispute.relatedId && (
                          <div>
                            <p className="text-sm font-medium">Related ID</p>
                            <p className="text-sm text-muted-foreground">{dispute.relatedId}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm font-medium">Last Updated</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(dispute.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium">Description</p>
                        <p className="text-sm mt-1">{dispute.description}</p>
                      </div>
                      
                      {dispute.resolutionDetails && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium">Resolution</p>
                          <p className="text-sm mt-1">{dispute.resolutionDetails}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {dispute.comments?.length ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {dispute.comments.length} comments
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No comments</div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {dispute.status === "MORE_INFO_NEEDED" && (
                        <Button size="sm" variant="outline">Provide Information</Button>
                      )}
                      
                      {(dispute.status === "SUBMITTED" || dispute.status === "UNDER_REVIEW") && (
                        <Button size="sm" variant="outline">
                          Cancel Dispute
                        </Button>
                      )}
                      
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DisputeResolution;
