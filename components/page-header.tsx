"use client";

import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8 px-4 sm:px-6 py-4">
      <h1 className="text-2xl sm:text-page-title font-bold text-heading">
        {title}
      </h1>
      {action && (
        <Button
          variant="primary"
          size="md"
          onClick={action.onClick}
          className="w-full sm:w-auto justify-center"
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  );
}
