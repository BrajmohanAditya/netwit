"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    avatar: "",
    username: "",
    firstName: "",
    lastName: "",
    gender: "Male",
    birthdate: "",
    email: "",
    mobile: "",
    fax: "",
    street: "",
    apt: "",
    postal: "",
    city: "",
    province: "",
    country: "",
    licenseNumber: "",
    licenseIssued: "",
    licenseExpires: "",
    licenseFront: "",
    licenseBack: "",
    signature: "",
  });

  return (
    <div className="flex-1 space-y-6 px-4 py-6 sm:px-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Profile</h1>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="profile-avatar">Avatar Upload</Label>
              <Input
                id="profile-avatar"
                type="file"
                className="cursor-pointer"
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    avatar: event.target.files?.[0]?.name ?? "",
                  }))
                }
              />
              <div className="text-xs text-muted-foreground">
                Click to change photo
              </div>
            </div>

            <div className="grid gap-4">
              <div className="text-sm font-semibold text-muted-foreground">
                Personal Information
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="profile-username">Username</Label>
                  <Input
                    id="profile-username"
                    value={profile.username}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        username: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-first">First Name</Label>
                  <Input
                    id="profile-first"
                    value={profile.firstName}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        firstName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-last">Last Name</Label>
                  <Input
                    id="profile-last"
                    value={profile.lastName}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        lastName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-gender">Gender</Label>
                  <Select
                    value={profile.gender}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-birthdate">Birthdate</Label>
                  <Input
                    id="profile-birthdate"
                    type="date"
                    value={profile.birthdate}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        birthdate: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="text-sm font-semibold text-muted-foreground">
                Contact
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={profile.email}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-mobile">Mobile</Label>
                  <Input
                    id="profile-mobile"
                    type="tel"
                    value={profile.mobile}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        mobile: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-fax">Fax</Label>
                  <Input
                    id="profile-fax"
                    type="tel"
                    value={profile.fax}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        fax: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="text-sm font-semibold text-muted-foreground">
                Address
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="profile-street">Street</Label>
                  <Input
                    id="profile-street"
                    value={profile.street}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        street: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-apt">Apt</Label>
                  <Input
                    id="profile-apt"
                    value={profile.apt}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        apt: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-postal">Postal</Label>
                  <Input
                    id="profile-postal"
                    value={profile.postal}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        postal: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-city">City</Label>
                  <Input
                    id="profile-city"
                    value={profile.city}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        city: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-province">Province</Label>
                  <Input
                    id="profile-province"
                    value={profile.province}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        province: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-country">Country</Label>
                  <Input
                    id="profile-country"
                    value={profile.country}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        country: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="text-sm font-semibold text-muted-foreground">
                Driver License
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="profile-license-number">Number</Label>
                  <Input
                    id="profile-license-number"
                    value={profile.licenseNumber}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        licenseNumber: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-license-issued">Issued</Label>
                  <Input
                    id="profile-license-issued"
                    type="date"
                    value={profile.licenseIssued}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        licenseIssued: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-license-expires">Expires</Label>
                  <Input
                    id="profile-license-expires"
                    type="date"
                    value={profile.licenseExpires}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        licenseExpires: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="profile-license-front">Upload Front</Label>
                  <Input
                    id="profile-license-front"
                    type="file"
                    className="cursor-pointer"
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        licenseFront: event.target.files?.[0]?.name ?? "",
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-license-back">Upload Back</Label>
                  <Input
                    id="profile-license-back"
                    type="file"
                    className="cursor-pointer"
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        licenseBack: event.target.files?.[0]?.name ?? "",
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="text-sm font-semibold text-muted-foreground">
                Signature
              </div>
              <Input
                placeholder="Upload or Draw"
                value={profile.signature}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    signature: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-4">
              <div className="text-sm font-semibold text-muted-foreground">
                Password
              </div>
              <div>
                <Button variant="secondary" size="sm">
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="primary" className="w-full sm:w-auto">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
