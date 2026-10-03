"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";

export default function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", isFeatured: false });

  function load() {
    setError(null);
    fetch(`/api/admin/products/${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).message ?? "Could not load this product.");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setForm({ name: d.product.name, description: d.product.description, price: String(d.product.price), isFeatured: d.product.isFeatured });
      })
      .catch((e) => setError(e.message));
  }
  useEffect(load, [id]);

  async function toggleAvailable() {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !data.product.isAvailable }),
    });
    load();
  }

  async function saveEdit() {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, description: form.description, price: Number(form.price), isFeatured: form.isFeatured }),
    });
    setEditing(false);
    load();
  }

  if (error) return <AdminShell><ErrorState message={error} onRetry={load} /></AdminShell>;
  if (!data) return <AdminShell><LoadingSkeleton className="h-40 w-full" /></AdminShell>;

  const { product, stats } = data;

  return (
    <AdminShell>
      <button onClick={() => router.push("/admin/products")} className="mb-3 text-sm font-semibold text-ink">← Back to products</button>
      <h1 className="mb-4 font-serif text-xl font-semibold text-ink">{product.name}</h1>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent>
            <p className="text-xs uppercase text-muted">Product</p>
            <p className="mt-2 text-sm">₹{Number(product.price).toLocaleString("en-IN")}</p>
            <p className="text-sm text-muted">{product.description}</p>
            <button onClick={() => router.push(`/admin/stores/${product.storeId}`)} className="mt-2 text-sm font-semibold text-rose">
              Sold by {product.store.name} →
            </button>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Available</span>
              <Button size="sm" variant={product.isAvailable ? "destructive" : "primary"} onClick={toggleAvailable}>
                {product.isAvailable ? "Mark unavailable" : "Mark available"}
              </Button>
            </div>
            <p className="mt-2 text-sm">{product.isFeatured ? "⭐ Featured on home page" : "Not featured"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-xs uppercase text-muted">Performance (real data)</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-lg font-semibold">{stats.timesOrdered}</p><p className="text-[10px] text-muted">Times ordered</p></div>
              <div><p className="text-lg font-semibold">{stats.unitsDelivered}</p><p className="text-[10px] text-muted">Units delivered</p></div>
              <div><p className="text-lg font-semibold">₹{stats.revenue.toLocaleString("en-IN")}</p><p className="text-[10px] text-muted">Revenue</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button className="mt-3 w-full" onClick={() => setEditing(true)}>✏️ Edit product details</Button>

      {editing && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40" onClick={() => setEditing(false)}>
          <div className="w-full max-w-md rounded-t-3xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-3 font-serif text-lg font-semibold">Edit Product</h2>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="mb-1 mt-3 block text-sm font-medium">Description</label>
            <textarea className="w-full rounded-2xl border border-ink/15 p-3 text-sm" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="mb-1 mt-3 block text-sm font-medium">Price (₹)</label>
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <label className="mt-3 flex items-center justify-between text-sm font-medium">
              Featured on home page
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            </label>
            <Button className="mt-4 w-full" onClick={saveEdit}>Save changes</Button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
