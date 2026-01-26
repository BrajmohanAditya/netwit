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

const scheduleDays = ["Mon", "Tue", "Wed"];
const scheduleTimes = ["9:00", "9:30", "10:00", "10:30", "11:00"];

const scheduleEvents = [
  {
    id: "evt-1",
    day: "Tue",
    time: "9:30",
    title: "Test Drive",
    type: "Test Drive",
  },
  {
    id: "evt-2",
    day: "Tue",
    time: "10:00",
    title: "Drive",
    type: "Test Drive",
  },
  {
    id: "evt-3",
    day: "Wed",
    time: "10:00",
    title: "Appt",
    type: "Appointment",
  },
  {
    id: "evt-4",
    day: "Wed",
    time: "10:30",
    title: "Follow up",
    type: "Follow-up",
  },
  {
    id: "evt-5",
    day: "Wed",
    time: "11:00",
    title: "Follow up",
    type: "Follow-up",
  },
];

const socialPosts = [
  {
    id: "post-1",
    date: "2026-01-24",
    vehicle: "2021 Ford Mustang",
    platform: "Facebook",
    status: "Published",
    engagement: "34 / 6 / 4",
  },
  {
    id: "post-2",
    date: "2026-01-22",
    vehicle: "2020 Honda Civic LX",
    platform: "Facebook",
    status: "Scheduled",
    engagement: "-",
  },
  {
    id: "post-3",
    date: "2026-01-19",
    vehicle: "2019 Toyota RAV4",
    platform: "Facebook",
    status: "Failed",
    engagement: "12 / 2 / 1",
  },
];

const statusBadgeStyles: Record<string, string> = {
  Published: "bg-green-100 text-green-700",
  Scheduled: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
};

export default function SocialPostingPage() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isPostToFacebookOpen, setIsPostToFacebookOpen] = useState(false);
  const settingsModal = useModal(false);
  // const postModal = useModal(false);
  const [facebookConnected, setFacebookConnected] = useState(true);
  const [postFilters, setPostFilters] = useState({
    dateFrom: "",
    dateTo: "",
    platform: "",
    status: "",
  });

  const filteredPosts = useMemo(() => {
    return socialPosts.filter((post) => {
      if (postFilters.dateFrom && post.date < postFilters.dateFrom) {
        return false;
      }
      if (postFilters.dateTo && post.date > postFilters.dateTo) {
        return false;
      }
      if (postFilters.platform && post.platform !== postFilters.platform) {
        return false;
      }
      if (postFilters.status && post.status !== postFilters.status) {
        return false;
      }
      return true;
    });
  }, [postFilters]);

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
                Drag events to reschedule across the weekly grid.
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
                      {scheduleDays.map((day) => {
                        const event = scheduleEvents.find(
                          (item) => item.day === day && item.time === time,
                        );
                        return (
                          <div key={`${day}-${time}`} className="bg-white p-2">
                            {event && (
                              <div
                                draggable
                                className="cursor-move rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700"
                              >
                                {event.title}
                              </div>
                            )}
                          </div>
                        );
                      })}
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
                <Badge variant="gray">Not Connected</Badge>
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
                    Connect your Facebook Business Account to post vehicles
                    automatically.
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
                <span className="font-semibold text-gray-900">45</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Avg Likes</span>
                <span className="font-semibold text-gray-900">23</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Avg Shares</span>
                <span className="font-semibold text-gray-900">5</span>
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
          </Button>>
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
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 text-gray-700">{post.date}</td>
                    <td className="py-3 pr-4 font-medium text-heading">
                      {post.vehicle}
                    </td>
                    <td className="py-3 pr-4 text-gray-700">{post.platform}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusBadgeStyles[post.status]
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-700">
                      {post.engagement}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3 text-xs">
                        <button className="text-blue-600 hover:text-blue-700">
                          View
                        </button>
                        <button className="text-blue-600 hover:text-blue-700">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPosts.length === 0 && (
              <div className="py-10 text-center text-sm text-muted">
                No posts match the selected filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Schedule a new event, test drive, or appointment type.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted">Type</Label>
              <div className="flex flex-wrap gap-4">
                {["Test Drive", "Appointment", "Follow-up", "Delivery"].map(
                  (type) => (
                    <label key={type} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="radio"
                        name="eventType"
                        defaultChecked={type === "Test Drive"}
                        className="accent-blue-600 h-4 w-4"
                      />
                      {type}
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-muted">Title</Label>
                <Input id="title" placeholder="Event title" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="customer" className="text-xs font-semibold uppercase tracking-wide text-muted">Customer</Label>
                <Input id="customer" placeholder="Search customer" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="vehicle" className="text-xs font-semibold uppercase tracking-wide text-muted">Vehicle</Label>
                <Input id="vehicle" placeholder="Search vehicle" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="date" className="text-xs font-semibold uppercase tracking-wide text-muted">Date</Label>
                <Input id="date" type="date" className="mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                   <Label htmlFor="start" className="text-xs font-semibold uppercase tracking-wide text-muted">Start</Label>
                   <Input id="start" type="time" className="mt-1" />
                </div>
                <div>
                   <Label htmlFor="end" className="text-xs font-semibold uppercase tracking-wide text-muted">End</Label>
                   <Input id="end" type="time" className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="duration" className="text-xs font-semibold uppercase tracking-wide text-muted">Duration</Label>
                <Input id="duration" value="1 hour" disabled className="mt-1 bg-gray-50" />
              </div>

              <div>
                <Label htmlFor="location" className="text-xs font-semibold uppercase tracking-wide text-muted">Location</Label>
                <Input id="location" placeholder="Location" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="assigned" className="text-xs font-semibold uppercase tracking-wide text-muted">Assigned To</Label>
                <Select className="mt-1">
                  <option value="">Select staff</option>
                  <option value="Agam">Agam</option>
                  <option value="Ava Carter">Ava Carter</option>
                  <option value="Noah Reed">Noah Reed</option>
                </Select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-muted">Description</Label>
                <textarea
                  id="description"
                  className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                  placeholder="Add details"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                 <Label className="text-xs font-semibold uppercase tracking-wide text-muted">Reminders</Label>
                 <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <Checkbox defaultChecked /> Email 24h before
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <Checkbox defaultChecked /> SMS 2h before
                    </label>
                 </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsCreateEventOpen(false)}
            >
              Create
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
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <Checkbox /> Schedule Posts
          </label>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Description Template
            </p>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="radio" name="template" defaultChecked /> Dealer +
              Default
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="radio" name="template" /> Dealer Only
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="radio" name="template" /> Default Only
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Include
            </p>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Checkbox defaultChecked /> Price
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Checkbox defaultChecked /> Specifications
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Checkbox defaultChecked /> All Images
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Checkbox defaultChecked /> Contact Info
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">
              Post Time
            </label>
            <Select className="mt-1">
              <option value="9:00 AM">9:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="1:00 PM">1:00 PM</option>
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={settingsModal.close}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={settingsModal.close}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>

      <Dialog open={isPostToFacebookOpen} onOpenChange={setIsPostToFacebookOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Post to Facebook</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
             {/* Vehicle Section */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted">Vehicle</Label>
                <div className="text-base font-semibold text-gray-900">2021 Ford Mustang</div>
                <div className="mt-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-muted">
                  [Preview]
                </div>
             </div>

             {/* Caption Section */}
             <div className="space-y-2">
                <Label htmlFor="caption" className="text-xs font-semibold uppercase tracking-wide text-muted">Caption</Label>
                <textarea
                  id="caption"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={4}
                  placeholder="Edit text..."
                />
             </div>

             {/* Images Section */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted">Images</Label>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>5 selected</span>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-transparent p-0 h-auto text-xs font-semibold">
                    Select Different
                  </Button>
                </div>
             </div>
             
             {/* Post To Section */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted">Post To</Label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox defaultChecked /> Facebook Page
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox defaultChecked /> Facebook Marketplace
                  </label>
                </div>
             </div>

             {/* Schedule Section */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted">Schedule</Label>
                 <div className="flex flex-col gap-2">
                     <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="schedule" defaultChecked className="accent-blue-600 h-4 w-4"/> Post Now
                     </label>
                     <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                           <input type="radio" name="schedule" className="accent-blue-600 h-4 w-4"/> Schedule
                        </label>
                        <Input type="datetime-local" className="w-auto" />
                     </div>
                 </div>
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPostToFacebookOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsPostToFacebookOpen(false)}
            >
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
