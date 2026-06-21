"use client";

import { EditProfileDialog } from "@/components/account/edit-profile-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GuestProfile } from "@/domain/entities";
import { useProfile } from "@/domain/hooks/dashboard/use-profile";
import { format, parseISO } from "date-fns";
import { Calendar, Camera, Edit3, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
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
      <h1 className="text-2xl font-bold text-foreground mb-6">Profile</h1>

      {/* Identity */}
      <Card className="rounded-2xl border-border shadow-none mb-6 overflow-hidden">
        <div className="h-20 bg-linear-to-r from-primary to-primary-dark" />
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div className="relative shrink-0">
              <Avatar className="size-20 ring-4 ring-card shadow-md">
                <AvatarImage
                  src={profile.avatarUrl ?? undefined}
                  alt={fullName}
                />
                <AvatarFallback className="bg-primary-subtle text-primary text-xl font-bold">
                  {getInitials(profile.firstName, profile.lastName)}
                </AvatarFallback>
              </Avatar>
              <button
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 size-7 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Camera className="size-3.5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 min-w-0 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">
                  {fullName}
                </h2>
                {profile.isVerified && (
                  <Badge
                    variant="outline"
                    className="gap-1 text-primary border-primary/20 bg-primary/5 text-xs font-semibold"
                  >
                    <ShieldCheck className="size-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
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
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-lg sm:pb-1 self-start sm:self-end"
              onClick={() => setEditOpen(true)}
            >
              <Edit3 className="size-3.5" />
              Edit
            </Button>
          </div>

          {profile.bio && (
            <p className="text-sm leading-relaxed text-foreground/80 mt-4 pt-4 border-t border-border">
              {profile.bio}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="rounded-2xl border-border shadow-none">
        <CardHeader className="pb-0">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Contact Info
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 divide-y divide-border">
          <div className="flex items-center gap-3 pb-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
              <Mail className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-subtle">Email</p>
              <p className="text-sm font-medium text-foreground truncate">
                {profile.email}
              </p>
            </div>
          </div>
          {profile.phone && (
            <div className="flex items-center gap-3 pt-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                <Phone className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-subtle">Phone</p>
                <p className="text-sm font-medium text-foreground truncate">
                  {profile.phone}
                </p>
              </div>
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
