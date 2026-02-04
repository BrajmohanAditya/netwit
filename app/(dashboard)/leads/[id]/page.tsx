"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Mail } from "lucide-react";
import { useLeads } from "@/hooks/use-leads";
import { sendLeadSms } from "@/lib/actions/send-sms";
import { toast } from "react-hot-toast";

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;
  const { data: leads } = useLeads();
  const lead = leads?.find((l) => l._id === leadId);

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !leadId) return;

    setSending(true);
    try {
      await sendLeadSms(leadId, message);
      toast.success("SMS sent successfully");
      setMessage("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send SMS");
    } finally {
      setSending(false);
    }
  };

  if (!lead) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-slate-500">Lead not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {lead.name || "Lead Details"}
        </h1>
        <p className="text-slate-500 mt-1">Lead ID: {lead._id}</p>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-medium">
                    {lead.name || "No name"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{lead.email || "No email"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium">{lead.phone || "No phone"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Source</p>
                  <p className="font-medium">{lead.source || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Badge variant="secondary">{lead.status || "Unknown"}</Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Company</p>
                  <p className="font-medium">{lead.company || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Send SMS</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendSms} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full mt-1 p-3 border rounded-lg min-h-[100px]"
                    placeholder="Type your message..."
                  />
                </div>
                <Button type="submit" disabled={sending || !message.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? "Sending..." : "Send SMS"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
