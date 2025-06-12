import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Wallet, Settings, Loader2, Trash2, Users, Plus, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { userAPI } from "@/services/api/core";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Contact management states
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [contactForm, setContactForm] = useState({
    C_Name: '',
    C_Email: '',
    C_Contact_Number: '',
    C_Address: '',
    C_Postal_Code: '',
    role: 'Kin',
    relationship: 'Friend'
  });
  
  const navigate = useNavigate();

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

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    
    // Handle different date formats
    let date;
    
    // If it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      date = new Date(dateString + 'T00:00:00');
    } 
    // If it's an ISO string or other format
    else {
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return "";
    
    // Return in YYYY-MM-DD format for input fields
    return date.toISOString().split('T')[0];
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    
    // If user enters a number starting with 63, remove it
    if (value.startsWith('63')) {
      value = value.substring(2);
    }
    
    // Limit to 11 digits
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    // Handle different input formats
    if (value.length > 0) {
      if (value.startsWith('9')) {
        // If starts with 9, add 0 prefix
        value = '0' + value;
      } else if (!value.startsWith('09')) {
        // If doesn't start with 09, ensure it does
        value = '09' + value.slice(value.length > 2 ? 2 : 0);
      }
    }

    e.target.value = value;
  };

  const updateProfile = async (data: any, section: string) => {
    setIsUpdating(true);
    
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData) return;

      const user = JSON.parse(userData);
      
      // For phone number updates, send as string (11 digits)
      if (section === 'personalData' && data.P_Cell_Number) {
        data.P_Cell_Number = String(data.P_Cell_Number);
      }
      
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

  // Contact management functions
  const resetContactForm = () => {
    setContactForm({
      C_Name: '',
      C_Email: '',
      C_Contact_Number: '',
      C_Address: '',
      C_Postal_Code: '',
      role: 'Kin',
      relationship: 'Friend'
    });
    setEditingContact(null);
    setShowContactForm(false);
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData) return;

      const user = JSON.parse(userData);
      
      if (editingContact) {
        // Update existing contact
        const response = await fetch(`http://localhost:3001/api/users/profile/${user.accId}/contacts/${editingContact.Contact_ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({
            contactDetails: {
              C_Name: contactForm.C_Name,
              C_Email: contactForm.C_Email,
              C_Contact_Number: contactForm.C_Contact_Number,
              C_Address: contactForm.C_Address,
              C_Postal_Code: contactForm.C_Postal_Code
            },
            role: contactForm.role,
            relationship: contactForm.relationship
          })
        });

        if (response.ok) {
          toast.success("Contact updated successfully!");
          loadUserProfile();
          resetContactForm();
        } else {
          const errorData = await response.json();
          toast.error("Failed to update contact", { description: errorData.error });
        }
      } else {
        // Add new contact
        const response = await fetch(`http://localhost:3001/api/users/profile/${user.accId}/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({
            contactDetails: {
              C_Name: contactForm.C_Name,
              C_Email: contactForm.C_Email,
              C_Contact_Number: contactForm.C_Contact_Number,
              C_Address: contactForm.C_Address,
              C_Postal_Code: contactForm.C_Postal_Code
            },
            role: contactForm.role,
            relationship: contactForm.relationship
          })
        });

        if (response.ok) {
          toast.success("Contact added successfully!");
          loadUserProfile();
          resetContactForm();
        } else {
          const errorData = await response.json();
          toast.error("Failed to add contact", { description: errorData.error });
        }
      }
    } catch (error) {
      console.error("Contact operation error:", error);
      toast.error("Failed to save contact");
    }
  };

  const handleEditContact = (contact: any) => {
    setContactForm({
      C_Name: contact.C_Name || '',
      C_Email: contact.C_Email || '',
      C_Contact_Number: contact.C_Contact_Number || '',
      C_Address: contact.C_Address || '',
      C_Postal_Code: contact.C_Postal_Code || '',
      role: contact.C_Role || 'Kin',
      relationship: contact.C_Relationship || 'Friend'
    });
    setEditingContact(contact);
    setShowContactForm(true);
  };

  const handleDeleteContact = async (contact: any) => {
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData) return;

      const user = JSON.parse(userData);
      
      const response = await fetch(`http://localhost:3001/api/users/profile/${user.accId}/contacts/${contact.Contact_ID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        toast.success("Contact deleted successfully!");
        loadUserProfile();
      } else {
        const errorData = await response.json();
        toast.error("Failed to delete contact", { description: errorData.error });
      }
    } catch (error) {
      console.error("Delete contact error:", error);
      toast.error("Failed to delete contact");
    }
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await userAPI.deleteProfile(user.accId);
      
      if (response.error) {
        toast.error("Delete failed", {
          description: response.error
        });
        return;
      }

      toast.success("Account deleted successfully!");
      
      // Clear user data and redirect to home
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
      navigate('/');
      
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
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
                <TabsTrigger value="contacts">
                  <Users className="h-4 w-4 mr-2" />
                  Contacts
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
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
                        P_Cell_Number: formData.get('phone'), // Send as string
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
                        <Label htmlFor="phone">Phone Number (11 digits)</Label>
                        <Input 
                          id="phone" 
                          name="phone"
                          defaultValue={userProfile?.personalData?.P_Cell_Number || ""} 
                          onChange={handlePhoneChange}
                          maxLength={11}
                          pattern="[0-9]{11}"
                          placeholder="09123456789"
                        />
                        <p className="text-xs text-muted-foreground">Enter 11-digit phone number</p>
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
                          defaultValue={formatDateForDisplay(userProfile?.personalData?.Date_of_Birth)} 
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
                      <div className="space-y-2">
                        <Label htmlFor="accountOpeningDate">Account Opening Date</Label>
                        <Input 
                          id="accountOpeningDate" 
                          name="accountOpeningDate"
                          type="date"
                          defaultValue={formatDateForDisplay(userProfile?.bankDetails?.Bank_Acc_Date_of_Opening)} 
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

              <TabsContent value="contacts" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Emergency Contacts & References</CardTitle>
                        <CardDescription>
                          Manage your contacts (minimum 3 required)
                        </CardDescription>
                      </div>
                      <Button onClick={() => setShowContactForm(true)} disabled={showContactForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showContactForm && (
                      <Card className="mb-6 border-2 border-primary/20">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {editingContact ? 'Edit Contact' : 'Add New Contact'}
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={resetContactForm}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleContactFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="contactRole">Role</Label>
                                <Select value={contactForm.role} onValueChange={(value) => setContactForm(prev => ({ ...prev, role: value }))}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Kin">Kin (Emergency Contact)</SelectItem>
                                    <SelectItem value="Referee 1">Referee 1</SelectItem>
                                    <SelectItem value="Referee 2">Referee 2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="contactRelationship">Relationship</Label>
                                <Select value={contactForm.relationship} onValueChange={(value) => setContactForm(prev => ({ ...prev, relationship: value }))}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Father">Father</SelectItem>
                                    <SelectItem value="Mother">Mother</SelectItem>
                                    <SelectItem value="Spouse">Spouse</SelectItem>
                                    <SelectItem value="Son">Son</SelectItem>
                                    <SelectItem value="Daughter">Daughter</SelectItem>
                                    <SelectItem value="Friend">Friend</SelectItem>
                                    <SelectItem value="Colleague">Colleague</SelectItem>
                                    <SelectItem value="Mentor">Mentor</SelectItem>
                                    <SelectItem value="Others">Others</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="contactName">Full Name</Label>
                              <Input 
                                id="contactName"
                                value={contactForm.C_Name}
                                onChange={(e) => setContactForm(prev => ({ ...prev, C_Name: e.target.value }))}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="contactEmail">Email</Label>
                              <Input 
                                id="contactEmail"
                                type="email"
                                value={contactForm.C_Email}
                                onChange={(e) => setContactForm(prev => ({ ...prev, C_Email: e.target.value }))}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="contactPhone">Phone Number</Label>
                              <Input 
                                id="contactPhone"
                                value={contactForm.C_Contact_Number}
                                onChange={(e) => setContactForm(prev => ({ ...prev, C_Contact_Number: e.target.value }))}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="contactAddress">Address</Label>
                              <Input 
                                id="contactAddress"
                                value={contactForm.C_Address}
                                onChange={(e) => setContactForm(prev => ({ ...prev, C_Address: e.target.value }))}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="contactPostalCode">Postal Code</Label>
                              <Input 
                                id="contactPostalCode"
                                value={contactForm.C_Postal_Code}
                                onChange={(e) => setContactForm(prev => ({ ...prev, C_Postal_Code: e.target.value }))}
                                required
                              />
                            </div>
                            
                            <div className="flex gap-2 pt-4">
                              <Button type="button" variant="outline" onClick={resetContactForm}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                <Save className="h-4 w-4 mr-2" />
                                {editingContact ? 'Update Contact' : 'Save Contact'}
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    )}

                    {userProfile?.contacts && userProfile.contacts.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Total contacts: {userProfile.contacts.length} (minimum 3 required)
                        </p>
                        {userProfile.contacts.map((contact: any, index: number) => (
                          <Card key={index} className="bg-muted/50">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{contact.C_Name}</CardTitle>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="font-medium">
                                    {contact.C_Role}
                                  </Badge>
                                  {contact.C_Relationship && (
                                    <Badge variant="secondary">
                                      {contact.C_Relationship}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                  <Label className="text-muted-foreground">Email</Label>
                                  <p>{contact.C_Email}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Phone</Label>
                                  <p>{contact.C_Contact_Number}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <Label className="text-muted-foreground">Address</Label>
                                  <p>{contact.C_Address}</p>
                                  {contact.C_Postal_Code && (
                                    <p className="text-muted-foreground">Postal Code: {contact.C_Postal_Code}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditContact(contact)}
                                  disabled={showContactForm}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      disabled={userProfile.contacts.length <= 3}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete Contact</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete {contact.C_Name}? This action cannot be undone.
                                        {userProfile.contacts.length <= 3 && 
                                          " You cannot delete this contact as you need a minimum of 3 contacts."
                                        }
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline">Cancel</Button>
                                      <Button 
                                        variant="destructive" 
                                        onClick={() => handleDeleteContact(contact)}
                                        disabled={userProfile.contacts.length <= 3}
                                      >
                                        Delete Contact
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-sm font-medium text-muted-foreground">No contacts found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Add your first contact to get started.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card className="glass-card border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Permanently delete your account and all associated data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Once you delete your account, there is no going back. This action cannot be undone.
                        All your data including profile information, bank details, and transaction history will be permanently removed.
                      </p>
                      
                      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="w-full sm:w-auto">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete My Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete your account
                              and remove all your data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={deleteAccount}
                              disabled={isDeleting}
                            >
                              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Delete Account
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
