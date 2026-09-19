"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  MdDashboard, 
  MdList, 
  MdAddCircle, 
  MdPeople, 
  MdAnalytics,
  MdShoppingCart,
  MdHistory
} from "react-icons/md";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;
  const role = (user as any)?.role as string | undefined;
  const isSeller = role === "seller";
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!isPending && session === null) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const getLinks = () => {
    const links = [
      { href: "/dashboard", label: "Overview", icon: <MdDashboard /> },
    ];
    if (!isSeller) {
      links.push({ href: "/dashboard/purchases", label: "Purchase History", icon: <MdShoppingCart /> });
    }
    if (isSeller) {
      links.push(
        { href: "/dashboard/items/manage", label: "Manage Listings", icon: <MdList /> },
        { href: "/dashboard/items/add", label: "Add Item", icon: <MdAddCircle /> }
      );
    }
    if (isAdmin) {
      links.push(
        { href: "/dashboard/users", label: "Manage Users", icon: <MdPeople /> },
        { href: "/dashboard/activity", label: "Platform Activity", icon: <MdAnalytics /> },
        { href: "/dashboard/admin-logs", label: "Admin Logs", icon: <MdHistory /> }
      );
    }
    return links;
  };

  const navLinks = getLinks();

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 py-8 min-h-[70vh]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sticky top-24 shadow-sm">
          <h2 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 mb-4 px-2">Dashboard Navigation</h2>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive 
                      ? "bg-violet-600/10 text-violet-600 dark:text-violet-400 border border-violet-500/30" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-violet-600 dark:hover:text-violet-300"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
