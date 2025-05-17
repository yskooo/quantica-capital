
import { BellIcon } from "lucide-react";

// Mock activities data
const activities = [
  { 
    id: 1, 
    title: "Order Executed", 
    description: "Buy 10 AAPL @ $192.53",
    timestamp: "10:32 AM",
    type: "buy"
  },
  { 
    id: 2, 
    title: "Deposit Completed", 
    description: "$5,000 added to your account",
    timestamp: "Yesterday",
    type: "deposit"
  },
  { 
    id: 3, 
    title: "Order Executed", 
    description: "Sell 15 MSFT @ $337.21",
    timestamp: "Yesterday",
    type: "sell" 
  },
  { 
    id: 4, 
    title: "Dividend Received", 
    description: "$142.50 from AAPL holdings",
    timestamp: "Jun 15",
    type: "dividend"
  },
];

const RecentActivities = () => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "buy":
        return <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-market-bull">↑</div>;
      case "sell":
        return <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-market-bear">↓</div>;
      case "deposit":
        return <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">+</div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">$</div>;
    }
  };

  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start space-x-3">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.timestamp}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6">
          <BellIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No recent activities</p>
        </div>
      )}

      <button className="w-full text-xs text-primary hover:underline">
        View all transactions
      </button>
    </div>
  );
};

export default RecentActivities;
