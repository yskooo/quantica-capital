
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradingViewWidget from "@/components/trading/TradingViewWidget";

// Mock market overview data
const marketOverviewIndices = [
  { name: "S&P 500", value: "4,591.97", change: "+0.28%" },
  { name: "Nasdaq", value: "14,373.22", change: "+0.43%" },
  { name: "Dow Jones", value: "36,117.38", change: "+0.15%" },
  { name: "Russell 2000", value: "1,932.25", change: "-0.11%" },
];

const marketOverviewCurrencies = [
  { name: "USD/JPY", value: "139.45", change: "+0.08%" },
  { name: "EUR/USD", value: "1.0789", change: "-0.12%" },
  { name: "GBP/USD", value: "1.2565", change: "+0.05%" },
  { name: "USD/CAD", value: "1.3341", change: "-0.02%" },
];

const cryptoCurrencies = [
  { name: "BTC/USD", value: "38,245.60", change: "+1.28%" },
  { name: "ETH/USD", value: "2,187.34", change: "+0.87%" },
  { name: "SOL/USD", value: "104.56", change: "-2.31%" },
  { name: "XRP/USD", value: "0.5921", change: "+0.15%" },
];

const MarketOverview = () => {
  const [timeframe, setTimeframe] = useState("1D");
  const [marketTab, setMarketTab] = useState("index");
  const [symbol, setSymbol] = useState("SPY");

  const handleTabChange = (value: string) => {
    setMarketTab(value);
    // Update symbol based on tab
    switch (value) {
      case "index":
        setSymbol("SPY");
        break;
      case "forex":
        setSymbol("USDJPY");
        break;
      case "crypto":
        setSymbol("BTCUSD");
        break;
      default:
        setSymbol("SPY");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <Tabs value={marketTab} onValueChange={handleTabChange} className="w-full md:w-auto">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="index">Indices</TabsTrigger>
            <TabsTrigger value="forex">Currencies</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? "secondary" : "outline"}
              size="sm"
              onClick={() => setTimeframe(period)}
              className="px-3 py-1 h-auto"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* TradingView Chart */}
      <div className="chart-container h-64 md:h-[300px]">
        <div className="text-sm text-muted-foreground mb-2 flex items-center justify-between">
          <span>{marketTab === "index" ? "S&P 500" : marketTab === "forex" ? "USD/JPY" : "BTC/USD"} - {timeframe}</span>
          <span className="text-xs font-mono">Powered by TradingView</span>
        </div>
        <TradingViewWidget symbol={symbol} height={240} />
      </div>

      {/* Market Data Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(marketTab === "index" ? marketOverviewIndices : 
          marketTab === "forex" ? marketOverviewCurrencies : 
          cryptoCurrencies).map((index, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{index.name}</p>
              <p className="text-xl font-bold mt-1">{index.value}</p>
              <p className={`text-xs mt-1 ${index.change.startsWith("+") ? "text-market-bull" : "text-market-bear"}`}>
                {index.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;
