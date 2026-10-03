"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CustomerShell } from "@/components/CustomerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

type GroupGift = {
  id: string;
  title: string;
  goalAmount: string;
  collectedAmount: number;
  percentFunded: number;
  isFullyFunded: boolean;
  contributors: { paid: boolean }[];
};

export default function GroupGiftsPage() {
  const [groupGifts, setGroupGifts] = useState<GroupGift[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setError(null);
    fetch("/api/group-gifts")
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).message ?? "Could not load group gifts.");
        return r.json();
      })
      .then((d) => setGroupGifts(d.groupGifts))
      .catch((e) => setError(e.message));
  }
  useEffect(load, []);

  return (
    <CustomerShell>
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-serif text-xl font-semibold text-ink">Group Gifting</h1>
          <Link href="/group-gifts/new"><Button size="sm">+ Create</Button></Link>
        </div>

        {!groupGifts && !error && (
          <div className="space-y-3">
            <LoadingSkeleton className="h-24 w-full" />
            <LoadingSkeleton className="h-24 w-full" />
          </div>
        )}
        {error && <ErrorState message={error} onRetry={load} />}
        {groupGifts && groupGifts.length === 0 && (
          <EmptyState title="No group gifts yet" description="Invite friends to split a gift together." actionLabel="Create group gift" href="/group-gifts/new" />
        )}
        {groupGifts && groupGifts.length > 0 && (
          <div className="space-y-3">
            {groupGifts.map((g) => (
              <Link key={g.id} href={`/group-gifts/${g.id}`}>
                <Card>
                  <CardContent>
                    <p className="font-semibold text-ink">{g.title}</p>
                    <p className="mt-1 text-sm">
                      ₹{g.collectedAmount.toLocaleString("en-IN")} of ₹{Number(g.goalAmount).toLocaleString("en-IN")} collected{" "}
                      <span className="font-semibold text-rose">{g.percentFunded}%</span>
                    </p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div className="h-full bg-rose" style={{ width: `${g.percentFunded}%` }} />
                    </div>
                    {g.isFullyFunded && <p className="mt-2 text-xs font-semibold text-green-700">✓ Ready to order</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </CustomerShell>
  );
}
