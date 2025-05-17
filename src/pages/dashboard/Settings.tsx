
import { useState } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  Sliders, 
  Globe, 
  Key,
  Eye, 
  EyeOff, 
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className={`flex-1 p-4 md:p-6 transition-all ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and settings</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? "Saving..." : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="account" className="mb-6">
              <TabsList className="grid grid-cols-4 md:w-[500px]">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              {/* Account Settings Tab */}
              <TabsContent value="account" className="space-y-6 mt-4">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" /> Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" defaultValue="John Doe" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input id="dateOfBirth" type="date" defaultValue="1990-01-01" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue="123 Trading Street" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" defaultValue="New York" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" defaultValue="NY" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input id="zipCode" defaultValue="10001" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select defaultValue="us">
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6 mt-4">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" /> Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="currentPassword" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="absolute right-0 top-0 h-full"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="2fa">Two-Factor Authentication</Label>
                          <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Switch id="2fa" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sessionTimeout">Session Timeout</Label>
                          <p className="text-xs text-muted-foreground">Automatically log out after inactivity</p>
                        </div>
                        <Select defaultValue="30">
                          <SelectTrigger id="sessionTimeout" className="w-[110px]">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="biometric">Biometric Login</Label>
                          <p className="text-xs text-muted-foreground">Use fingerprint or face recognition when available</p>
                        </div>
                        <Switch id="biometric" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6 mt-4">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <Sliders className="h-5 w-5 text-primary" /> App Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="theme">Theme</Label>
                          <p className="text-xs text-muted-foreground">Choose your preferred app appearance</p>
                        </div>
                        <Select defaultValue="dark">
                          <SelectTrigger id="theme" className="w-[120px]">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dark">Dark (Default)</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="language">Language</Label>
                          <p className="text-xs text-muted-foreground">Set your preferred language</p>
                        </div>
                        <Select defaultValue="en">
                          <SelectTrigger id="language" className="w-[120px]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="currency">Default Currency</Label>
                          <p className="text-xs text-muted-foreground">Set your preferred currency</p>
                        </div>
                        <Select defaultValue="usd">
                          <SelectTrigger id="currency" className="w-[120px]">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="jpy">JPY (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="timezone">Timezone</Label>
                          <p className="text-xs text-muted-foreground">Set your local timezone</p>
                        </div>
                        <Select defaultValue="ny">
                          <SelectTrigger id="timezone" className="w-[180px]">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ny">New York (GMT-5)</SelectItem>
                            <SelectItem value="london">London (GMT+0)</SelectItem>
                            <SelectItem value="tokyo">Tokyo (GMT+9)</SelectItem>
                            <SelectItem value="sydney">Sydney (GMT+11)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6 mt-4">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" /> Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-xs text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Switch id="emailNotifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-xs text-muted-foreground">Receive updates via push notifications</p>
                        </div>
                        <Switch id="pushNotifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-xs text-muted-foreground">Receive updates via SMS</p>
                        </div>
                        <Switch id="smsNotifications" />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Notification Preferences</h3>
                        
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm">Price Alerts</span>
                          <Switch id="priceAlerts" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm">Trade Confirmations</span>
                          <Switch id="tradeConfirmations" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm">Account Updates</span>
                          <Switch id="accountUpdates" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm">Market News</span>
                          <Switch id="marketNews" />
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm">Promotional Content</span>
                          <Switch id="promotions" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* API Keys Section */}
            <Card className="glass-card mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" /> API Keys & Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Manage your API keys for third-party integrations and external access to your account data.
                  </p>
                  
                  <div className="bg-secondary/20 p-4 rounded-lg border border-border/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Read-only API Key</h3>
                        <p className="text-xs text-muted-foreground">For external tools to view your portfolio data</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input className="w-36 md:w-auto font-mono text-xs" value="xxxxxxxxxxxxxxxxxxxxxxxx" readOnly />
                        <Button variant="outline" size="sm">Show</Button>
                        <Button variant="outline" size="sm">Regenerate</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/20 p-4 rounded-lg border border-border/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Trading API Key</h3>
                        <p className="text-xs text-muted-foreground text-amber-400">Has permission to execute trades</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input className="w-36 md:w-auto font-mono text-xs" value="xxxxxxxxxxxxxxxxxxxxxxxx" readOnly />
                        <Button variant="outline" size="sm">Show</Button>
                        <Button variant="outline" size="sm">Regenerate</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Webhook URL</h3>
                      <p className="text-xs text-muted-foreground">Receive real-time updates via webhook</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="https://example.com/webhook" 
                        className="w-44 md:w-auto text-xs" 
                      />
                      <Button size="sm" variant="outline">Save</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Danger Zone */}
            <Card className="border-destructive/20 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-lg">
                    <div>
                      <h3 className="font-medium">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-lg">
                    <div>
                      <h3 className="font-medium">Export Data</h3>
                      <p className="text-sm text-muted-foreground">Download all your personal data</p>
                    </div>
                    <Button variant="outline" size="sm">Export All Data</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
