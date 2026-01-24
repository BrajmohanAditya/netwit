import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function CreateTicketPage() {
  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/tickets" className="hover:text-blue-600">
              Tickets
            </Link>
            <span>/</span>
            <span className="text-gray-700">Create</span>
          </div>
          <h1 className="text-3xl font-bold text-heading">Create Ticket</h1>
          <p className="text-sm text-muted">
            Capture the customer issue and route it to the right teammate.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Customer details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Customer Name
                  </label>
                  <Input placeholder="Customer name" className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Email
                  </label>
                  <Input placeholder="name@example.com" className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Phone
                  </label>
                  <Input placeholder="(604) 123-4567" className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Ticket details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Subject
                  </label>
                  <Input placeholder="Ticket subject" className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Priority
                  </label>
                  <Select className="mt-1">
                    <option value="Medium">Medium</option>
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Assign To
                  </label>
                  <Select className="mt-1">
                    <option value="">Select user</option>
                    <option value="Agam">Agam</option>
                    <option value="Ava Carter">Ava Carter</option>
                    <option value="Noah Reed">Noah Reed</option>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Description
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    rows={5}
                    placeholder="Describe the issue and include any helpful context"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Ticket info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Ticket #
                </p>
                <p className="text-sm text-gray-500">
                  Auto-generated on create
                </p>
                <Input value="T-001" disabled className="mt-3 bg-white" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Status
                </label>
                <Select className="mt-1">
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Channel
                </label>
                <Select className="mt-1">
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Chat">Chat</option>
                  <option value="Walk-in">Walk-in</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Helpful tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted">
              <p>
                Add a clear subject and include any VINs or vehicle details in
                the description for faster resolution.
              </p>
              <p>
                Use “Urgent” priority only when the customer is blocked from
                taking delivery.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Submit Ticket
        </Button>
      </div>
    </div>
  );
}
