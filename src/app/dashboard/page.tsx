"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AnalyticsData } from "@/types";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { MdTrendingUp, MdVisibility, MdAttachMoney, MdDashboard } from "react-icons/md";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#6366f1"];

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = (user as any)?.role as string | undefined;
  const isSeller = role === "seller";
  const isAdmin = role === "admin";
  const isBuyer = !isSeller && !isAdmin;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (isBuyer) {
        setLoading(false);
        return;
      }
      try {
        const endpoint = isAdmin ? `${SERVER_URL}/api/admin/analytics` : `${SERVER_URL}/api/products/analytics`;
        const res = await fetch(endpoint, {
          credentials: "include",
        });
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to compile dashboard metrics");
      } finally {
        setLoading(false);
      }
    }
    if (user !== undefined) {
      fetchAnalytics();
    }
  }, [isAdmin, isBuyer, user]);

  if (isPending || loading) {
    return (
      <div className="space-y-6 py-4 animate-pulse max-w-7xl mx-auto px-4">
        <div className="h-8 bg-slate-900 rounded w-1/4" />
        <div className="h-4 bg-slate-900 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-slate-900 rounded-2xl" />
          <div className="h-28 bg-slate-900 rounded-2xl" />
          <div className="h-28 bg-slate-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h2 className="text-xl font-black uppercase text-slate-200">Login Required</h2>
        <p className="text-xs text-slate-400 max-w-xs">You must be signed in to view your dashboard.</p>
        <a href="/signin" className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition">
          Sign In
        </a>
      </div>
    );
  }

  if (isBuyer) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">
        <div className="border-b border-slate-900 pb-5">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-2">
            <MdDashboard className="text-violet-500" />
            <span>Buyer Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Welcome back, {user.name}! Ready to find some great electronics?
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-3xl flex flex-col items-center text-center space-y-4 shadow-sm hover:border-violet-500/50 transition">
            <div className="p-4 bg-violet-950/40 text-violet-400 border border-violet-900/30 rounded-2xl">
              <MdDashboard size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-200 uppercase">Explore Products</h3>
            <p className="text-xs text-slate-400">Discover thousands of new and refurbished gadgets from verified sellers.</p>
            <a href="/products" className="mt-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition w-full max-w-[200px]">
              Browse Listings
            </a>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-3xl flex flex-col items-center text-center space-y-4 shadow-sm hover:border-violet-500/50 transition">
            <div className="p-4 bg-amber-950/40 text-amber-400 border border-amber-900/30 rounded-2xl">
              <MdTrendingUp size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-200 uppercase">Become A Seller</h3>
            <p className="text-xs text-slate-400">Got electronics to sell? Upgrade your account to a seller plan and reach thousands of buyers.</p>
            <a href="/pricing" className="mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition w-full max-w-[200px]">
              View Pricing
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin && data) {
    const platformStats = data.platformStats || { totalUsers: 0, totalSellers: 0, totalBuyers: 0, totalAdmins: 0, totalProducts: 0, totalValue: 0, totalViews: 0 };
    const categoryStats = data.categoryStats || [];

    return (
      <div className="space-y-8 py-4">
        {/* Header */}
        <div className="border-b border-slate-900 pb-5">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-2">
            <MdDashboard className="text-violet-500" />
            <span>Admin Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform-wide analytics and performance metrics.
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Users</span>
            <p className="text-3xl font-black text-slate-100">{platformStats.totalUsers}</p>
            <span className="block text-[10px] text-slate-450 mt-1">Sellers: {platformStats.totalSellers} | Buyers: {platformStats.totalBuyers}</span>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Platform Listings</span>
            <p className="text-3xl font-black text-slate-100">{platformStats.totalProducts}</p>
            <span className="block text-[10px] text-slate-450 mt-1">Active gadgets across platform</span>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Value</span>
            <p className="text-3xl font-black text-violet-400">${platformStats.totalValue.toLocaleString()}</p>
            <span className="block text-[10px] text-slate-450 mt-1">Combined inventory worth</span>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Platform Views</span>
            <p className="text-3xl font-black text-slate-100">{platformStats.totalViews.toLocaleString()}</p>
            <span className="block text-[10px] text-slate-450 mt-1">Total traffic to listings</span>
          </div>
        </div>

        {/* Category Visualization */}
        <div className="bg-slate-900/10 border border-slate-900 p-6 rounded-3xl space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Global Category Allocations</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Ratio of all gadgets listed across category folders.</p>
          </div>
          <div className="h-64">
            {categoryStats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                No category data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    nameKey="category"
                    dataKey="count"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {categoryStats.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                    itemStyle={{ color: "#e2e8f0", fontSize: "11px" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link href="/dashboard/users" className="group bg-slate-900/30 border border-slate-900 hover:border-violet-500/50 p-6 rounded-2xl flex items-center gap-5 transition shadow-sm">
            <div className="p-4 bg-violet-950/40 text-violet-400 border border-violet-900/30 rounded-2xl group-hover:bg-violet-950/70 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase">Manage Users</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">View, search and remove users</p>
            </div>
          </Link>
          <Link href="/dashboard/activity" className="group bg-slate-900/30 border border-slate-900 hover:border-violet-500/50 p-6 rounded-2xl flex items-center gap-5 transition shadow-sm">
            <div className="p-4 bg-amber-950/40 text-amber-400 border border-amber-900/30 rounded-2xl group-hover:bg-amber-950/70 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase">Platform Activity</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Moderate all gadget listings</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  const myStats = data?.myStats || { totalListed: 0, totalViews: 0, totalValue: 0 };
  const categoryStats = data?.categoryStats || [];
  const conditionStats = data?.conditionStats || [];

  // Fallbacks for charts if empty
  const defaultCategoryData = categoryStats.length > 0 ? categoryStats : [
    { category: "Laptops", count: 0, avgPrice: 0 },
    { category: "Smartphones", count: 0, avgPrice: 0 },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-2">
          <MdDashboard className="text-violet-500" />
          <span>Seller Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your listed hardware volume, view impacts, and check database-wide metrics.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Listed Count Card */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Listed</span>
            <p className="text-3xl font-black text-slate-100">{myStats.totalListed}</p>
            <span className="block text-[10px] text-slate-450">Active gadget offers</span>
          </div>
          <div className="p-4 bg-violet-950/40 text-violet-400 border border-violet-900/30 rounded-2xl">
            <MdTrendingUp size={24} />
          </div>
        </div>

        {/* Views Count Card */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Reach</span>
            <p className="text-3xl font-black text-slate-100">{myStats.totalViews.toLocaleString()}</p>
            <span className="block text-[10px] text-slate-450">Cumulative listings views</span>
          </div>
          <div className="p-4 bg-violet-950/40 text-violet-400 border border-violet-900/30 rounded-2xl">
            <MdVisibility size={24} />
          </div>
        </div>

        {/* Listed Value Card */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Listed Value</span>
            <p className="text-3xl font-black text-violet-400">${myStats.totalValue.toLocaleString()}</p>
            <span className="block text-[10px] text-slate-450">Total USD inventory worth</span>
          </div>
          <div className="p-4 bg-violet-950/40 text-violet-400 border border-violet-900/30 rounded-2xl">
            <MdAttachMoney size={24} />
          </div>
        </div>

      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Category Distribution - Pie Chart */}
        <div className="bg-slate-900/10 border border-slate-900 p-6 rounded-3xl space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Category Allocations</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Ratio of gadgets listed across category folders.</p>
          </div>
          <div className="h-64">
            {categoryStats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                No category data available. List items to see analytics.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    nameKey="category"
                    dataKey="count"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                    itemStyle={{ color: "#e2e8f0", fontSize: "11px" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Average Pricing per Category - Bar Chart */}
        <div className="bg-slate-900/10 border border-slate-900 p-6 rounded-3xl space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Average Category Pricing</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Average listing value ($ USD) across sections.</p>
          </div>
          <div className="h-64">
            {categoryStats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                No pricing metrics available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}
                    itemStyle={{ color: "#a78bfa", fontSize: "11px" }}
                  />
                  <Bar dataKey="avgPrice" fill="#8b5cf6" radius={[6, 6, 0, 0]}>
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
