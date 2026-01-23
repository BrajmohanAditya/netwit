"use client";

import { X, Download, Trash2, ChevronDown } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onChangeStatus?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onChangeStatus,
  onExport,
  onDelete,
  onClose,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center gap-4 z-20">
      {/* Count */}
      <div className="text-sm font-medium text-gray-700">
        {selectedCount} vehicle{selectedCount !== 1 ? "s" : ""} selected
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
        {/* Change Status */}
        <div className="relative group">
          <button
            onClick={onChangeStatus}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Change Status
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Export */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          <Download className="h-4 w-4" />
          Export
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="ml-auto p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Close bulk actions"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
