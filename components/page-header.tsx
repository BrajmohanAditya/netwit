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
    <div className="flex justify-between items-center mb-8 px-6 py-4">
      <h1 className="text-page-title font-bold text-heading">{title}</h1>
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  );
}
