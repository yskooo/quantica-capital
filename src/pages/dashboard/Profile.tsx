
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Wallet, Settings } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className={`flex-1 p-4 md:p-6 transition-all ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="mb-6">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your account details and preferences</p>
            </div>

            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList>
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="bank">
                  <Wallet className="h-4 w-4 mr-2" />
                  Bank & Funding
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+1 (555) 000-0000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Main St" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" defaultValue="New York" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input id="postalCode" defaultValue="10001" />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button>Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Employment Information</CardTitle>
                    <CardDescription>Update your employment details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="employmentStatus">Employment Status</Label>
                        <select 
                          id="employmentStatus" 
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue="employed"
                        >
                          <option value="employed">Employed</option>
                          <option value="self-employed">Self-employed</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="student">Student</option>
                          <option value="retired">Retired</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="natureOfWork">Nature of Work</Label>
                        <Input id="natureOfWork" defaultValue="Software Development" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business/Company Name</Label>
                        <Input id="businessName" defaultValue="Tech Innovations Inc." />
                      </div>
                      <div className="pt-4">
                        <Button>Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bank" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Bank Account Details</CardTitle>
                    <CardDescription>Update your banking information for deposits and withdrawals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" defaultValue="CitiBank" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input id="accountName" defaultValue="John M. Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input id="accountNumber" defaultValue="****6789" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input id="branch" defaultValue="Manhattan" />
                      </div>
                      <div className="pt-4">
                        <Button>Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Source of Funding</CardTitle>
                    <CardDescription>Update your source of income information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="sourceOfIncome">Primary Source of Income</Label>
                        <select 
                          id="sourceOfIncome" 
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue="salary"
                        >
                          <option value="salary">Salary</option>
                          <option value="business">Business</option>
                          <option value="remittance">Remittance</option>
                          <option value="scholarship">Scholarship</option>
                          <option value="allowance">Allowance</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="validId">Valid ID Type</Label>
                        <select 
                          id="validId" 
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue="passport"
                        >
                          <option value="driver">Driver's License</option>
                          <option value="passport">Passport</option>
                          <option value="sss">SSS ID</option>
                          <option value="philhealth">PhilHealth</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="pt-4">
                        <Button>Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>Customize how Quantica Capital looks and feels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Night Mode</h3>
                          <p className="text-sm text-muted-foreground">Use dark theme</p>
                        </div>
                        <div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" checked readOnly />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <h3 className="font-medium">Notifications</h3>
                          <p className="text-sm text-muted-foreground">Receive price alerts and updates</p>
                        </div>
                        <div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" checked readOnly />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button>Save Preferences</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
