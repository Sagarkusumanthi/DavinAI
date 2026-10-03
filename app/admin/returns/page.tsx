"use client";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { ProgressBar, Sparkline, dailyBuckets } from "@/components/Charts";

type Returns = {
  totalOrders: number;
  rejectedCount: number;
  rejectedDates: string[];
  reasons: { reason: string; count: number }[];
  stores: { name: string; total: number; count: number; pct: number }[];
};

export default function AdminReturnsPage() {
  const [data, setData] = useState<Returns | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/returns")
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).message ?? "Could not load analytics.");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e) => setError(e.message));
  }

  useEffect(load, []);

  if (error && !data) {
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

  const returnRate = data.totalOrders ? ((data.rejectedCount / data.totalOrders) * 100).toFixed(1) : "0.0";
  const maxReason = Math.max(1, ...data.reasons.map((r) => r.count));
  const topStores = data.stores.slice(0, 6);
  const maxStorePct = Math.max(1, ...topStores.map((s) => s.pct));
  const worst = data.stores.find((s) => s.count > 0);
  const busiest = [...data.stores].sort((a, b) => b.total - a.total)[0];

  return (
    <AdminShell>
      <h1 className="mb-4 font-serif text-xl font-semibold text-ink">Returns &amp; analytics</h1>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent>
            <p className="text-xs text-muted">Return rate (all time)</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{returnRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted">Rejected orders</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{data.rejectedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-3">
        <CardContent>
          <p className="mb-1 text-sm font-semibold text-ink">Rejections trend (last 7 days)</p>
          <Sparkline values={dailyBuckets(data.rejectedDates, (d) => d, 7)} color="#E24B4A" />
          <p className="mt-1 text-[10px] text-muted">Real rejected-order volume from your platform data</p>
        </CardContent>
      </Card>

      <Card className="mt-3">
        <CardContent>
          <p className="mb-3 text-sm font-semibold text-ink">Top rejection reasons</p>
          {data.reasons.length === 0 && <p className="text-sm text-muted">No rejected orders yet.</p>}
          {data.reasons.map((r) => (
            <div key={r.reason} className="mb-2">
              <div className="mb-1 flex justify-between text-xs">
                <span>{r.reason}</span>
                <span className="font-semibold">{r.count}</span>
              </div>
              <ProgressBar pct={(r.count / maxReason) * 100} />
            </div>
          ))}
          <p className="mt-1 text-[10px] text-muted">Grouped from the actual reasons store owners entered when rejecting</p>
        </CardContent>
      </Card>

      <Card className="mt-3">
        <CardContent>
          <p className="mb-3 text-sm font-semibold text-ink">Rejections by store</p>
          {topStores.map((s) => (
            <div key={s.name} className="mb-2">
              <div className="mb-1 flex justify-between text-xs">
                <span>{s.name}</span>
                <span className="font-semibold">{s.pct.toFixed(1)}%</span>
              </div>
              <ProgressBar pct={(s.pct / maxStorePct) * 100} className="bg-ink" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-3">
        <CardContent className="space-y-1 text-sm">
          <p className="mb-1 font-semibold text-ink">Key facts</p>
          {worst ? (
            <p>
              📌 <b>{worst.name}</b> has the highest reject rate at {worst.pct.toFixed(1)}% ({worst.count} rejected order{worst.count > 1 ? "s" : ""}).
            </p>
          ) : (
            <p>📌 No store has any rejected orders yet.</p>
          )}
          {busiest && busiest.total > 0 && (
            <p>
              📌 <b>{busiest.name}</b> has the most orders overall ({busiest.total}).
            </p>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
