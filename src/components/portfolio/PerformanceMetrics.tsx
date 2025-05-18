
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { portfolioService } from "@/services/api";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { DataCard } from "@/components/ui/data-card";

// Date formatter for the chart
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const PerformanceMetrics = () => {
  const [timeframe, setTimeframe] = useState<string>("1M");
  
  // Query performance data
  const { data: performanceData, isLoading, error } = useQuery({
    queryKey: ['portfolio-performance', timeframe],
    queryFn: () => portfolioService.getPerformance(timeframe)
  });

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          Performance Metrics
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="max-w-xs">Performance metrics show how your portfolio has performed over different time periods.</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={timeframe} onValueChange={handleTimeframeChange} className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-5">
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="3M">3M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading performance data...</p>
          </div>
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-market-bear">Error loading performance data</p>
          </div>
        ) : performanceData?.data ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <DataCard 
                title="Starting Value" 
                value={formatCurrency(performanceData.data.startValue)}
              />
              <DataCard 
                title="Current Value" 
                value={formatCurrency(performanceData.data.endValue)}
              />
              <DataCard 
                title={`Return (${timeframe})`}
                value={formatCurrency(performanceData.data.changeAmt)}
                trend={performanceData.data.changePct >= 0 ? "up" : "down"}
                trendValue={`${performanceData.data.changePct >= 0 ? '+' : ''}${performanceData.data.changePct.toFixed(2)}%`}
              />
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData.data.data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={['dataMin - 100', 'dataMax + 100']} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [`${formatCurrency(value)}`, 'Value']}
                    labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    contentStyle={{ backgroundColor: 'rgba(22, 22, 26, 0.9)', border: 'none', borderRadius: '4px', padding: '10px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#9b87f5" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p>No performance data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
