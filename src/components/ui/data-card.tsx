
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
    <Card className={cn("border-border/40 bg-card/50 hover:bg-card/70 transition-colors", className)} {...props}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground/80 flex items-center justify-between font-medium">
          {title}
          {icon && <span className="text-primary">{icon}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {trend && trendValue && (
          <p className={`text-xs mt-1 flex items-center font-medium ${getTrendColor()}`}>
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
