"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ClipboardList, Store as StoreIcon, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/store/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/store/products", label: "Products", icon: Package },
  { href: "/store/orders", label: "Orders", icon: ClipboardList },
  { href: "/store/reports", label: "Reports", icon: BarChart3 },
  { href: "/store/profile", label: "Profile", icon: StoreIcon },
];

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    fetch("/api/store/dashboard").then((r) => r.ok && r.json()).then((d) => d && setNewOrders(d.newOrders ?? 0));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-blush/20 pb-16">

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-ink/5 bg-white px-4 py-3">
          <span className="font-serif font-semibold text-ink">Giftly · Store</span>
          <button onClick={logout} className="text-sm text-muted">
            Log out
          </button>
        </div>
        <main className="p-4">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-phone border-t border-ink/5 bg-white">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex min-w-0 flex-1 flex-col items-center gap-1 whitespace-nowrap py-2.5 text-[11px]", active ? "text-rose" : "text-muted")}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {item.href === "/store/orders" && newOrders > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose text-[8px] font-bold text-white">{newOrders}</span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
