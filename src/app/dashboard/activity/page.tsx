"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { Package, Trash2, ArrowLeft, Loader2, AlertTriangle, Search, Eye, Star } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const SERVER_URL = "/api/backend";

interface ProductRecord {
  _id: string;
  title: string;
  category: string;
  price: number;
  condition: string;
  status?: string;
  views?: number;
  rating?: number;
  userName?: string;
  createdAt: string;
  imageUrl?: string;
}

export default function AdminActivityPage() {
  const { data: session, isPending } = authClient.useSession();
  const role = (session?.user as any)?.role;

  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/products`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to load platform listings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === "admin") fetchProducts();
    else if (role !== undefined) setLoading(false);
  }, [role, fetchProducts]);

  const handleDelete = async (productId: string, title: string) => {
    if (!confirm(`Delete listing "${title}"? This cannot be undone.`)) return;
    setDeletingId(productId);
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/products/${productId}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`Listing "${title}" removed.`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch {
      toast.error("Failed to delete listing.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-600 dark:text-slate-400">
        <Loader2 className="animate-spin mr-3 text-violet-500" size={28} />
        <span className="font-medium">Loading platform activity...</span>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-4">
        <AlertTriangle className="text-amber-500" size={48} />
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase">Access Denied</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Only admins can view this page.</p>
        <Link href="/dashboard" className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition text-sm border border-slate-200 dark:border-slate-700">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const filtered = products.filter((p) =>
    (filterStatus === "all" || p.status === filterStatus) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.userName || "").toLowerCase().includes(search.toLowerCase()))
  );

  const conditionColor: Record<string, string> = {
    new: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900/40",
    refurbished: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900/40",
    used: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900/40",
  };

  const statsData = [
    { label: "Total Listings", val: products.length, color: "text-slate-900 dark:text-slate-100", gradient: "from-violet-500 to-purple-600" },
    { label: "Active", val: products.filter((p) => !p.status || p.status === "active").length, color: "text-emerald-600 dark:text-emerald-400", gradient: "from-emerald-500 to-teal-600" },
    { label: "Sold", val: products.filter((p) => p.status === "sold").length, color: "text-amber-600 dark:text-amber-400", gradient: "from-amber-500 to-orange-600" },
    { label: "Total Value", val: `$${products.reduce((s, p) => s + p.price, 0).toLocaleString()}`, color: "text-violet-600 dark:text-violet-400", gradient: "from-violet-500 to-indigo-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Package className="text-violet-600 dark:text-violet-500" size={28} />
              Platform Activity
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{products.length} total listings across all sellers</p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statsData.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-violet-400/50 dark:hover:border-violet-500/40 transition duration-200"
          >
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, category, seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-violet-500 transition shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "sold"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition ${
                filterStatus === s
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500 italic">No listings found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((p, idx) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
              className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-violet-400/50 dark:hover:border-slate-700 hover:shadow-md transition duration-300 group"
            >
              {/* Image */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-950 overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-700">
                    <Package size={36} />
                  </div>
                )}
                {p.status === "sold" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-xs font-black uppercase text-amber-400 border border-amber-400/40 px-3 py-1 rounded-full bg-amber-950/60">Sold</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-200 text-sm leading-tight line-clamp-1">{p.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{p.category}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-violet-600 dark:text-violet-400 font-black text-sm">${p.price.toLocaleString()}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${conditionColor[p.condition] || conditionColor["used"]}`}>
                    {p.condition}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Eye size={10} /> {p.views || 0}</span>
                  <span className="flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" /> {(p.rating || 0).toFixed(1)}</span>
                  <span className="ml-auto truncate text-slate-400 dark:text-slate-500">by {p.userName || "Seller"}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Link href={`/products/${p._id}`}
                    className="flex-1 py-2 text-center text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition border border-slate-200 dark:border-slate-700"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    disabled={deletingId === p._id}
                    className="flex-1 py-2 flex items-center justify-center gap-1 text-[10px] font-bold bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/20 rounded-lg transition disabled:opacity-50"
                  >
                    {deletingId === p._id ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
