"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();

  // Parse breadcrumb segments from pathname
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + segment,
    }));

  if (segments.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {segments.map((segment, index) => (
        <div key={segment.href} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
          {index === segments.length - 1 ? (
            <span className="text-sm font-semibold text-heading">
              {segment.name}
            </span>
          ) : (
            <Link
              href={segment.href}
              className="text-sm text-body hover:text-primary transition-colors duration-150"
            >
              {segment.name}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
