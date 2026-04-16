"use client";

import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { GuestProfile } from "@/domain/entities";
import { parseApiError } from "@/lib/utils/api-error";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { useCallback, useState } from "react";

export function useProfile(initialProfile: GuestProfile) {
  const [profile, setProfile] = useState<GuestProfile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (updates: Partial<GuestProfile>) => {
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, string> = {};
      if (updates.firstName !== undefined || updates.lastName !== undefined) {
        const first = updates.firstName ?? profile.firstName;
        const last = updates.lastName ?? profile.lastName;
        body.name = `${first} ${last}`.trim();
      }
      if (updates.phone !== undefined) body.phone = updates.phone;
      if (updates.bio !== undefined) body.bio = updates.bio;
      if (updates.location !== undefined) body.location = updates.location;

      const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.USERS.ME), {
        method: "PATCH",
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await parseApiError(res, "Failed to update profile");
        setError(msg);
        return;
      }
      setProfile((p) => ({ ...p, ...updates }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [profile.firstName, profile.lastName]);

  return { profile, setProfile, saving, error, updateProfile };
}
