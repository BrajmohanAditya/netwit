import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface VehicleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  price: number;
  status: "Available" | "Reserved" | "Sold" | "Pending";
  stockNumber: string;
  specs: Array<{
    icon?: string;
    label: string;
  }>;
  vin: string;
  actions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
  onSelect?: () => void;
}

const statusColors = {
  Available: "bg-green-500",
  Reserved: "bg-amber-500",
  Sold: "bg-red-500",
  Pending: "bg-blue-500",
};

const VehicleCard = React.forwardRef<HTMLDivElement, VehicleCardProps>(
  (
    {
      id,
      image,
      title,
      subtitle,
      price,
      status,
      stockNumber,
      specs,
      vin,
      actions,
      onSelect,
      className,
      ...props
    },
    ref,
  ) => {
    const [showActions, setShowActions] = React.useState(false);

    return (
      <div
        ref={ref}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={onSelect}
        className={cn(
          "relative w-full max-w-xs overflow-hidden rounded-lg border border-gray-200 bg-white shadow-elevation-1 transition-all duration-200",
          onSelect && "cursor-pointer hover:shadow-elevation-2",
          className,
        )}
        {...props}
      >
        {/* Image Section */}
        <div className="relative h-40 w-full bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback for missing images
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />

          {/* Status Badge - Top Right */}
          <div
            className={cn(
              "absolute right-3 top-3 rounded px-3 py-1.5 text-xs font-semibold text-white",
              statusColors[status],
            )}
          >
            {status}
          </div>

          {/* Stock # Badge - Top Left */}
          <div className="absolute left-3 top-3 rounded bg-black/60 px-2.5 py-1.5 font-mono text-xs text-white">
            {stockNumber}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3 p-4">
          {/* Title */}
          <h3 className="truncate text-base font-bold text-gray-900">
            {title}
          </h3>

          {/* Subtitle */}
          <p className="truncate text-sm text-gray-600">{subtitle}</p>

          {/* Price */}
          <div className="text-xl font-bold text-blue-600">
            ${price.toLocaleString()}
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 text-xs text-gray-600"
                >
                  {spec.icon && <span>{spec.icon}</span>}
                  <span>{spec.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* VIN */}
          <div className="truncate font-mono text-xs text-gray-400">
            VIN: {vin}
          </div>
        </div>

        {/* Actions Section - Hidden by Default */}
        {actions && actions.length > 0 && (
          <div
            className={cn(
              "border-t border-gray-200 bg-gray-50 p-4 transition-all duration-200",
              showActions ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div className="flex gap-2">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-white px-3 py-2 text-xs font-medium text-gray-700 border border-gray-200 transition-colors hover:bg-gray-100 hover:border-gray-300"
                >
                  {action.icon}
                  <span className="hidden sm:inline">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);
VehicleCard.displayName = "VehicleCard";

export { VehicleCard };
