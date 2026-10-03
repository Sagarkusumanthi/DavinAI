"use client";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { formatINR } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/services/orderStateMachine";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/dashboard")
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).message ?? "Could not load dashboard.");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }

  useEffect(load, []);

  if (error) {
    return (
      <AdminShell>
        <ErrorState message={error} onRetry={load} />
      </AdminShell>
    );
  }

  if (!data) {
    return (
      <AdminShell>
        <LoadingSkeleton className="h-40 w-full" />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <h1 className="mb-4 font-serif text-xl font-semibold text-ink">Admin dashboard</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-xs text-muted">Total stores</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{data.totalStores}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted">Total products</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{data.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted">Total orders</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{data.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted">Mock delivered value</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{formatINR(data.mockDeliveredValue)}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-2 mt-6 text-sm font-semibold text-ink">Orders by status</h2>
      <div className="flex flex-wrap gap-2">
        {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
          <div key={key} className="rounded-xl bg-white px-3 py-2 text-sm shadow-sm">
            {label}: <span className="font-semibold">{data.statusCounts[key] ?? 0}</span>
          </div>
        ))}
      </div>

      <h2 className="mb-2 mt-6 text-sm font-semibold text-ink">Recent order activity</h2>
      <div className="space-y-2">
        {data.recentOrders.map((o: any) => (
          <div key={o.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
            <div>
              <p className="text-sm font-medium text-ink">{o.orderCode}</p>
              <p className="text-xs text-muted">
                {o.store.name} · {o.city.name}
              </p>
            </div>
            <StatusBadge status={o.status} />
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
