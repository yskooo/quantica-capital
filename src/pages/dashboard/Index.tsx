
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DataCard 
                title="Portfolio Value" 
                value="$124,532.80" 
                trend="up" 
                trendValue="+2.5% today" 
                icon={<Briefcase className="h-4 w-4" />} 
                className="border-l-2 border-l-primary"
              />
              <DataCard 
                title="Available Cash" 
                value="$34,123.50" 
                icon={<Wallet className="h-4 w-4" />}
                className="border-l-2 border-l-accent"
              />
              <DataCard 
                title="Today's Return" 
                value="+$1,243.38" 
                trend="up" 
                trendValue="+1.2%" 
                icon={<TrendingUp className="h-4 w-4" />}
                className="border-l-2 border-l-market-bull"
              />
              <DataCard 
                title="Total P/L" 
                value="+$24,532.80" 
                trend="up" 
                trendValue="+24.5% all time" 
                icon={<ChartLine className="h-4 w-4" />}
                className="border-l-2 border-l-primary"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Portfolio Holdings */}
              <Card className="border-border/40 bg-card/50 lg:col-span-2">
                <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-border/40">
                  <CardTitle className="text-lg font-medium">Portfolio Summary</CardTitle>
                  <Link to="/portfolio">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent className="pt-6">
                  <PortfolioSummary />
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-border/40 bg-card/50">
                <CardHeader className="pb-2 border-b border-border/40">
                  <CardTitle className="text-lg font-medium">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <RecentActivities />
                </CardContent>
              </Card>
            </div>

            {/* Market Overview with Trading Link */}
            <Card className="border-border/40 bg-card/50 mb-6">
              <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-border/40">
                <CardTitle className="text-lg font-medium">Market Overview</CardTitle>
                <Link to="/trading">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary hover:text-primary/80">
                    <ChartLine className="h-4 w-4" /> Trading
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-6">
                <MarketOverview />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default Dashboard;
