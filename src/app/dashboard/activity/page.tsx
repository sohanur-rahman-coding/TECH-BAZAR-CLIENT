"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Package,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Search,
  Eye,
  Star,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/products`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to load platform listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") fetchProducts();
    else if (role !== undefined) setLoading(false);
  }, [role]);

  const handleDelete = async (productId: string, title: string) => {
    if (!confirm(`Delete listing "${title}"? This cannot be undone.`)) return;
    setDeletingId(productId);
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
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
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mr-3 text-violet-500" size={28} />
        <span className="font-medium">Loading platform activity...</span>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <AlertTriangle className="text-amber-500" size={48} />
        <h2 className="text-2xl font-black text-slate-100 uppercase">Access Denied</h2>
        <p className="text-slate-400 text-sm">Only admins can view this page.</p>
        <Link href="/dashboard" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const filtered = products
    .filter((p) =>
      (filterStatus === "all" || p.status === filterStatus) &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        (p.userName || "").toLowerCase().includes(search.toLowerCase()))
    );

  const conditionColor: Record<string, string> = {
    new: "bg-emerald-950 text-emerald-400 border-emerald-900/40",
    refurbished: "bg-amber-950 text-amber-400 border-amber-900/40",
    used: "bg-blue-950 text-blue-400 border-blue-900/40",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-5 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-slate-500 hover:text-violet-400 transition">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-2">
              <Package className="text-violet-500" size={28} />
              Platform Activity
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {products.length} total listings across all sellers
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Listings", val: products.length, color: "text-slate-100" },
          { label: "Active", val: products.filter((p) => !p.status || p.status === "active").length, color: "text-emerald-400" },
          { label: "Sold", val: products.filter((p) => p.status === "sold").length, color: "text-amber-400" },
          { label: "Total Value", val: `$${products.reduce((s, p) => s + p.price, 0).toLocaleString()}`, color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, category, seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500 transition"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "sold"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition ${
                filterStatus === s
                  ? "bg-violet-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
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
          {filtered.map((p) => (
            <div
              key={p._id}
              className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-700 transition group"
            >
              {/* Image */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700">
                    <Package size={36} />
                  </div>
                )}
                {p.status === "sold" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-xs font-black uppercase text-amber-400 border border-amber-400/40 px-3 py-1 rounded-full bg-amber-950/60">
                      Sold
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-bold text-slate-200 text-sm leading-tight line-clamp-1">{p.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{p.category}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-violet-400 font-black text-sm">${p.price.toLocaleString()}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${conditionColor[p.condition] || conditionColor["used"]}`}>
                    {p.condition}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye size={10} /> {p.views || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    {(p.rating || 0).toFixed(1)}
                  </span>
                  <span className="ml-auto truncate">by {p.userName || "Seller"}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/products/${p._id}`}
                    className="flex-1 py-2 text-center text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    disabled={deletingId === p._id}
                    className="flex-1 py-2 flex items-center justify-center gap-1 text-[10px] font-bold bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-900/20 rounded-lg transition disabled:opacity-50"
                  >
                    {deletingId === p._id ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Trash2 size={10} />
                    )}
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
