"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditProfileDialog } from "@/components/account/edit-profile-modal";
import type { GuestProfile } from "@/domain/entities";
import { useProfile } from "@/domain/hooks/dashboard/use-profile";
import { format, parseISO } from "date-fns";
import { Calendar, Camera, Edit3, MapPin, ShieldCheck } from "lucide-react";
import { useState } from "react";

function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export function ProfileView({
  profile: initialProfile,
}: {
  profile: GuestProfile;
}) {
  const { profile, setProfile } = useProfile(initialProfile);
  const [editOpen, setEditOpen] = useState(false);
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile</h1>

      <Card className="rounded-2xl border-slate-100 shadow-none mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar className="size-20 ring-4 ring-white shadow-md">
                <AvatarImage
                  src={profile.avatarUrl ?? undefined}
                  alt={fullName}
                />
                <AvatarFallback className="bg-rose-100 text-rose-600 text-xl font-bold">
                  {getInitials(profile.firstName, profile.lastName)}
                </AvatarFallback>
              </Avatar>
              <button
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 size-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <Camera className="size-3.5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
                {profile.isVerified && (
                  <Badge
                    variant="outline"
                    className="gap-1 text-emerald-700 border-emerald-200 bg-emerald-50 text-xs font-semibold"
                  >
                    <ShieldCheck className="size-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-2">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  Member since{" "}
                  {format(parseISO(profile.memberSince), "MMMM yyyy")}
                </span>
              </div>
              {profile.bio && (
                <p className="text-sm text-slate-600">{profile.bio}</p>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-lg border-slate-200"
              onClick={() => setEditOpen(true)}
            >
              <Edit3 className="size-3.5" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-100 shadow-none">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Contact Info
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div>
            <p className="text-xs text-slate-400">Email</p>
            <p className="text-sm font-medium text-slate-800">
              {profile.email}
            </p>
          </div>
          {profile.phone && (
            <div>
              <p className="text-xs text-slate-400">Phone</p>
              <p className="text-sm font-medium text-slate-800">
                {profile.phone}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {editOpen && (
        <EditProfileDialog
          profile={profile}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSave={(updates) => setProfile((p) => ({ ...p, ...updates }))}
        />
      )}
    </div>
  );
}
