
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const DataCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  className,
  ...props
}: DataCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-market-bull";
      case "down":
        return "text-market-bear";
      default:
        return "text-market-neutral";
    }
  };

  return (
    <Card className={cn("glass-card", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          {title}
          {icon && <span className="text-primary">{icon}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && trendValue && (
          <p className={`text-xs mt-1 flex items-center ${getTrendColor()}`}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "→"} {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;
