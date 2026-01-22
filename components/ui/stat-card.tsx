import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  iconBg: string; // Tailwind color class like "bg-blue-500"
  number: number | string;
  label: string;
  change: number;
  isPositive?: boolean;
  trend?: "up" | "down";
  onClick?: () => void;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      icon,
      iconBg,
      number,
      label,
      change,
      isPositive,
      trend,
      onClick,
      className,
      ...props
    },
    ref,
  ) => {
    // Determine trend direction
    const isUp =
      trend === "up" || (isPositive !== undefined ? isPositive : change >= 0);
    const trendColor = isUp ? "text-green-600" : "text-red-600";
    const TrendIcon = isUp ? ChevronUp : ChevronDown;

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "h-120px flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-elevation-1 transition-all duration-200",
          onClick && "cursor-pointer hover:bg-gray-50 hover:shadow-elevation-2",
          className,
        )}
        {...props}
      >
        {/* Icon Container */}
        <div
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
            iconBg,
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-28px font-bold text-gray-900">{number}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>

        {/* Change Indicator */}
        <div className={cn("flex items-center gap-1", trendColor)}>
          <TrendIcon className="h-4 w-4" />
          <span className="text-xs font-medium">{Math.abs(change)}%</span>
        </div>
      </div>
    );
  },
);
StatCard.displayName = "StatCard";

export { StatCard };
