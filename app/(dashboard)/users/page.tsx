"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserStatus = "Active" | "Inactive" | "Invited";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  startedAt: string;
  lastLogin: string;
}

interface ActivityLogRow {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ipAddress: string;
}

const users: UserRow[] = [
  {
    id: "user-1",
    name: "Agam Chawla",
    email: "agam@adaptus.com",
    role: "Admin",
    status: "Active",
    startedAt: "Jan 05, 2024",
    lastLogin: "Jan 25, 2026",
  },
  {
    id: "user-2",
    name: "Jamie Lee",
    email: "jamie@adaptus.com",
    role: "Sales",
    status: "Active",
    startedAt: "Mar 12, 2024",
    lastLogin: "Jan 24, 2026",
  },
  {
    id: "user-3",
    name: "Sam Patel",
    email: "sam@adaptus.com",
    role: "Manager",
    status: "Invited",
    startedAt: "Jan 20, 2026",
    lastLogin: "—",
  },
];

const statusStyles: Record<UserStatus, string> = {
  Active: "bg-green-100 text-green-900",
  Inactive: "bg-slate-100 text-slate-900",
  Invited: "bg-yellow-100 text-yellow-900",
};

const activityLogs: ActivityLogRow[] = [
  {
    id: "log-1",
    timestamp: "Jan 20, 2:15 PM",
    user: "Agam",
    action: "Created Lead",
    details: "L-042",
    ipAddress: "192.168.1.12",
  },
  {
    id: "log-2",
    timestamp: "Jan 20, 2:10 PM",
    user: "Agam",
    action: "Updated Vehicle",
    details: "V-123",
    ipAddress: "192.168.1.12",
  },
  {
    id: "log-3",
    timestamp: "Jan 20, 2:05 PM",
    user: "Sam",
    action: "Deleted Customer",
    details: "C-456",
    ipAddress: "192.168.1.28",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const createEmptyUserForm = () => ({
  avatar: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "Sales Staff",
  gender: "male",
  status: "active",
  permissions: {
    viewInventory: true,
    createLeads: true,
    scheduleTestDrives: true,
    editPricing: false,
    deleteRecords: false,
    viewReports: false,
  },
});

export default function UsersPage() {
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
  });
  const [activityFilters, setActivityFilters] = useState({
    user: "",
    action: "",
    dateRange: "",
  });
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "view" | "edit">(
    "create",
  );
  const [userForm, setUserForm] = useState(createEmptyUserForm());

  const getFormFromUser = (user: UserRow) => {
    const [firstName, ...rest] = user.name.split(" ");
    const lastName = rest.join(" ");
    return {
      ...createEmptyUserForm(),
      firstName,
      lastName,
      email: user.email,
      role: user.role,
      status: user.status === "Active" ? "active" : "inactive",
    };
  };

  const openUserDialog = (mode: "create" | "view" | "edit", user?: UserRow) => {
    setDialogMode(mode);
    setUserForm(user ? getFormFromUser(user) : createEmptyUserForm());
    setIsUserOpen(true);
  };

  const isReadOnly = dialogMode === "view";

  return (
    <div className="flex-1 space-y-6 px-6 py-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Users &amp; Roles</h1>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => openUserDialog("create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              placeholder="Search"
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
            />
            <Select
              value={filters.role}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  role: event.target.value,
                }))
              }
            >
              <option value="">Role</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
              <option value="Support">Support</option>
            </Select>
            <Select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  status: event.target.value,
                }))
              }
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Invited">Invited</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge className={statusStyles[user.status]}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.startedAt}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openUserDialog("view", user)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openUserDialog("edit", user)}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <div className="text-sm font-semibold text-muted-foreground">
            Roles
          </div>
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>Admin (All permissions)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>Manager (Most permissions)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>Sales Staff (Limited)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>Receptionist (View only + scheduling)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>Accountant (Financial only)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>Viewer (Read-only)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground">
              Activity Logs
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Select
              value={activityFilters.user}
              onChange={(event) =>
                setActivityFilters((prev) => ({
                  ...prev,
                  user: event.target.value,
                }))
              }
            >
              <option value="">User</option>
              <option value="Agam">Agam</option>
              <option value="Jamie">Jamie</option>
              <option value="Sam">Sam</option>
            </Select>
            <Select
              value={activityFilters.action}
              onChange={(event) =>
                setActivityFilters((prev) => ({
                  ...prev,
                  action: event.target.value,
                }))
              }
            >
              <option value="">Action Type</option>
              <option value="Created Lead">Created Lead</option>
              <option value="Updated Vehicle">Updated Vehicle</option>
              <option value="Deleted Customer">Deleted Customer</option>
            </Select>
            <Select
              value={activityFilters.dateRange}
              onChange={(event) =>
                setActivityFilters((prev) => ({
                  ...prev,
                  dateRange: event.target.value,
                }))
              }
            >
              <option value="">Date Range</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.details}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Dialog open={isUserOpen} onOpenChange={setIsUserOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "view"
                ? "User Details"
                : dialogMode === "edit"
                  ? "Edit User"
                  : "Add User"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "view"
                ? "Review user profile details."
                : "Add or edit a user profile."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user-avatar">Avatar</Label>
              <Input
                id="user-avatar"
                type="file"
                disabled={isReadOnly}
                onChange={(event) =>
                  setUserForm((prev) => ({
                    ...prev,
                    avatar: event.target.files?.[0]?.name ?? "",
                  }))
                }
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="user-first">First Name</Label>
                <Input
                  id="user-first"
                  value={userForm.firstName}
                  disabled={isReadOnly}
                  onChange={(event) =>
                    setUserForm((prev) => ({
                      ...prev,
                      firstName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-last">Last Name</Label>
                <Input
                  id="user-last"
                  value={userForm.lastName}
                  disabled={isReadOnly}
                  onChange={(event) =>
                    setUserForm((prev) => ({
                      ...prev,
                      lastName: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                value={userForm.email}
                disabled={isReadOnly}
                onChange={(event) =>
                  setUserForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user-role">Role</Label>
              <Select
                id="user-role"
                value={userForm.role}
                disabled={isReadOnly}
                onChange={(event) =>
                  setUserForm((prev) => ({
                    ...prev,
                    role: event.target.value,
                  }))
                }
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Sales Staff">Sales Staff</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Accountant">Accountant</option>
                <option value="Viewer">Viewer</option>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Gender</Label>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={userForm.gender === option.value}
                      disabled={isReadOnly}
                      onChange={(event) =>
                        setUserForm((prev) => ({
                          ...prev,
                          gender: event.target.value,
                        }))
                      }
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={userForm.status === option.value}
                      disabled={isReadOnly}
                      onChange={(event) =>
                        setUserForm((prev) => ({
                          ...prev,
                          status: event.target.value,
                        }))
                      }
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Permissions (based on role)</Label>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={userForm.permissions.viewInventory}
                    disabled={isReadOnly}
                    onChange={(event) =>
                      setUserForm((prev) => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          viewInventory: event.target.checked,
                        },
                      }))
                    }
                  />
                  View Inventory
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={userForm.permissions.createLeads}
                    disabled={isReadOnly}
                    onChange={(event) =>
                      setUserForm((prev) => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          createLeads: event.target.checked,
                        },
                      }))
                    }
                  />
                  Create Leads
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={userForm.permissions.scheduleTestDrives}
                    disabled={isReadOnly}
                    onChange={(event) =>
                      setUserForm((prev) => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          scheduleTestDrives: event.target.checked,
                        },
                      }))
                    }
                  />
                  Schedule Test Drives
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={userForm.permissions.editPricing}
                    disabled={isReadOnly}
                    onChange={(event) =>
                      setUserForm((prev) => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          editPricing: event.target.checked,
                        },
                      }))
                    }
                  />
                  Edit Pricing
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={userForm.permissions.deleteRecords}
                    disabled={isReadOnly}
                    onChange={(event) =>
                      setUserForm((prev) => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          deleteRecords: event.target.checked,
                        },
                      }))
                    }
                  />
                  Delete Records
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={userForm.permissions.viewReports}
                    disabled={isReadOnly}
                    onChange={(event) =>
                      setUserForm((prev) => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          viewReports: event.target.checked,
                        },
                      }))
                    }
                  />
                  View Reports
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsUserOpen(false)}>
                {isReadOnly ? "Close" : "Cancel"}
              </Button>
              {!isReadOnly && (
                <Button variant="primary" onClick={() => setIsUserOpen(false)}>
                  Save
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
