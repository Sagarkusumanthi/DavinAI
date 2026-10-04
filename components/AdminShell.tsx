"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Store, Package, ClipboardList, Users, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/stores", label: "Stores", icon: Store },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/returns", label: "Returns", icon: Undo2 },
  { href: "/admin/users", label: "Users & reports", icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-blush/20 pb-16">
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-ink/5 bg-white px-4 py-3">
          <span className="font-serif font-semibold text-ink">Giftly · Admin</span>
          <button onClick={logout} className="text-sm text-muted">
            Log out
          </button>
        </div>
        <main className="p-4">{children}</main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-phone overflow-x-auto border-t border-ink/5 bg-white">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px]", active ? "text-rose" : "text-muted")}>
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
