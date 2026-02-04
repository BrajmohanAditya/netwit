"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useModal,
} from "@/components/ui/modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Facebook, CalendarDays } from "lucide-react";
import { useSocialPosts, useSocialStats, useCreateSocialPost } from "@/hooks/use-social-campaigns";
import { toast } from "react-hot-toast";

const scheduleDays = ["Mon", "Tue", "Wed"];
const scheduleTimes = ["9:00", "9:30", "10:00", "10:30", "11:00"];

const statusBadgeStyles: Record<string, string> = {
  Published: "bg-green-100 text-green-700",
  Scheduled: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
};

export default function SocialPostingPage() {
  const { data: posts, isLoading } = useSocialPosts();
  const { data: stats } = useSocialStats();
  const createPost = useCreateSocialPost();

  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isPostToFacebookOpen, setIsPostToFacebookOpen] = useState(false);
  const settingsModal = useModal(false);
  const [facebookConnected, setFacebookConnected] = useState(true);
  const [postFilters, setPostFilters] = useState({
    dateFrom: "",
    dateTo: "",
    platform: "",
    status: "",
  });
  const [postForm, setPostForm] = useState({
    vehicle: "",
    caption: "",
    scheduledDate: "",
  });

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post) => {
      if (postFilters.dateFrom && post.scheduledDate && post.scheduledDate < postFilters.dateFrom) return false;
      if (postFilters.dateTo && post.scheduledDate && post.scheduledDate > postFilters.dateTo) return false;
      if (postFilters.platform && post.platform !== postFilters.platform) return false;
      if (postFilters.status && post.status !== postFilters.status) return false;
      return true;
    });
  }, [posts, postFilters]);

  const handleCreatePost = () => {
    if (!postForm.vehicle || !postForm.caption) {
      toast.error("Please fill in vehicle and caption");
      return;
    }
    createPost.mutate({
      vehicleName: postForm.vehicle,
      platform: "Facebook",
      status: postForm.scheduledDate ? "Scheduled" : "Published",
      caption: postForm.caption,
      scheduledDate: postForm.scheduledDate || undefined,
    });
    setIsPostToFacebookOpen(false);
    setPostForm({ vehicle: "", caption: "", scheduledDate: "" });
    toast.success("Post created successfully");
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-heading">Social Posting</h1>
          <p className="text-sm text-muted">
            Manage Facebook scheduling, vehicle posts, and engagement tracking.
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setIsCreateEventOpen(true)}
        >
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border border-gray-200 bg-white lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Facebook Integration</CardTitle>
              <p className="text-sm text-muted mt-1">
                Weekly schedule overview
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <CalendarDays className="h-4 w-4" />
              <span>Weekly schedule</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                <div className="grid grid-cols-[90px_repeat(3,minmax(120px,1fr))] gap-px rounded-lg border border-gray-200 bg-gray-100 text-sm">
                  <div className="bg-white p-3 text-xs font-semibold uppercase text-muted" />
                  {scheduleDays.map((day) => (
                    <div
                      key={day}
                      className="bg-white p-3 text-xs font-semibold uppercase text-muted"
                    >
                      {day}
                    </div>
                  ))}

                  {scheduleTimes.map((time) => (
                    <>
                      <div
                        key={`${time}-label`}
                        className="bg-white p-3 text-xs font-semibold text-gray-500"
                      >
                        {time}
                      </div>
                      {scheduleDays.map((day) => (
                        <div key={`${day}-${time}`} className="bg-white p-2" />
                      ))}
                    </>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-600" />
                Facebook Account
              </CardTitle>
              {facebookConnected ? (
                <Badge className="bg-green-100 text-green-700">Connected</Badge>
              ) : (
                <Badge variant="secondary">Not Connected</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {facebookConnected ? (
                <>
                  <div>
                    <p className="text-sm text-muted">Page</p>
                    <p className="text-base font-semibold">Brown Boys Auto</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Last Post</p>
                    <p className="text-base font-semibold">2 hours ago</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={settingsModal.open}>
                      Settings
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFacebookConnected(false)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted">
                    Connect your Facebook Business Account to post vehicles automatically.
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setFacebookConnected(true)}
                  >
                    Connect Facebook
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Social Post Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Total Posts</span>
                <span className="font-semibold text-gray-900">{stats?.totalPosts || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Avg Likes</span>
                <span className="font-semibold text-gray-900">{stats?.avgLikes || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Avg Shares</span>
                <span className="font-semibold text-gray-900">{stats?.avgShares || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border border-gray-200 bg-white">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base">Social Posts</CardTitle>
            <p className="text-sm text-muted mt-1">
              Track recent Facebook postings and engagement.
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsPostToFacebookOpen(true)}
          >
            Post to Facebook
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Date From
              </label>
              <Input
                type="date"
                className="mt-1"
                value={postFilters.dateFrom}
                onChange={(event) =>
                  setPostFilters((prev) => ({
                    ...prev,
                    dateFrom: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Date To
              </label>
              <Input
                type="date"
                className="mt-1"
                value={postFilters.dateTo}
                onChange={(event) =>
                  setPostFilters((prev) => ({
                    ...prev,
                    dateTo: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Platform
              </label>
              <Select
                className="mt-1"
                value={postFilters.platform}
                onChange={(event) =>
                  setPostFilters((prev) => ({
                    ...prev,
                    platform: event.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="Facebook">Facebook</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Status
              </label>
              <Select
                className="mt-1"
                value={postFilters.status}
                onChange={(event) =>
                  setPostFilters((prev) => ({
                    ...prev,
                    status: event.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="Published">Published</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Failed">Failed</option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-gray-200">
                  <th className="py-3 pr-4">Date Posted</th>
                  <th className="py-3 pr-4">Vehicle</th>
                  <th className="py-3 pr-4">Platform</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Engagement</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted">
                      Loading posts...
                    </td>
                  </tr>
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted">
                      No posts found
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={String(post._id)} className="border-b border-gray-100">
                      <td className="py-3 pr-4 text-gray-700">{formatDate(post.scheduledDate)}</td>
                      <td className="py-3 pr-4 font-medium text-heading">
                        {post.vehicleName || "-"}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{post.platform}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusBadgeStyles[post.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {post.engagement
                          ? `${post.engagement.likes} / ${post.engagement.shares} / ${post.engagement.comments}`
                          : "-"}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3 text-xs">
                          <button className="text-blue-600 hover:text-blue-700">View</button>
                          <button className="text-blue-600 hover:text-blue-700">Edit</button>
                          <button className="text-red-600 hover:text-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPostToFacebookOpen} onOpenChange={setIsPostToFacebookOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post to Facebook</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Vehicle
              </Label>
              <Input
                value={postForm.vehicle}
                onChange={(e) => setPostForm(p => ({ ...p, vehicle: e.target.value }))}
                placeholder="Search vehicle..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Caption
              </Label>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={4}
                placeholder="Write your caption..."
                value={postForm.caption}
                onChange={(e) => setPostForm(p => ({ ...p, caption: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Schedule
              </Label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="schedule" defaultChecked /> Post Now
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="schedule"
                      onChange={(e) => e.target.checked && setPostForm(p => ({ ...p, scheduledDate: "scheduled" }))}
                    /> Schedule
                  </label>
                  <Input
                    type="datetime-local"
                    className="w-auto"
                    value={postForm.scheduledDate}
                    onChange={(e) => setPostForm(p => ({ ...p, scheduledDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPostToFacebookOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreatePost}>
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Modal isOpen={settingsModal.isOpen} onClose={settingsModal.close}>
        <ModalHeader title="Facebook Settings" />
        <ModalBody className="space-y-5">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <Checkbox defaultChecked /> Auto-Post New Vehicles
          </label>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Description Template
            </p>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="radio" name="template" defaultChecked /> Dealer + Default
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="radio" name="template" /> Dealer Only
            </label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={settingsModal.close}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={settingsModal.close}>Save</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
