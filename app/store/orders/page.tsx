"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StoreShell } from "@/components/StoreShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { formatINR } from "@/lib/utils";

const TABS = [
  { key: "new", label: "New", statuses: ["ORDER_PLACED"] },
  { key: "in_progress", label: "In progress", statuses: ["STORE_ACCEPTED", "PREPARING_GIFT", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"] },
  { key: "completed", label: "Completed", statuses: ["DELIVERED"] },
  { key: "rejected", label: "Rejected", statuses: ["REJECTED"] },
];

export default function StoreOrdersPage() {
  const [orders, setOrders] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("new");

  function load() {
    fetch("/api/store/orders")
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).message ?? "Could not load orders.");
        return r.json();
      })
      .then((d) => setOrders(d.orders))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    const statuses = TABS.find((t) => t.key === tab)?.statuses ?? [];
    return orders.filter((o) => statuses.includes(o.status));
  }, [orders, tab]);

  return (
    <StoreShell>
      <h1 className="mb-4 font-serif text-xl font-semibold text-ink">Orders</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {error && <ErrorState message={error} onRetry={load} />}
        {!orders && !error && <LoadingSkeleton className="h-20 w-full" />}
        {orders && filtered.length === 0 && <EmptyState title="No orders here" description="Nothing in this tab right now." />}
        {orders && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((o) => (
              <Link key={o.id} href={`/store/orders/${o.id}`}>
                <Card className="transition hover:shadow-md">
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted">{o.orderCode}</p>
                      <p className="font-medium text-ink">{o.items[0]?.productName}</p>
                      <p className="text-sm text-muted">
                        {o.recipientName} · {new Date(o.placedAt).toLocaleString("en-IN")}
                      </p>
                      {o.deliverySlot && (
                        <p className="text-xs text-muted">
                          Scheduled: {new Date(o.deliveryDate).toLocaleDateString("en-IN")} · {o.deliverySlot}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={o.status} />
                      <p className="font-semibold text-ink">{formatINR(o.total)}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
