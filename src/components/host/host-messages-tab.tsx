"use client";

import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export function HostMessagesTab() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <MessageSquare className="size-8 text-slate-400" />
      </div>
      <Badge variant="outline" className="mb-3 text-slate-500 border-slate-200">
        Coming Soon
      </Badge>
      <p className="font-semibold text-slate-700 text-lg mb-1">Guest messaging</p>
      <p className="text-sm text-slate-400 max-w-xs">
        Messaging with guests will be available soon. Stay tuned for updates.
      </p>
    </div>
  );
}
