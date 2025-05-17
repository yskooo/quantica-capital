
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartLine, ArrowDown, ArrowUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";

// Mock data for the portfolio page
const positions = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 25, avgPrice: 182.63, currentPrice: 192.53, value: 4813.25, returnPct: 5.42, returnAmt: 247.5 },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 15, avgPrice: 324.98, currentPrice: 337.21, value: 5058.15, returnPct: 3.76, returnAmt: 183.45 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 10, avgPrice: 140.23, currentPrice: 137.45, value: 1374.5, returnPct: -1.98, returnAmt: -27.8 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 12, avgPrice: 132.74, currentPrice: 134.68, value: 1616.16, returnPct: 1.46, returnAmt: 23.28 },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 8, avgPrice: 247.35, currentPrice: 242.21, value: 1937.68, returnPct: -2.08, returnAmt: -41.12 }
];

const Portfolio = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const totalValue = positions.reduce((sum, position) => sum + position.value, 0);
  const totalReturn = positions.reduce((sum, position) => sum + position.returnAmt, 0);
  const totalReturnPct = (totalReturn / (totalValue - totalReturn)) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className={`flex-1 p-4 md:p-6 transition-all ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Portfolio</h1>
                <p className="text-muted-foreground">Manage and track your investments</p>
              </div>
              <div className="flex items-center gap-2">
                <Button>
                  <ArrowDown className="h-4 w-4 mr-2" /> Deposit
                </Button>
                <Button variant="outline">
                  <ArrowUp className="h-4 w-4 mr-2" /> Withdraw
                </Button>
              </div>
            </div>

            {/* Portfolio Summary */}
            <Card className="glass-card mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">Portfolio Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
                    <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Return</h3>
                    <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                      {totalReturn >= 0 ? '+' : ''}{totalReturn.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Return %</h3>
                    <p className={`text-2xl font-bold ${totalReturnPct >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                      {totalReturnPct >= 0 ? '+' : ''}{totalReturnPct.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="positions" className="mb-6">
              <TabsList>
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              <TabsContent value="positions" className="mt-4">
                <Card className="glass-card">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/20">
                            <th className="text-left px-4 py-3 font-medium">Symbol</th>
                            <th className="text-left px-4 py-3 font-medium">Name</th>
                            <th className="text-right px-4 py-3 font-medium">Shares</th>
                            <th className="text-right px-4 py-3 font-medium">Avg. Price</th>
                            <th className="text-right px-4 py-3 font-medium">Current Price</th>
                            <th className="text-right px-4 py-3 font-medium">Value</th>
                            <th className="text-right px-4 py-3 font-medium">Return</th>
                          </tr>
                        </thead>
                        <tbody>
                          {positions.map((position, index) => (
                            <tr key={index} className="border-b border-border/10 hover:bg-muted/30">
                              <td className="px-4 py-3 font-medium">{position.symbol}</td>
                              <td className="px-4 py-3">{position.name}</td>
                              <td className="text-right px-4 py-3">{position.shares}</td>
                              <td className="text-right px-4 py-3">${position.avgPrice}</td>
                              <td className="text-right px-4 py-3">${position.currentPrice}</td>
                              <td className="text-right px-4 py-3">${position.value.toLocaleString()}</td>
                              <td className={`text-right px-4 py-3 ${position.returnPct >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                                {position.returnPct >= 0 ? '+' : ''}{position.returnPct.toFixed(2)}%
                                <br />
                                <span className="text-xs">
                                  {position.returnAmt >= 0 ? '+' : ''}${Math.abs(position.returnAmt).toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="transactions" className="mt-4">
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Transaction history will be available soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="performance" className="mt-4">
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Performance metrics will be available soon</p>
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

export default Portfolio;
