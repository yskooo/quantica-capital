
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  CalendarIcon,
  Download,
  FileText,
  Search,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { complianceService } from "@/services/api";
import { AuditReport, AuditRequest } from "@/services/api/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parse } from "date-fns";
import { toast } from "sonner";

const ComplianceAudits = () => {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch audit reports
  const { data: auditReports, isLoading, refetch } = useQuery({
    queryKey: ['compliance-audits'],
    queryFn: () => complianceService.getAllAudits()
  });
  
  // Filter audits based on search term
  const filteredAudits = auditReports?.data?.filter(audit => 
    audit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.compliance.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Request Audit form schema
  const requestFormSchema = z.object({
    type: z.enum(["ACCOUNT_ACTIVITY", "TRADING_PATTERN", "TAX_COMPLIANCE", "KYC_VERIFICATION"], {
      required_error: "Please select an audit type.",
    }),
    startDate: z.date({
      required_error: "A start date is required.",
    }),
    endDate: z.date({
      required_error: "An end date is required.",
    }).refine(date => date > new Date(), {
      message: "End date cannot be in the past.",
    }),
    description: z.string().optional(),
  }).refine(data => data.endDate > data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
  });

  // Form hook
  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      type: undefined,
      description: "",
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof requestFormSchema>) => {
    try {
      // Create audit request object with all required fields
      const auditRequest: AuditRequest = {
        type: values.type,
        startDate: format(values.startDate, "yyyy-MM-dd"),
        endDate: format(values.endDate, "yyyy-MM-dd"),
        description: values.description || ""
      };
      
      const result = await complianceService.requestAudit(auditRequest);
      
      if (result.data) {
        toast.success("Audit request submitted successfully.");
        setIsRequestDialogOpen(false);
        refetch();
        form.reset();
      } else {
        toast.error("Failed to submit audit request: " + result.error);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the audit request.");
      console.error(error);
    }
  };

  // Format audit status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Requested</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format compliance status
  const getComplianceBadge = (compliance: string) => {
    switch (compliance) {
      case "COMPLIANT":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Compliant</Badge>;
      case "NON_COMPLIANT":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Non-Compliant</Badge>;
      case "PARTIALLY_COMPLIANT":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Partially Compliant</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Pending</Badge>;
      default:
        return <Badge variant="outline">{compliance}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle>Compliance Audits</CardTitle>
          <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Request Audit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Request Compliance Audit</DialogTitle>
                <DialogDescription>
                  Request an audit of your account activity or trading patterns.
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select audit type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ACCOUNT_ACTIVITY">Account Activity</SelectItem>
                            <SelectItem value="TRADING_PATTERN">Trading Pattern</SelectItem>
                            <SelectItem value="TAX_COMPLIANCE">Tax Compliance</SelectItem>
                            <SelectItem value="KYC_VERIFICATION">KYC Verification</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the type of audit you want to request.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          The start date for the audit period.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          The end date for the audit period.
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
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide any additional information that would be helpful for the audit..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional details about your audit request.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" className="w-full">Submit Request</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audits..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading audit reports...</div>
          ) : filteredAudits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              <p>No audit reports found</p>
              <p className="text-sm">Request a new audit to start the compliance process</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredAudits.map((audit) => (
                <AccordionItem value={audit.id} key={audit.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-1 items-center justify-between pr-4">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            Audit #{audit.id.substring(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Requested on {new Date(audit.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(audit.status)}
                        {getComplianceBadge(audit.compliance)}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 px-4 pt-2 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Request Details</h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs flex justify-between">
                              <span className="text-muted-foreground">Request ID:</span>
                              <span>{audit.requestId}</span>
                            </p>
                            <p className="text-xs flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <span>{audit.status}</span>
                            </p>
                            <p className="text-xs flex justify-between">
                              <span className="text-muted-foreground">Auditor:</span>
                              <span>{audit.auditor || "Not assigned"}</span>
                            </p>
                            <p className="text-xs flex justify-between">
                              <span className="text-muted-foreground">Requested:</span>
                              <span>{new Date(audit.requestedAt).toLocaleDateString()}</span>
                            </p>
                            <p className="text-xs flex justify-between">
                              <span className="text-muted-foreground">Completed:</span>
                              <span>{audit.completedAt ? new Date(audit.completedAt).toLocaleDateString() : "Pending"}</span>
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Findings Summary</h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs flex justify-between">
                              <span className="text-muted-foreground">Compliance:</span>
                              <span>{audit.compliance}</span>
                            </p>
                            {audit.findings ? (
                              <p className="text-xs mt-2">{audit.findings}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground">No findings available yet</p>
                            )}
                            
                            {audit.recommendations && (
                              <div className="mt-4">
                                <h5 className="text-xs font-medium">Recommendations</h5>
                                <p className="text-xs mt-1">{audit.recommendations}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        {audit.downloadUrl && (
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download Report
                          </Button>
                        )}
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceAudits;
