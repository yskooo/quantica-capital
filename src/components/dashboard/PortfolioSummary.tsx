
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

// Mock portfolio data
const holdings = [
  { name: "AAPL", value: 35421, percentage: 28.4, change: 2.3 },
  { name: "MSFT", value: 28932, percentage: 23.2, change: 1.5 },
  { name: "GOOGL", value: 21542, percentage: 17.3, change: -0.8 },
  { name: "AMZN", value: 17863, percentage: 14.3, change: 0.5 },
  { name: "TSLA", value: 12553, percentage: 10.1, change: -2.1 },
  { name: "Others", value: 8221, percentage: 6.7, change: 0.2 },
];

const COLORS = ["#8B5CF6", "#9B87F5", "#7E69AB", "#6D28D9", "#5B21B6", "#4C1D95"];

const PortfolioSummary = () => {
  const pieData = holdings.map(holding => ({
    name: holding.name,
    value: holding.percentage
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Portfolio Allocation Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Allocation']}
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
            {holdings.map((holding, index) => (
              <tr key={index} className="border-b border-border/10 hover:bg-muted/30">
                <td className="px-1 py-2">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {holding.name}
                  </div>
                </td>
                <td className="text-right px-1 py-2">${holding.value.toLocaleString()}</td>
                <td className={`text-right px-1 py-2 ${holding.change >= 0 ? 'text-market-bull' : 'text-market-bear'}`}>
                  {holding.change >= 0 ? '+' : ''}{holding.change}%
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
