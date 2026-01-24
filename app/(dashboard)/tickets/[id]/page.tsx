import Link from "next/link";
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

export default function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ticketId = params?.id ? params.id.toUpperCase() : ticket.id;

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-heading">
            Ticket #{ticketId}
          </h1>
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Mark as Resolved
            </Button>
            <Button variant="outline">Close</Button>
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
            <Select defaultValue={ticket.priority}>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-muted">Status</p>
            <Select defaultValue={ticket.status}>
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
          {ticket.responses.map((response) => (
            <div
              key={response.time}
              className="rounded-lg border border-gray-100 p-4"
            >
              <div className="text-sm font-medium text-heading">
                {response.name} · {response.time}
              </div>
              <p className="text-sm text-muted mt-2">{response.message}</p>
            </div>
          ))}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Add Response
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
