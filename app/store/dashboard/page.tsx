"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StoreShell } from "@/components/StoreShell";
import { Card, CardContent } from "@/components/ui/card";
import { OrderCard } from "@/components/OrderCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { formatINR } from "@/lib/utils";

const POLL_MS = 15000;

export default function StoreDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/store/dashboard")
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).message ?? "Could not load dashboard.");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, []);

  if (error && !data) {
    return (
      <StoreShell>
        <ErrorState message={error} onRetry={load} />
      </StoreShell>
    );
  }

  if (!data) {
    return (
      <StoreShell>
        <div className="space-y-3">
          <LoadingSkeleton className="h-24 w-full" />
        </div>
      </StoreShell>
    );
  }

  return (
    <StoreShell>
      <h1 className="mb-1 font-serif text-xl font-semibold text-ink">{data.store.name}</h1>
      <p className="mb-4 text-sm text-muted">{data.store.city.name} · {data.store.category.name}</p>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <Link href="/store/products" className="relative rounded-2xl border border-border bg-white p-3 text-center">
          <span className="text-xl">🛍️</span>
          <p className="mt-1 text-xs font-semibold">Products</p>
        </Link>
        <Link href="/store/orders" className="relative rounded-2xl border border-border bg-white p-3 text-center">
          {data.newOrders > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">{data.newOrders}</span>
          )}
          <span className="text-xl">📦</span>
          <p className="mt-1 text-xs font-semibold">Orders</p>
        </Link>
        <Link href="/store/profile" className="relative rounded-2xl border border-border bg-white p-3 text-center">
          <span className="text-xl">🏪</span>
          <p className="mt-1 text-xs font-semibold">Profile</p>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent>
            <p className="text-xs text-muted">New orders</p>
            <p className="mt-1 text-2xl font-semibold text-rose">{data.newOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted">Active orders</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{data.activeOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted">Delivered</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{data.deliveredOrders}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-3">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Mock order value (delivered)</p>
            <p className="mt-1 text-xl font-semibold text-ink">{formatINR(data.mockDeliveredValue)}</p>
          </div>
          <Link href="/store/products" className="text-sm font-medium text-rose">
            Manage products →
          </Link>
        </CardContent>
      </Card>

      <h2 className="mb-2 mt-6 text-sm font-semibold text-ink">Recent orders</h2>
      <div className="space-y-3">
        {data.recentOrders.length === 0 && <p className="text-sm text-muted">No orders yet.</p>}
        {data.recentOrders.map((o: any) => (
          <OrderCard
            key={o.id}
            id={o.id}
            orderCode={o.orderCode}
            productName={o.items[0]?.productName ?? "Gift"}
            storeName={data.store.name}
            placedAt={o.placedAt}
            status={o.status}
            total={o.total}
            trackHref={`/store/orders/${o.id}`}
          />
        ))}
      </div>
    </StoreShell>
  );
}
