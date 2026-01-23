"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "gray" | "blue" | "green" | "yellow" | "red";
type BadgeRadius = "default" | "pill";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  radius?: BadgeRadius;
  children: React.ReactNode;
}

// Design System 3.6 Color Specs
const variantStyles: Record<BadgeVariant, string> = {
  gray: "bg-gray-100 text-gray-900", // #F3F4F6 bg, #374151 text
  blue: "bg-blue-100 text-blue-900", // #DBEAFE bg, #1E40AF text
  green: "bg-green-100 text-green-900", // #D1FAE5 bg, #065F46 text
  yellow: "bg-yellow-100 text-yellow-900", // #FEF3C7 bg, #92400E text
  red: "bg-red-100 text-red-900", // #FEE2E2 bg, #991B1B text
};

const radiusStyles: Record<BadgeRadius, string> = {
  default: "rounded", // 4px
  pill: "rounded-full", // 999px
};

/**
 * Badge Component
 *
 * Used for: Status, tags, counts
 * Height: 24px (h-6)
 * Padding: 6px 10px (px-2.5 py-1.5)
 * Font: 12px medium (text-xs font-medium)
 * Radius: 4px (default) or 999px (pill)
 *
 * @example
 * // Gray badge
 * <Badge variant="gray">New</Badge>
 *
 * // Blue pill badge
 * <Badge variant="blue" radius="pill">Active</Badge>
 *
 * // Green badge
 * <Badge variant="green">Verified</Badge>
 */
function Badge({
  variant = "gray",
  radius = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        "h-6 px-2.5 py-1.5",
        "text-xs font-medium",
        "whitespace-nowrap",
        variantStyles[variant],
        radiusStyles[radius],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge };
export type { BadgeVariant, BadgeRadius, BadgeProps };
