"use client";

import { useState } from "react";
import { Plus, Trash2, Facebook, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface FixedCost {
  id: string;
  name: string;
  price: string;
  tax: boolean;
}

export default function BusinessProfilePage() {
  // Business Profile State
  const [logo, setLogo] = useState("");
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    website: "",
    license: "",
    gst: "",
    pst: "",
  });
  const [contact, setContact] = useState({
    phone: "",
    fax: "",
    email: "",
  });
  const [address, setAddress] = useState({
    street: "",
    city: "",
    province: "",
    postal: "",
    country: "",
  });
  const [owner, setOwner] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [defaults, setDefaults] = useState({
    downPayment: "0",
    duration: "60",
    salesTax: "12",
    interestRate: "5.99",
    frequency: "Monthly",
  });
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([
    { id: "1", name: "Detailing", price: "150", tax: true },
  ]);

  const addFixedCost = () => {
    setFixedCosts([
      ...fixedCosts,
      { id: Math.random().toString(), name: "", price: "", tax: false },
    ]);
  };

  const removeFixedCost = (id: string) => {
    setFixedCosts(fixedCosts.filter((cost) => cost.id !== id));
  };

  const updateFixedCost = (
    id: string,
    field: keyof FixedCost,
    value: string | boolean,
  ) => {
    setFixedCosts(
      fixedCosts.map((cost) =>
        cost.id === id ? { ...cost, [field]: value } : cost,
      ),
    );
  };

  // Integrations State
  const [integrations, setIntegrations] = useState({
    facebook: true,
    email: false,
    sms: false,
  });

  return (
    <div className="flex-1 space-y-6 px-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Business Profile</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile & Settings</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Business Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    className="max-w-xs cursor-pointer"
                    onChange={(e) => setLogo(e.target.files?.[0]?.name || "")}
                  />
                  {logo && (
                    <span className="text-sm text-green-600">
                      Selected: {logo}
                    </span>
                  )}
                </div>
              </div>

              {/* Business Information */}
              <div className="grid gap-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Business Information
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="biz-name">Name</Label>
                    <Input
                      id="biz-name"
                      value={businessInfo.name}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="biz-website">Website</Label>
                    <Input
                      id="biz-website"
                      value={businessInfo.website}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          website: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="biz-license">Dealer License</Label>
                    <Input
                      id="biz-license"
                      value={businessInfo.license}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          license: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="biz-gst">GST #</Label>
                      <Input
                        id="biz-gst"
                        value={businessInfo.gst}
                        onChange={(e) =>
                          setBusinessInfo({
                            ...businessInfo,
                            gst: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="biz-pst">PST #</Label>
                      <Input
                        id="biz-pst"
                        value={businessInfo.pst}
                        onChange={(e) =>
                          setBusinessInfo({
                            ...businessInfo,
                            pst: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="grid gap-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      value={contact.phone}
                      onChange={(e) =>
                        setContact({ ...contact, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact-fax">Fax</Label>
                    <Input
                      id="contact-fax"
                      value={contact.fax}
                      onChange={(e) =>
                        setContact({ ...contact, fax: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      value={contact.email}
                      onChange={(e) =>
                        setContact({ ...contact, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="grid gap-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Address
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="addr-street">Street</Label>
                    <Input
                      id="addr-street"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="addr-city">City</Label>
                    <Input
                      id="addr-city"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="addr-province">Province</Label>
                    <Input
                      id="addr-province"
                      value={address.province}
                      onChange={(e) =>
                        setAddress({ ...address, province: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="addr-postal">Postal</Label>
                    <Input
                      id="addr-postal"
                      value={address.postal}
                      onChange={(e) =>
                        setAddress({ ...address, postal: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="addr-country">Country</Label>
                    <Input
                      id="addr-country"
                      value={address.country}
                      onChange={(e) =>
                        setAddress({ ...address, country: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Owner */}
              <div className="grid gap-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Owner
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="owner-first">First Name</Label>
                    <Input
                      id="owner-first"
                      value={owner.firstName}
                      onChange={(e) =>
                        setOwner({ ...owner, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="owner-last">Last Name</Label>
                    <Input
                      id="owner-last"
                      value={owner.lastName}
                      onChange={(e) =>
                        setOwner({ ...owner, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="owner-phone">Phone</Label>
                    <Input
                      id="owner-phone"
                      value={owner.phone}
                      onChange={(e) =>
                        setOwner({ ...owner, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="owner-email">Email</Label>
                    <Input
                      id="owner-email"
                      value={owner.email}
                      onChange={(e) =>
                        setOwner({ ...owner, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Payment Calculator Defaults */}
              <div className="grid gap-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Payment Calculator Defaults
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="grid gap-2">
                    <Label htmlFor="def-down">Down Payment (%)</Label>
                    <Input
                      id="def-down"
                      value={defaults.downPayment}
                      onChange={(e) =>
                        setDefaults({
                          ...defaults,
                          downPayment: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="def-duration">Loan Duration (months)</Label>
                    <Input
                      id="def-duration"
                      value={defaults.duration}
                      onChange={(e) =>
                        setDefaults({ ...defaults, duration: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="def-tax">Sales Tax (%)</Label>
                    <Input
                      id="def-tax"
                      value={defaults.salesTax}
                      onChange={(e) =>
                        setDefaults({ ...defaults, salesTax: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="def-rate">Interest Rate (%)</Label>
                    <Input
                      id="def-rate"
                      value={defaults.interestRate}
                      onChange={(e) =>
                        setDefaults({
                          ...defaults,
                          interestRate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Frequency</Label>
                  <div className="flex gap-4">
                    {["Monthly", "Bi-weekly", "Weekly"].map((freq) => (
                      <label
                        key={freq}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={freq}
                          checked={defaults.frequency === freq}
                          onChange={(e) =>
                            setDefaults({
                              ...defaults,
                              frequency: e.target.value,
                            })
                          }
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium">{freq}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vehicle Fixed Costs */}
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Vehicle Fixed Costs
                  </div>
                  <Button variant="outline" size="sm" onClick={addFixedCost}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Cost
                  </Button>
                </div>
                <div className="space-y-3">
                  {fixedCosts.map((cost) => (
                    <div
                      key={cost.id}
                      className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-gray-50/50 p-3 rounded-md border"
                    >
                      <div className="grid gap-1.5 flex-1 w-full">
                        <Label className="text-xs">Name</Label>
                        <Input
                          placeholder="Cost Name"
                          value={cost.name}
                          onChange={(e) =>
                            updateFixedCost(cost.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-1.5 w-full sm:w-32">
                        <Label className="text-xs">Price ($)</Label>
                        <Input
                          placeholder="0.00"
                          value={cost.price}
                          onChange={(e) =>
                            updateFixedCost(cost.id, "price", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2 h-10 pb-1">
                        <Checkbox
                          id={`tax-${cost.id}`}
                          checked={cost.tax}
                          onChange={(e) =>
                            updateFixedCost(cost.id, "tax", e.target.checked)
                          }
                        />
                        <Label
                          htmlFor={`tax-${cost.id}`}
                          className="cursor-pointer"
                        >
                          Tax
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-destructive hover:text-destructive/90"
                        onClick={() => removeFixedCost(cost.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {fixedCosts.length === 0 && (
                    <div className="text-sm text-muted text-center py-4 border border-dashed rounded-md">
                      No fixed costs added.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button variant="primary">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          {/* Facebook Business */}
          <Card>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Facebook className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Facebook Business</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {integrations.facebook ? (
                      <>
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        <span className="text-sm text-muted-foreground">
                          Connected
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                        <span className="text-sm text-muted-foreground">
                          Not Connected
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {integrations.facebook ? (
                  <>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      Settings
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 sm:flex-none"
                      onClick={() =>
                        setIntegrations({ ...integrations, facebook: false })
                      }
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      setIntegrations({ ...integrations, facebook: true })
                    }
                  >
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Email (SMTP) */}
          <Card>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email (SMTP)</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {integrations.email ? (
                      <>
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        <span className="text-sm text-muted-foreground">
                          Connected
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                        <span className="text-sm text-muted-foreground">
                          Not Connected
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SMS (Twilio) */}
          <Card>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">SMS (Twilio)</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {integrations.sms ? (
                      <>
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        <span className="text-sm text-muted-foreground">
                          Connected
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                        <span className="text-sm text-muted-foreground">
                          Not Connected
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
