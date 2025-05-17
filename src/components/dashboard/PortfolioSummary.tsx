
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { portfolioService, PortfolioHolding } from "@/services/database";

// Colors for the chart
const COLORS = ["#8B5CF6", "#9B87F5", "#7E69AB", "#6D28D9", "#5B21B6", "#4C1D95"];

const PortfolioSummary = () => {
  // Use react-query to fetch portfolio holdings
  const { 
    data: holdings,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['portfolio', 'holdings'],
    queryFn: () => portfolioService.getHoldings(),
    // Mock data for preview until connected to real API
    initialData: { 
      data: [
        { symbol: "AAPL", name: "Apple Inc.", shares: 25, avgPrice: 182.63, currentPrice: 192.53, value: 4813.25, returnPct: 5.42, returnAmt: 247.5 },
        { symbol: "MSFT", name: "Microsoft Corp.", shares: 15, avgPrice: 324.98, currentPrice: 337.21, value: 5058.15, returnPct: 3.76, returnAmt: 183.45 },
        { symbol: "GOOGL", name: "Alphabet Inc.", shares: 10, avgPrice: 140.23, currentPrice: 137.45, value: 1374.5, returnPct: -1.98, returnAmt: -27.8 },
        { symbol: "AMZN", name: "Amazon.com Inc.", shares: 12, avgPrice: 132.74, currentPrice: 134.68, value: 1616.16, returnPct: 1.46, returnAmt: 23.28 },
        { symbol: "TSLA", name: "Tesla Inc.", shares: 8, avgPrice: 247.35, currentPrice: 242.21, value: 1937.68, returnPct: -2.08, returnAmt: -41.12 },
        { name: "Others", shares: 0, avgPrice: 0, currentPrice: 0, value: 8221, returnPct: 0.2, returnAmt: 16.44, symbol: "OTHERS" }
      ], 
      error: null 
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading portfolio data...</div>;
  }

  if (isError || !holdings?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load portfolio data</p>
          <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }

  const pieData = holdings.data.map(holding => ({
    name: holding.symbol,
    value: holding.value
  }));

  // Calculate percentages
  const totalValue = holdings.data.reduce((sum, holding) => sum + holding.value, 0);
  const pieDataWithPercentage = pieData.map(item => ({
    ...item,
    percentage: (item.value / totalValue) * 100
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Portfolio Allocation Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieDataWithPercentage}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {pieDataWithPercentage.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
              contentStyle={{ 
                backgroundColor: 'rgba(22, 22, 26, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                color: 'white'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/20">
              <th className="text-left px-1 py-2 font-medium">Symbol</th>
              <th className="text-right px-1 py-2 font-medium">Value</th>
              <th className="text-right px-1 py-2 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {holdings.data.map((holding, index) => (
              <tr key={index} className="border-b border-border/10 hover:bg-muted/30">
                <td className="px-1 py-2">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {holding.symbol}
                  </div>
                </td>
                <td className="text-right px-1 py-2">${holding.value.toLocaleString()}</td>
                <td className={`text-right px-1 py-2 ${holding.returnPct >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                  {holding.returnPct >= 0 ? '+' : ''}{holding.returnPct.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioSummary;
