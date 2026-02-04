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
import { useCampaigns, useCampaignStats, useCreateCampaign, useDeleteCampaign } from "@/hooks/use-social-campaigns";
import { toast } from "react-hot-toast";

type CampaignStatus = "Active" | "Scheduled" | "Completed" | "Draft";
type CampaignType = "Email" | "SMS" | "Social";

const getCampaignStatusVariant = (status: CampaignStatus) => {
  switch (status) {
    case "Active":
      return "default";
    case "Scheduled":
      return "secondary";
    case "Completed":
      return "outline";
    case "Draft":
      return "outline";
    default:
      return "secondary";
  }
};

const typeIcons: Record<CampaignType, any> = {
  Email: Mail,
  SMS: MessageSquare,
  Social: Megaphone,
};

export default function CampaignsPage() {
  const { data: campaigns, isLoading } = useCampaigns();
  const { data: stats } = useCampaignStats();
  const createCampaign = useCreateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "Email",
    audience: "all",
    scheduledDate: "",
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name) {
      toast.error("Please enter a campaign name");
      return;
    }
    createCampaign.mutate({
      name: newCampaign.name,
      type: newCampaign.type,
      status: newCampaign.scheduledDate ? "Scheduled" : "Draft",
      audience: newCampaign.audience,
      scheduledDate: newCampaign.scheduledDate || undefined,
    });
    setIsCreateOpen(false);
    setNewCampaign({ name: "", type: "Email", audience: "all", scheduledDate: "" });
    toast.success("Campaign created successfully");
  };

  const handleDeleteCampaign = (id: string) => {
    deleteCampaign.mutate(id);
    toast.success("Campaign deleted");
  };

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
            <div className="text-2xl font-bold">{stats?.activeCampaigns || 0}</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.emailsSent?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">Total sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgOpenRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversions || 0}</div>
            <p className="text-xs text-muted-foreground">Total conversions</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Campaigns</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full py-8 text-center text-muted">Loading campaigns...</div>
          ) : campaigns && campaigns.length > 0 ? (
            campaigns.map((campaign) => {
              const Icon = typeIcons[campaign.type as CampaignType] || Megaphone;
              const formatDate = (timestamp: number) => {
                return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              };
              return (
              <Card key={String(campaign._id)} className="relative overflow-hidden">
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
                          {formatDate(campaign._creationTime)}
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
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteCampaign(String(campaign._id))}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant={getCampaignStatusVariant(campaign.status as CampaignStatus)}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="secondary">{campaign.type}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Audience:</span>
                      <span className="font-medium">{campaign.audience || "-"}</span>
                    </div>
                    {campaign.status !== "Scheduled" &&
                      campaign.status !== "Draft" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sent:</span>
                            <span className="font-medium">
                              {campaign.sent?.toLocaleString() || "0"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Opened:
                            </span>
                            <span className="font-medium">
                              {campaign.opened?.toLocaleString() || "0"} (
                              {campaign.sent && campaign.opened 
                                ? Math.round((campaign.opened / campaign.sent) * 100)
                                : 0}
                              %)
                            </span>
                          </div>
                        </>
                      )}
                  </div>
                </CardContent>
              </Card>
            );
          })
          ) : (
            <div className="col-span-full py-8 text-center text-muted">No campaigns found</div>
          )}
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
              <Input 
                placeholder="e.g. Summer Sale" 
                value={newCampaign.name}
                onChange={(e) => setNewCampaign(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Campaign Type</Label>
              <Select
                value={newCampaign.type}
                onChange={(e) => setNewCampaign(p => ({ ...p, type: e.target.value }))}
              >
                <option value="Email">Email Blast</option>
                <option value="SMS">SMS Broadcast</option>
                <option value="Social">Social Media Post</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select
                value={newCampaign.audience}
                onChange={(e) => setNewCampaign(p => ({ ...p, audience: e.target.value }))}
              >
                <option value="all">All Customers</option>
                <option value="leads">New Leads</option>
                <option value="service">Service Customers</option>
                <option value="vip">VIPs</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scheduled Date</Label>
              <Input 
                type="date" 
                value={newCampaign.scheduledDate}
                onChange={(e) => setNewCampaign(p => ({ ...p, scheduledDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
