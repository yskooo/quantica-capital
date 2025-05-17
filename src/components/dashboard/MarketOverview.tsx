
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";

// Mock chart data
const marketData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 700 },
  { name: "Jun", value: 900 },
  { name: "Jul", value: 1100 },
  { name: "Aug", value: 1200 },
  { name: "Sep", value: 1000 },
  { name: "Oct", value: 1300 },
  { name: "Nov", value: 1500 },
  { name: "Dec", value: 1700 },
];

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

const MarketOverview = () => {
  const [timeframe, setTimeframe] = useState("1D");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <Tabs defaultValue="index" className="w-full md:w-auto">
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

      <div className="chart-container h-64 md:h-80">
        <p className="text-sm text-muted-foreground mb-2">S&P 500 - {timeframe}</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={marketData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8B5CF6" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(22, 22, 26, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                color: 'white'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {marketOverviewIndices.map((index, i) => (
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

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Note:</span> Full TradingView charts integration will be available in the next update
        </p>
      </div>
    </div>
  );
};

export default MarketOverview;
