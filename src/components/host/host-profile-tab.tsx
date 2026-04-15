"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import { getCookie } from "@/lib/utils/cookies";
import { useState } from "react";

interface HostProfileTabProps {
  currentUserId: string;
  currentUserName: string;
  currentUserEmail: string;
  currentUserAvatar?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function HostProfileTab({
  currentUserName,
  currentUserEmail,
  currentUserAvatar,
}: HostProfileTabProps) {
  const nameParts = currentUserName.split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" "));
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = getCookie("auth_token");
      const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.USERS.PROFILE), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md space-y-6">
      {/* Avatar + display */}
      <div className="flex items-center gap-4">
        <Avatar className="size-16 ring-4 ring-white shadow-md">
          <AvatarImage src={currentUserAvatar} alt={currentUserName} />
          <AvatarFallback className="bg-rose-100 text-rose-600 text-lg font-bold">
            {getInitials(currentUserName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-slate-900">{currentUserName}</p>
          <p className="text-sm text-slate-500">{currentUserEmail}</p>
        </div>
      </div>

      {/* Edit form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">First name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Last name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {message && (
          <p className={`text-sm font-medium ${message.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
            {message.text}
          </p>
        )}

        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-sm"
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
