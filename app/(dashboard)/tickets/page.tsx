"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useTickets, useTicketStats } from "@/hooks/use-social-campaigns";

const priorityStyles: Record<string, string> = {
  Urgent: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-gray-100 text-gray-700",
};

const statusStyles: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-200 text-gray-600",
};

export default function TicketsPage() {
  const { data: tickets, isLoading } = useTickets();
  const { data: stats } = useTicketStats();
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
  });

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-heading">Tickets</h1>
          <p className="text-sm text-muted mt-1">
            Manage customer support tickets
          </p>
        </div>
        <Link href="/tickets/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + Create
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted">
              Open
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-heading">{stats?.open || 0}</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-heading">{stats?.inProgress || 0}</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted">
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-heading">{stats?.resolved || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select
              value={filters.priority}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priority: e.target.value }))
              }
            >
              <option value="">Priority</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
            <Select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Ticket List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-gray-200">
                  <th className="py-3 pr-4">Ticket #</th>
                  <th className="py-3 pr-4">Subject</th>
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Assigned To</th>
                  <th className="py-3 pr-4">Priority</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Created</th>
                  <th className="py-3 pr-4">Last Updated</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-6 text-center text-sm text-muted"
                    >
                      Loading tickets...
                    </td>
                  </tr>
                ) : !tickets || tickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-6 text-center text-sm text-muted"
                    >
                      No tickets found.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={String(ticket._id)} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-medium text-heading">
                        {ticket.ticketId}
                      </td>
                      <td className="py-3 pr-4">{ticket.subject}</td>
                      <td className="py-3 pr-4">{ticket.customer}</td>
                      <td className="py-3 pr-4">{ticket.assignedTo || "-"}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            priorityStyles[ticket.priority]
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            statusStyles[ticket.status]
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{formatDate(ticket.created_at)}</td>
                      <td className="py-3 pr-4">{formatDate(ticket.updated_at)}</td>
                      <td className="py-3">
                        <Link
                          href={`/tickets/${ticket.ticketId}`}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
