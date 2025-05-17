
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChartLine, 
  ArrowDown, 
  ArrowUp,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import TradingViewWidget from "@/components/trading/TradingViewWidget";
import OrderForm from "@/components/trading/OrderForm";

// Mock data for the trading page
const watchlist = [
  { symbol: "AAPL", name: "Apple Inc.", price: 192.53, change: 1.28, changePct: 0.67 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 337.21, change: 2.43, changePct: 0.73 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 137.45, change: -1.23, changePct: -0.89 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 134.68, change: 0.54, changePct: 0.40 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 242.21, change: -3.45, changePct: -1.40 }
];

const orderHistory = [
  { id: "ORD-2305", symbol: "AAPL", type: "BUY", quantity: 10, price: 190.25, total: 1902.50, status: "Completed", date: "2023-06-15 10:32 AM" },
  { id: "ORD-2304", symbol: "MSFT", type: "SELL", quantity: 5, price: 335.50, total: 1677.50, status: "Completed", date: "2023-06-15 09:45 AM" },
  { id: "ORD-2303", symbol: "GOOGL", type: "BUY", quantity: 8, price: 138.75, total: 1110.00, status: "Completed", date: "2023-06-14 03:21 PM" },
  { id: "ORD-2302", symbol: "TSLA", type: "BUY", quantity: 3, price: 245.30, total: 735.90, status: "Completed", date: "2023-06-14 01:15 PM" },
  { id: "ORD-2301", symbol: "AMZN", type: "SELL", quantity: 4, price: 133.20, total: 532.80, status: "Completed", date: "2023-06-13 11:05 AM" }
];

const Trading = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSymbol, setActiveSymbol] = useState("AAPL");
  const [symbolData, setSymbolData] = useState({
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 192.53,
    change: 1.28,
    changePct: 0.67,
    high: 193.42,
    low: 190.18,
    open: 191.24,
    prevClose: 191.25,
    volume: "32.5M"
  });

  const handleSymbolSelect = (symbol: string) => {
    setActiveSymbol(symbol);
    // Find the data for the selected symbol
    const data = watchlist.find(item => item.symbol === symbol);
    if (data) {
      setSymbolData({
        ...data,
        high: data.price + (Math.random() * 2),
        low: data.price - (Math.random() * 2),
        open: data.price - (data.change / 2),
        prevClose: data.price - data.change,
        volume: Math.floor(Math.random() * 50) + "M"
      });
    }
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
                <h1 className="text-2xl md:text-3xl font-bold">Trading</h1>
                <p className="text-muted-foreground">Execute trades and manage your watchlist</p>
              </div>
            </div>

            {/* Trading View Chart and Order Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <span>{symbolData.symbol}</span>
                        <span className="text-base font-normal text-muted-foreground">{symbolData.name}</span>
                      </CardTitle>
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-2">${symbolData.price}</span>
                        <span className={`text-sm ${symbolData.change >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                          {symbolData.change >= 0 ? '+' : ''}{symbolData.change} ({symbolData.changePct >= 0 ? '+' : ''}{symbolData.changePct}%)
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TradingViewWidget symbol={activeSymbol} />
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                      <div className="text-center p-2 bg-card rounded-md">
                        <p className="text-xs text-muted-foreground">Open</p>
                        <p className="font-medium">${symbolData.open.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-2 bg-card rounded-md">
                        <p className="text-xs text-muted-foreground">High</p>
                        <p className="font-medium">${symbolData.high.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-2 bg-card rounded-md">
                        <p className="text-xs text-muted-foreground">Low</p>
                        <p className="font-medium">${symbolData.low.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-2 bg-card rounded-md">
                        <p className="text-xs text-muted-foreground">Prev Close</p>
                        <p className="font-medium">${symbolData.prevClose.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-2 bg-card rounded-md">
                        <p className="text-xs text-muted-foreground">Volume</p>
                        <p className="font-medium">{symbolData.volume}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <OrderForm symbol={activeSymbol} price={symbolData.price} />
              </div>
            </div>

            {/* Watchlist and Order History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Watchlist */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">Watchlist</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/20">
                          <th className="text-left px-4 py-3 font-medium">Symbol</th>
                          <th className="text-right px-4 py-3 font-medium">Price</th>
                          <th className="text-right px-4 py-3 font-medium">Change</th>
                          <th className="text-center px-4 py-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {watchlist.map((item, index) => (
                          <tr key={index} className="border-b border-border/10 hover:bg-muted/30">
                            <td 
                              className="px-4 py-3 font-medium cursor-pointer hover:text-primary"
                              onClick={() => handleSymbolSelect(item.symbol)}
                            >
                              {item.symbol}
                            </td>
                            <td className="text-right px-4 py-3">${item.price}</td>
                            <td className={`text-right px-4 py-3 ${item.change >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                              {item.change >= 0 ? '+' : ''}{item.change} ({item.changePct}%)
                            </td>
                            <td className="text-center px-4 py-3">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => handleSymbolSelect(item.symbol)}
                              >
                                <ChartLine className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Order History */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/20">
                          <th className="text-left px-4 py-3 font-medium">ID</th>
                          <th className="text-left px-4 py-3 font-medium">Symbol</th>
                          <th className="text-center px-4 py-3 font-medium">Type</th>
                          <th className="text-right px-4 py-3 font-medium">Quantity</th>
                          <th className="text-right px-4 py-3 font-medium">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderHistory.slice(0, 5).map((order, index) => (
                          <tr key={index} className="border-b border-border/10 hover:bg-muted/30">
                            <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                            <td className="px-4 py-3">{order.symbol}</td>
                            <td className="text-center px-4 py-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.type === 'BUY' ? 'bg-market-bull/20 text-market-bull' : 'bg-market-bear/20 text-market-bear'
                              }`}>
                                {order.type}
                              </span>
                            </td>
                            <td className="text-right px-4 py-3">{order.quantity}</td>
                            <td className="text-right px-4 py-3">${order.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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

export default Trading;
