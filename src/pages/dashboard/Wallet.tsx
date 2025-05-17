
import { useState } from "react";
import { 
  ChevronDown,
  CreditCard,
  Wallet,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  BanknoteIcon,
  PlusCircleIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Footer from "@/components/layout/Footer";
import BankAccountSelector from "@/components/wallet/BankAccountSelector";
import TransactionHistory from "@/components/wallet/TransactionHistory";
import FundingForm from "@/components/wallet/FundingForm";

const WalletPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Mock user balance data
  const walletBalance = {
    available: 34123.50,
    pending: 1240.75,
    total: 35364.25
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
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Wallet</h1>
                <p className="text-muted-foreground">Manage and fund your trading account</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => navigate('/trading')} variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" /> Start Trading
                </Button>
              </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    Available Balance
                    <DollarSign className="h-4 w-4 ml-1 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${walletBalance.available.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground mt-1">Available for trading</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    Pending Balance
                    <Wallet className="h-4 w-4 ml-1 text-accent" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${walletBalance.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground mt-1">Processing deposits</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    Total Portfolio Value
                    <CreditCard className="h-4 w-4 ml-1 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${walletBalance.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground mt-1">Including investments</p>
                </CardContent>
              </Card>
            </div>

            {/* Main content with tabs */}
            <Card className="glass-card mb-6">
              <Tabs defaultValue="deposit" className="w-full">
                <CardHeader className="pb-0">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="deposit" className="text-sm">Deposit</TabsTrigger>
                    <TabsTrigger value="withdraw" className="text-sm">Withdraw</TabsTrigger>
                    <TabsTrigger value="history" className="text-sm">Transaction History</TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent>
                  <TabsContent value="deposit" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Deposit Funds</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Add funds to your trading account using your linked bank accounts.
                        </p>
                      </div>
                      
                      <BankAccountSelector />
                      <FundingForm action="deposit" />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="withdraw" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Withdraw Funds</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Withdraw funds to your linked bank account. Processing may take 1-3 business days.
                        </p>
                      </div>
                      
                      <BankAccountSelector />
                      <FundingForm action="withdraw" />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-0">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Transaction History</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        View all your past deposits, withdrawals, and transfers.
                      </p>
                      
                      <TransactionHistory />
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
            
            {/* Add Bank Account CTA */}
            <Card className="glass-card bg-card/40 border border-primary/20 mb-6">
              <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <BanknoteIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-lg font-semibold">Link a New Bank Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your bank accounts for seamless transfers and withdrawals
                    </p>
                  </div>
                </div>
                <Button className="mt-4 md:mt-0" variant="outline">
                  <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Bank Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default WalletPage;
