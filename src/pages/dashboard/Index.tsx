
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChartLine, 
  Wallet, 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Grid2X2, 
  LayoutDashboard, 
  Settings, 
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataCard from "@/components/ui/data-card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import MarketOverview from "@/components/dashboard/MarketOverview";
import RecentActivities from "@/components/dashboard/RecentActivities";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className={`flex-1 p-4 md:p-6 transition-all ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Trader</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Grid2X2 className="h-4 w-4 mr-2" /> Customize
                </Button>
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <DataCard 
                title="Portfolio Value" 
                value="$124,532.80" 
                trend="up" 
                trendValue="+2.5% today" 
                icon={<Briefcase className="h-4 w-4" />} 
              />
              <DataCard 
                title="Available Cash" 
                value="$34,123.50" 
                icon={<Wallet className="h-4 w-4" />}
              />
              <DataCard 
                title="Today's Return" 
                value="+$1,243.38" 
                trend="up" 
                trendValue="+1.2%" 
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <DataCard 
                title="Total P/L" 
                value="+$24,532.80" 
                trend="up" 
                trendValue="+24.5% all time" 
                icon={<ChartLine className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Portfolio Holdings */}
              <Card className="glass-card lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <PortfolioSummary />
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentActivities />
                </CardContent>
              </Card>
            </div>

            {/* Market Overview */}
            <div className="mt-6">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">Market Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarketOverview />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
