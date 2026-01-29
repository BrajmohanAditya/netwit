"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const ticket = {
  id: "T-001",
  customer: "John Smith",
  email: "john@example.com",
  phone: "(604) 123-4567",
  subject: "Question about financing",
  priority: "Medium",
  status: "Open",
  assignedTo: "Agam",
  description: "Looking for updated financing options on a 2021 Ford Mustang.",
  responses: [
    {
      name: "Agam",
      time: "2 hours ago",
      message: "Thanks for reaching out. I can share updated rates today.",
    },
  ],
};

const statusStyles: Record<string, string> = {
  Open: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-200 text-gray-700",
};

export default function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ticketId = params?.id ? params.id.toUpperCase() : ticket.id;
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [responses, setResponses] = useState(ticket.responses);
  const [responseDraft, setResponseDraft] = useState("");

  const handleAddResponse = () => {
    const trimmed = responseDraft.trim();
    if (!trimmed) {
      return;
    }

    setResponses((prev) => [
      ...prev,
      {
        name: ticket.assignedTo,
        time: "Just now",
        message: trimmed,
      },
    ]);
    setResponseDraft("");
  };

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-heading">
              Ticket #{ticketId}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                statusStyles[status] || "bg-slate-100 text-slate-700"
              }`}
            >
              {status}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setStatus("Resolved")}
              disabled={status === "Resolved" || status === "Closed"}
            >
              Mark as Resolved
            </Button>
            <Button
              variant="outline"
              onClick={() => setStatus("Closed")}
              disabled={status === "Closed"}
            >
              Close
            </Button>
          </div>
        </div>
        <Link
          href="/tickets"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          ← Back to Tickets
        </Link>
      </div>

      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Customer</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted">Customer</p>
            <p className="font-medium text-heading">{ticket.customer}</p>
          </div>
          <div>
            <p className="text-muted">Email</p>
            <p className="font-medium text-heading">{ticket.email}</p>
          </div>
          <div>
            <p className="text-muted">Phone</p>
            <p className="font-medium text-heading">{ticket.phone}</p>
          </div>
          <div>
            <p className="text-muted">Assigned</p>
            <p className="font-medium text-heading">{ticket.assignedTo}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted">Subject</p>
            <p className="font-medium text-heading">{ticket.subject}</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted">Priority</p>
            <Select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-muted">Status</p>
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">{ticket.description}</p>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Responses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {responses.map((response, index) => (
            <div
              key={`${response.time}-${index}`}
              className="rounded-lg border border-gray-100 p-4"
            >
              <div className="text-sm font-medium text-heading">
                {response.name} · {response.time}
              </div>
              <p className="text-sm text-muted mt-2">{response.message}</p>
            </div>
          ))}
          <div className="space-y-3">
            <textarea
              className="flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              rows={3}
              placeholder="Write a response..."
              value={responseDraft}
              onChange={(event) => setResponseDraft(event.target.value)}
            />
            <div className="flex justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddResponse}
              >
                Add Response
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
