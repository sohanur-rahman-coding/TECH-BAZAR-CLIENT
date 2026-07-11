"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Users,
  Trash2,
  ShieldCheck,
  ShoppingBag,
  UserCircle,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "buyer";
  plan?: string;
  createdAt: string;
  image?: string;
}

export default function AdminUsersPage() {
  const { data: session, isPending } = authClient.useSession();
  const role = (session?.user as any)?.role;

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/users`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") fetchUsers();
    else if (role !== undefined) setLoading(false);
  }, [role]);

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${userName}" and all their data?`)) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`${SERVER_URL}/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`User "${userName}" has been removed.`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      toast.error("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mr-3 text-violet-500" size={28} />
        <span className="font-medium">Loading user registry...</span>
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

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (r: string) => {
    if (r === "admin") return "bg-violet-950 text-violet-400 border-violet-900/40";
    if (r === "seller") return "bg-amber-950 text-amber-400 border-amber-900/40";
    return "bg-slate-900 text-slate-400 border-slate-800";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-slate-500 hover:text-violet-400 transition">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-2">
              <Users className="text-violet-500" size={28} />
              Manage Users
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {users.length} registered users on the platform
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", val: users.length, color: "text-slate-100" },
          { label: "Admins", val: users.filter((u) => u.role === "admin").length, color: "text-violet-400" },
          { label: "Sellers", val: users.filter((u) => u.role === "seller").length, color: "text-amber-400" },
          { label: "Buyers", val: users.filter((u) => u.role === "buyer" || (!u.role)).length, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500 transition"
        />
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-900/40">
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold">User</th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Email</th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Role</th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Plan</th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Joined</th>
                <th className="text-right px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 text-sm italic">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u._id} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-violet-950 border border-violet-900/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {u.image ? (
                            <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle size={18} className="text-violet-400" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-200 text-xs">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${roleBadge(u.role)}`}>
                        {u.role || "buyer"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400 capitalize">{u.plan || "free"}</td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {u.role === "admin" ? (
                        <span className="text-[10px] text-slate-600 font-bold uppercase">Protected</span>
                      ) : (
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={deletingId === u._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-950/70 text-red-400 border border-red-900/30 rounded-lg text-[10px] font-bold uppercase transition disabled:opacity-50 cursor-pointer"
                        >
                          {deletingId === u._id ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Trash2 size={10} />
                          )}
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
