"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { MdTrendingUp, MdVisibility, MdAttachMoney, MdDashboard, MdShoppingCart } from "react-icons/md";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";
const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#6366f1"];

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

/* ─── Custom Tooltip for Charts (light/dark adaptive) ─── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ─── Stat Card ─── */
function StatCard({ label, value, sub, icon, gradient, index }: {
  label: string; value: string | number; sub: string;
  icon: React.ReactNode; gradient: string; index: number;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:border-violet-400/50 dark:hover:border-violet-500/40 transition duration-300"
    >
      <div className="space-y-1">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">{label}</span>
        <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{value}</p>
        <span className="block text-[10px] text-slate-500 dark:text-slate-400">{sub}</span>
      </div>
      <div className={`p-4 bg-gradient-to-br ${gradient} rounded-2xl text-white shadow-lg`}>
        {icon}
      </div>
    </motion.div>
  );
}

/* ─── Skeleton Loader ─── */
function DashboardSkeleton() {
  return (
    <div className="space-y-6 py-4 max-w-7xl mx-auto px-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-shimmer" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-shimmer" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = (user as any)?.role as string | undefined;
  const isSeller = role === "seller";
  const isAdmin = role === "admin";
  const isBuyer = !isSeller && !isAdmin;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (isBuyer) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    try {
      const endpoint = isAdmin
        ? `${SERVER_URL}/api/admin/analytics`
        : `${SERVER_URL}/api/products/analytics`;
      const res = await fetch(endpoint, {
        credentials: "include",
        signal: controller.signal,
      });
      if (res.ok) {
        const stats = await res.json();
        setData(stats);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error(err);
        toast.error("Failed to compile dashboard metrics");
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, [isAdmin, isBuyer]);

  useEffect(() => {
    if (user !== undefined) {
      fetchAnalytics();
    }
  }, [user, fetchAnalytics]);

  /* Memoize chart data to avoid unnecessary re-renders */
  const adminCategoryStats = useMemo(() => data?.categoryStats || [], [data]);
  const adminPlatformStats = useMemo(
    () => data?.platformStats || { totalUsers: 0, totalSellers: 0, totalBuyers: 0, totalAdmins: 0, totalProducts: 0, totalValue: 0, totalViews: 0 },
    [data]
  );
  const myStats = useMemo(() => data?.myStats || { totalListed: 0, totalViews: 0, totalValue: 0 }, [data]);
  const categoryStats = useMemo(() => data?.categoryStats || [], [data]);

  if (isPending || loading) return <DashboardSkeleton />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h2 className="text-xl font-black uppercase text-slate-900 dark:text-slate-200">Login Required</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs">You must be signed in to view your dashboard.</p>
        <a href="/signin" className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition">
          Sign In
        </a>
      </div>
    );
  }

  /* ─── Buyer View ─── */
  if (isBuyer) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MdDashboard className="text-violet-600 dark:text-violet-500" />
            <span>Buyer Dashboard</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Welcome back, <strong className="text-violet-600 dark:text-violet-400">{user.name}</strong>! Track purchases or upgrade your account.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col items-center text-center space-y-4 shadow-sm hover:border-violet-400/50 hover:shadow-md transition duration-300"
          >
            <div className="p-4 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-violet-500/20">
              <MdShoppingCart size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 uppercase">Purchase History</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">View all your bought gadgets, order history, and payment details.</p>
            <a href="/dashboard/purchases" className="mt-auto bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition w-full text-center block shadow-sm">
              View Purchases
            </a>
          </motion.div>

          <motion.div
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col items-center text-center space-y-4 shadow-sm hover:border-blue-400/50 hover:shadow-md transition duration-300"
          >
            <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <MdDashboard size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 uppercase">Explore Products</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Discover thousands of new and refurbished gadgets from verified sellers.</p>
            <a href="/products" className="mt-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition w-full text-center block border border-slate-200 dark:border-slate-700">
              Browse Marketplace
            </a>
          </motion.div>

          <motion.div
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col items-center text-center space-y-4 shadow-sm hover:border-amber-400/50 hover:shadow-md transition duration-300"
          >
            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-amber-500/20">
              <MdTrendingUp size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 uppercase">Become A Seller</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Got electronics to sell? Upgrade your account to a seller plan and reach buyers.</p>
            <a href="/pricing" className="mt-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition w-full text-center block border border-slate-200 dark:border-slate-700">
              View Pricing
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── Admin View ─── */
  if (isAdmin && data) {
    return (
      <div className="space-y-8 py-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MdDashboard className="text-violet-600 dark:text-violet-500" />
            <span>Admin Dashboard</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Platform-wide analytics and performance metrics.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard index={0} label="Total Users" value={adminPlatformStats.totalUsers} sub={`Sellers: ${adminPlatformStats.totalSellers} | Buyers: ${adminPlatformStats.totalBuyers}`} icon={<MdVisibility size={22} />} gradient="from-violet-600 to-purple-700" />
          <StatCard index={1} label="Platform Listings" value={adminPlatformStats.totalProducts} sub="Active gadgets across platform" icon={<MdDashboard size={22} />} gradient="from-blue-500 to-indigo-600" />
          <StatCard index={2} label="Total Value" value={`$${adminPlatformStats.totalValue.toLocaleString()}`} sub="Combined inventory worth" icon={<MdAttachMoney size={22} />} gradient="from-emerald-500 to-teal-600" />
          <StatCard index={3} label="Platform Views" value={adminPlatformStats.totalViews.toLocaleString()} sub="Total traffic to listings" icon={<MdTrendingUp size={22} />} gradient="from-amber-500 to-orange-600" />
        </div>

        {/* Category Pie Chart */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}
          className="bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-sm"
        >
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Global Category Allocations</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Ratio of all gadgets listed across category folders.</p>
          </div>
          <div className="h-64">
            {adminCategoryStats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">No category data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={adminCategoryStats} nameKey="category" dataKey="count" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4}>
                    {adminCategoryStats.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "10px", color: "currentColor" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link href="/dashboard/users" className="group bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 hover:border-violet-400/60 dark:hover:border-violet-500/50 p-6 rounded-2xl flex items-center gap-5 transition shadow-sm hover:shadow-md">
            <div className="p-4 bg-gradient-to-br from-violet-500 to-violet-700 text-white rounded-2xl shadow-lg shadow-violet-500/20 group-hover:scale-105 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase">Manage Users</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">View, search and remove users</p>
            </div>
          </Link>
          <Link href="/dashboard/activity" className="group bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 hover:border-amber-400/60 dark:hover:border-amber-500/50 p-6 rounded-2xl flex items-center gap-5 transition shadow-sm hover:shadow-md">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase">Platform Activity</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Moderate all gadget listings</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Seller View ─── */
  return (
    <div className="space-y-8 py-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MdDashboard className="text-violet-600 dark:text-violet-500" />
          <span>Seller Analytics</span>
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Review your listed hardware volume, view impacts, and check database-wide metrics.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard index={0} label="Total Listed" value={myStats.totalListed} sub="Active gadget offers" icon={<MdTrendingUp size={22} />} gradient="from-violet-600 to-purple-700" />
        <StatCard index={1} label="Total Reach" value={myStats.totalViews.toLocaleString()} sub="Cumulative listing views" icon={<MdVisibility size={22} />} gradient="from-blue-500 to-indigo-600" />
        <StatCard index={2} label="Listed Value" value={`$${myStats.totalValue.toLocaleString()}`} sub="Total USD inventory worth" icon={<MdAttachMoney size={22} />} gradient="from-emerald-500 to-teal-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}
          className="bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-sm"
        >
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Category Allocations</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Ratio of gadgets listed across category folders.</p>
          </div>
          <div className="h-64">
            {categoryStats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">No category data. List items to see analytics.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryStats} nameKey="category" dataKey="count" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4}>
                    {categoryStats.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}
          className="bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-sm"
        >
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Average Category Pricing</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Average listing value ($ USD) across sections.</p>
          </div>
          <div className="h-64">
            {categoryStats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">No pricing metrics available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgPrice" radius={[6, 6, 0, 0]}>
                    {categoryStats.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
