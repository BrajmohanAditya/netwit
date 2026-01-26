"use client";

import { useState } from "react";
import {
  Plus,
  BarChart3,
  Mail,
  MessageSquare,
  Megaphone,
  Calendar as CalendarIcon,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CampaignStatus = "Active" | "Scheduled" | "Completed" | "Draft";
type CampaignType = "Email" | "SMS" | "Social";

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  audience: string;
  sent?: number;
  opened?: number;
  clicked?: number;
  date: string;
}

const campaigns: Campaign[] = [
  {
    id: "cmp-1",
    name: "Winter Service Special",
    type: "Email",
    status: "Active",
    audience: "All Past Service Customers",
    sent: 1250,
    opened: 450,
    clicked: 120,
    date: "Jan 24, 2026",
  },
  {
    id: "cmp-2",
    name: "New SUV Arrivals",
    type: "Social",
    status: "Completed",
    audience: "Facebook Followers",
    sent: 5000,
    opened: 2100,
    clicked: 350,
    date: "Jan 10, 2026",
  },
  {
    id: "cmp-3",
    name: "Loyalty Discount",
    type: "SMS",
    status: "Scheduled",
    audience: "VIP Customers",
    date: "Feb 01, 2026",
  },
  {
    id: "cmp-4",
    name: "Spring Tire Swap",
    type: "Email",
    status: "Draft",
    audience: "Tire Storage Customers",
    date: "Mar 15, 2026",
  },
];

const getCampaignStatusVariant = (status: CampaignStatus) => {
  switch (status) {
    case "Active":
      return "green";
    case "Scheduled":
      return "blue";
    case "Completed":
      return "gray";
    case "Draft":
      return "gray";
    default:
      return "gray";
  }
};

const typeIcons: Record<CampaignType, any> = {
  Email: Mail,
  SMS: MessageSquare,
  Social: Megaphone,
};

export default function CampaignsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="flex-1 space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Marketing Campaigns</h1>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.4%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              +18 since last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Campaigns</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const Icon = typeIcons[campaign.type];
            return (
              <Card key={campaign.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Icon className="h-4 w-4 text-slate-700" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {campaign.name}
                        </CardTitle>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <CalendarIcon className="h-3 w-3" />
                          {campaign.date}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant={getCampaignStatusVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="gray">{campaign.type}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Audience:</span>
                      <span className="font-medium">{campaign.audience}</span>
                    </div>
                    {campaign.status !== "Scheduled" &&
                      campaign.status !== "Draft" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sent:</span>
                            <span className="font-medium">
                              {campaign.sent?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Opened:
                            </span>
                            <span className="font-medium">
                              {campaign.opened?.toLocaleString()} (
                              {Math.round(
                                (campaign.opened! / campaign.sent!) * 100,
                              )}
                              %)
                            </span>
                          </div>
                        </>
                      )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Launch a new marketing campaign to reach your customers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input placeholder="e.g. Summer Sale" />
            </div>
            <div className="space-y-2">
              <Label>Campaign Type</Label>
              <Select>
                <option value="email">Email Blast</option>
                <option value="sms">SMS Broadcast</option>
                <option value="social">Social Media Post</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select>
                <option value="all">All Customers</option>
                <option value="leads">New Leads</option>
                <option value="service">Service Customers</option>
                <option value="vip">VIPs</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scheduled Date</Label>
              <Input type="date" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateOpen(false)}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
