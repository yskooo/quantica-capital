import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Wallet, Settings, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { userAPI } from "@/services/api/core";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load user profile data on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData) {
        toast.error("No user data found. Please login again.");
        return;
      }

      const user = JSON.parse(userData);
      console.log("Loading profile for user:", user);

      const response = await userAPI.getProfile(user.accId);
      
      if (response.error) {
        toast.error("Failed to load profile", {
          description: response.error
        });
        return;
      }

      setUserProfile(response.data);
      console.log("Profile loaded:", response.data);
      
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: any, section: string) => {
    setIsUpdating(true);
    
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await userAPI.updateProfile(user.accId, { [section]: data });
      
      if (response.error) {
        toast.error("Update failed", {
          description: response.error
        });
        return;
      }

      toast.success("Profile updated successfully!");
      loadUserProfile(); // Reload profile data
      
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

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
                    <form className="space-y-6" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = {
                        P_Name: formData.get('fullName'),
                        P_Address: formData.get('address'),
                        P_Postal_Code: formData.get('postalCode'),
                        P_Cell_Number: parseInt(formData.get('phone') as string),
                        Date_of_Birth: formData.get('dateOfBirth'),
                        Employment_Status: formData.get('employmentStatus'),
                        Purpose_of_Opening: formData.get('purposeOfOpening')
                      };
                      updateProfile(data, 'personalData');
                    }}>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          name="fullName"
                          defaultValue={userProfile?.personalData?.P_Name || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          defaultValue={userProfile?.personalData?.P_Email || ""} 
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone"
                          defaultValue={userProfile?.personalData?.P_Cell_Number || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          name="address"
                          defaultValue={userProfile?.personalData?.P_Address || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input 
                          id="postalCode" 
                          name="postalCode"
                          defaultValue={userProfile?.personalData?.P_Postal_Code || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input 
                          id="dateOfBirth" 
                          name="dateOfBirth"
                          type="date"
                          defaultValue={userProfile?.personalData?.Date_of_Birth || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employmentStatus">Employment Status</Label>
                        <select 
                          id="employmentStatus" 
                          name="employmentStatus"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue={userProfile?.personalData?.Employment_Status || ""}
                        >
                          <option value="Employed">Employed</option>
                          <option value="Self-Employed">Self-Employed</option>
                          <option value="Unemployed">Unemployed</option>
                          <option value="Student">Student</option>
                          <option value="Retired">Retired</option>
                        </select>
                      </div>
                      <div className="pt-4">
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bank" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Bank Account Details</CardTitle>
                    <CardDescription>Update your banking information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = {
                        Bank_Name: formData.get('bankName'),
                        Bank_Acc_Name: formData.get('accountName'),
                        Branch: formData.get('branch'),
                        Bank_Acc_Date_of_Opening: formData.get('accountOpeningDate')
                      };
                      updateProfile(data, 'bankDetails');
                    }}>
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input 
                          id="bankName" 
                          name="bankName"
                          defaultValue={userProfile?.bankDetails?.Bank_Name || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input 
                          id="accountName" 
                          name="accountName"
                          defaultValue={userProfile?.bankDetails?.Bank_Acc_Name || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input 
                          id="accountNumber" 
                          defaultValue={userProfile?.bankDetails?.Bank_Acc_No ? `****${userProfile.bankDetails.Bank_Acc_No.slice(-4)}` : ""} 
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Account number cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input 
                          id="branch" 
                          name="branch"
                          defaultValue={userProfile?.bankDetails?.Branch || ""} 
                        />
                      </div>
                      <div className="pt-4">
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Save Changes
                        </Button>
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
                    <form className="space-y-6" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = {
                        Nature_of_Work: formData.get('natureOfWork'),
                        'Business/School_Name': formData.get('businessName'),
                        'Office/School_Address': formData.get('officeAddress'),
                        'Office/School_Number': formData.get('officeNumber'),
                        Source_of_Income: formData.get('sourceOfIncome'),
                        Valid_ID: formData.get('validId')
                      };
                      updateProfile(data, 'sourceOfFunding');
                    }}>
                      <div className="space-y-2">
                        <Label htmlFor="natureOfWork">Nature of Work</Label>
                        <Input 
                          id="natureOfWork" 
                          name="natureOfWork"
                          defaultValue={userProfile?.sourceOfFunding?.Nature_of_Work || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business/Company Name</Label>
                        <Input 
                          id="businessName" 
                          name="businessName"
                          defaultValue={userProfile?.sourceOfFunding?.['Business/School_Name'] || ""} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sourceOfIncome">Primary Source of Income</Label>
                        <select 
                          id="sourceOfIncome" 
                          name="sourceOfIncome"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue={userProfile?.sourceOfFunding?.Source_of_Income || ""}
                        >
                          <option value="Salary">Salary</option>
                          <option value="Business">Business</option>
                          <option value="Remittance">Remittance</option>
                          <option value="Scholarship">Scholarship</option>
                          <option value="Pension">Pension</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="validId">Valid ID Type</Label>
                        <select 
                          id="validId" 
                          name="validId"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue={userProfile?.sourceOfFunding?.Valid_ID || ""}
                        >
                          <option value="Driver's License">Driver's License</option>
                          <option value="Passport">Passport</option>
                          <option value="SSS ID">SSS ID</option>
                          <option value="PhilHealth ID">PhilHealth ID</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div className="pt-4">
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Save Changes
                        </Button>
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
