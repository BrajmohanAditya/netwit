"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const tasks = [
  {
    id: "T-101",
    title: "Call John Smith",
    assignedTo: "Ava Carter",
    priority: "High",
    status: "Pending",
    dueDate: "2026-01-24",
  },
  {
    id: "T-102",
    title: "Prepare financing docs",
    assignedTo: "Noah Reed",
    priority: "Urgent",
    status: "In Progress",
    dueDate: "2026-01-24",
  },
  {
    id: "T-103",
    title: "Schedule delivery",
    assignedTo: "Emma Hart",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-01-26",
  },
  {
    id: "T-104",
    title: "Update trade-in appraisal",
    assignedTo: "Mason Gray",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-01-20",
  },
];

const priorityStyles: Record<string, string> = {
  Urgent: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-gray-100 text-gray-700",
};

const statusStyles: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-200 text-gray-600",
};

export default function TasksPage() {
  const [view, setView] = useState("My Tasks");
  const [filters, setFilters] = useState({
    assignedTo: "",
    priority: "",
    status: "",
    dueDate: "",
  });
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const stats = useMemo(() => {
    return {
      pending: 12,
      dueToday: 3,
      overdue: 2,
      completed: 45,
    };
  }, []);

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-heading">Tasks</h1>
          <p className="text-sm text-muted mt-1">
            Manage your personal and team workload
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setIsCreateTaskOpen(true)}
        >
          + Create
        </Button>
      </div>

      {/* Views */}
      <div className="flex flex-wrap gap-2">
        {["My Tasks", "Team Tasks", "All"].map((label) => (
          <button
            key={label}
            onClick={() => setView(label)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              view === label
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-heading">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted">
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-heading">
              {stats.dueToday}
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-heading">
              {stats.overdue}
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-heading">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select
              value={filters.assignedTo}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, assignedTo: e.target.value }))
              }
            >
              <option value="">Assigned To</option>
              <option value="Ava Carter">Ava Carter</option>
              <option value="Noah Reed">Noah Reed</option>
              <option value="Emma Hart">Emma Hart</option>
            </Select>
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
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
            <Input
              type="date"
              value={filters.dueDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dueDate: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-gray-200">
                  <th className="py-3 pr-2">☐</th>
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Assigned To</th>
                  <th className="py-3 pr-4">Priority</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Due Date</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-100">
                    <td className="py-3 pr-2">
                      <input type="checkbox" />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-heading">
                        {task.title}
                      </div>
                      <div className="text-xs text-muted">{task.id}</div>
                    </td>
                    <td className="py-3 pr-4">{task.assignedTo}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          priorityStyles[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          statusStyles[task.status]
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{task.dueDate}</td>
                    <td className="py-3">
                      <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Task Modal */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-gray-700"
              >
                Title
              </Label>
              <Input id="title" placeholder="Task title" />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-gray-700"
              >
                Description
              </Label>
              <textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
                placeholder="Task description"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="assignTo"
                className="text-sm font-semibold text-gray-700"
              >
                Assign To
              </Label>
              <Select id="assignTo">
                <option value="">Select user</option>
                <option value="Ava Carter">Ava Carter</option>
                <option value="Noah Reed">Noah Reed</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="text-sm font-semibold text-gray-700"
              >
                Priority
              </Label>
              <Select id="priority">
                <option value="Medium">Medium</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="dueDate"
                className="text-sm font-semibold text-gray-700"
              >
                Due Date
              </Label>
              <Input id="dueDate" type="date" placeholder="mm/dd/yyyy" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateTaskOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsCreateTaskOpen(false)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
