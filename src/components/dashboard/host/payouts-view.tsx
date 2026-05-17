"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils/currency";
import { useHostPayouts } from "@/domain/hooks/dashboard/use-host-payouts";
import { format, parseISO } from "date-fns";
import { CreditCard } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-600 border-red-200",
};

export function PayoutsView() {
  const { payouts, upcoming, loading, total } = useHostPayouts();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-slate-100 rounded-lg" />
            <div className="h-4 w-48 bg-slate-100 rounded" />
            <div className="h-28 bg-white rounded-2xl border border-slate-100" />
            <div className="h-48 bg-white rounded-2xl border border-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payouts</h1>
        <p className="text-sm text-slate-500 mt-1">Track your earnings and payment history</p>
      </div>

      {/* Upcoming payout card */}
      {upcoming ? (
        <Card className="rounded-2xl border-slate-100 shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <CreditCard className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Next payout</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(upcoming.amount, upcoming.currency, 2)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scheduled{" "}
                  {format(parseISO(upcoming.scheduledDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-slate-100 shadow-none">
          <CardContent className="pt-6 text-center py-8">
            <CreditCard className="size-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm text-slate-500">No upcoming payouts</p>
          </CardContent>
        </Card>
      )}

      {/* Payout history */}
      <Card className="rounded-2xl border-slate-100 shadow-none">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Payout History
            {total > 0 && (
              <span className="ml-2 text-slate-400 normal-case font-normal">
                ({total})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {payouts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              No payout history yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="text-sm text-slate-700">
                      {format(parseISO(payout.scheduledDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-slate-800">
                      {formatCurrency(payout.amount, payout.currency, 2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STATUS_STYLES[payout.status] ?? ""}`}
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {payout.paidAt
                        ? format(parseISO(payout.paidAt), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
