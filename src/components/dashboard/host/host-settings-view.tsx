"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUseCase } from "@/domain/di";
import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { COOKIE_KEYS, getCookie } from "@/lib/utils/cookies";
import type { User } from "@/domain/entities";

function SettingsRow({
  icon: Icon,
  label,
  description,
  action,
  destructive = false,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  action?: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div
        className={cn(
          "size-9 rounded-xl flex items-center justify-center shrink-0",
          destructive ? "bg-red-50" : "bg-slate-50",
        )}
      >
        <Icon
          className={cn(
            "size-4",
            destructive ? "text-red-500" : "text-slate-500",
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold",
            destructive ? "text-red-600" : "text-slate-800",
          )}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      {action ?? <ChevronRight className="size-4 text-slate-300 shrink-0" />}
    </div>
  );
}

export function HostSettingsView() {
  const raw = getCookie(COOKIE_KEYS.AUTH_USER);
  let email = "";
  if (raw) {
    try {
      email = (JSON.parse(raw) as User).email ?? "";
    } catch {
      // ignore
    }
  }

  const handleSignOut = async () => {
    await getAuthUseCase().logout();
    window.location.href = "/";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

      <div className="space-y-4">
        <Card className="rounded-2xl border-slate-100 shadow-none">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-50 px-6">
            <SettingsRow
              icon={Mail}
              label="Email address"
              description={email}
            />
            <SettingsRow
              icon={Lock}
              label="Password"
              description="Update your password"
            />
            <SettingsRow
              icon={ShieldCheck}
              label="Two-factor authentication"
              description="Add an extra layer of security"
              action={
                <Badge variant="outline" className="text-slate-400 text-xs">
                  Off
                </Badge>
              }
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-none">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-50 px-6">
            <SettingsRow
              icon={Bell}
              label="Notifications"
              description="Email and push notification settings"
            />
            <SettingsRow
              icon={Globe}
              label="Language & region"
              description="English (US) · USD"
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-none">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-50 px-6">
            <SettingsRow icon={HelpCircle} label="Help centre" />
            <SettingsRow
              icon={LogOut}
              label="Sign out"
              destructive
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
