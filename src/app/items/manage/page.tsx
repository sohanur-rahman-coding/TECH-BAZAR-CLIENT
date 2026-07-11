"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Product } from "@/types";
import { ListChecks, Trash2, Eye, Plus, AlertCircle, ShoppingBag, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";

export default function ManageItemsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = (user as any)?.role as string | undefined;
  const isSeller = role === "seller" || role === "admin";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchUserProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/products/my-products`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your gadget listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${typeof document !== "undefined" ? (document.cookie.match(/better-auth\.session_token=([^;]+)/)?.[1] ?? "") : ""}`,
        },
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Listing deleted successfully!");
        setProducts(products.filter((p) => p._id !== productId));
        setConfirmDeleteId(null);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete listing");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during listing deletion");
    }
  };

  if (isPending) {
    return (
      <div className="space-y-6 py-4 animate-pulse">
        <div className="h-8 bg-slate-900 rounded w-1/4" />
        <div className="h-64 bg-slate-900 rounded-3xl w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <ShieldAlert size={48} className="text-slate-600" />
        <h2 className="text-xl font-black uppercase text-slate-200">Login Required</h2>
        <p className="text-xs text-slate-400 max-w-xs">Sign in to manage your listings.</p>
        <Link href="/signin">
          <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition">
            Sign In
          </button>
        </Link>
      </div>
    );
  }

  if (!isSeller) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <ShieldAlert size={48} className="text-amber-500" />
        <h2 className="text-xl font-black uppercase text-slate-200">Seller Access Only</h2>
        <p className="text-xs text-slate-400 max-w-xs">
          Only seller accounts can manage product listings. View our pricing plans to upgrade.
        </p>
        <div className="flex gap-3">
          <Link href="/pricing">
            <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition">
              View Pricing
            </button>
          </Link>
          <Link href="/products">
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 py-4 animate-pulse">
        <div className="h-8 bg-slate-900 rounded w-1/4" />
        <div className="h-4 bg-slate-900 rounded w-1/3" />
        <div className="h-64 bg-slate-900 rounded-3xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-2">
            <ListChecks className="text-violet-500" />
            <span>Manage My Listings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review, view, or remove gadgets you have published on Tech Bazaar.</p>
        </div>

        {/* Create new button */}
        <Link href="/items/add">
          <button className="flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition active:scale-95 shadow-lg shadow-violet-900/20">
            <Plus size={14} />
            <span>Add Gadget</span>
          </button>
        </Link>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-3xl space-y-4">
          <ShoppingBag className="h-12 w-12 text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold text-slate-350">No Listings Found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You haven't listed any gadgets for sale on Tech Bazaar yet. Start listing now!
          </p>
          <Link href="/items/add" className="inline-block mt-2">
            <button className="bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white px-5 py-2.5 rounded-xl cursor-pointer">
              List Your First Gadget
            </button>
          </Link>
        </div>
      ) : (
        /* Listings Table / Cards wrapper */
        <div className="bg-slate-900/10 border border-slate-900 rounded-3xl overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-[10px] text-slate-500 uppercase font-bold tracking-wider bg-slate-950/20">
                  <th className="p-4 pl-6">Gadget Info</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stats</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-900/20 transition">
                    {/* Info */}
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="h-10 w-16 object-cover rounded-lg bg-slate-950 border border-slate-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=100&q=80";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 truncate max-w-[200px]">{product.title}</p>
                        <span className="text-[10px] text-slate-500 capitalize">{product.brand}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-semibold text-slate-400">{product.category}</td>

                    {/* Condition */}
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        product.condition === "new"
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/30"
                          : product.condition === "refurbished"
                          ? "bg-amber-950/40 text-amber-400 border-amber-900/30"
                          : "bg-blue-950/40 text-blue-400 border-blue-900/30"
                      }`}>
                        {product.condition}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-bold text-violet-400">${product.price.toLocaleString()}</td>

                    {/* Views & Reviews */}
                    <td className="p-4 text-[10px] text-slate-500 font-medium space-y-0.5">
                      <p>👁 {product.views || 0} views</p>
                      <p>⭐ {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)</p>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      {confirmDeleteId === product._id ? (
                        /* Confirm delete popover inline state */
                        <div className="flex items-center justify-end gap-2 text-[10px] font-bold">
                          <span className="text-amber-400 flex items-center gap-0.5">
                            <AlertCircle size={12} /> Confirm?
                          </span>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="bg-rose-600 hover:bg-rose-500 text-white px-2 py-1.5 rounded-md cursor-pointer"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1.5 rounded-md cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-3.5">
                          <Link
                            href={`/products/${product._id}`}
                            className="text-slate-400 hover:text-violet-400 transition"
                            title="View Listing Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => setConfirmDeleteId(product._id)}
                            className="text-slate-400 hover:text-rose-450 transition cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Grid View (Shown on small screens) */}
          <div className="block md:hidden divide-y divide-slate-900">
            {products.map((product) => (
              <div key={product._id} className="p-5 space-y-4">
                <div className="flex gap-4">
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="h-14 w-20 object-cover rounded-lg bg-slate-950 border border-slate-800"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=150&q=80";
                    }}
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-200 text-sm truncate">{product.title}</h3>
                    <p className="text-[10px] text-slate-500">{product.brand} • {product.category}</p>
                    <p className="font-extrabold text-violet-400 mt-1">${product.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900/50">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                    product.condition === "new"
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/30"
                      : product.condition === "refurbished"
                      ? "bg-amber-950/40 text-amber-400 border-amber-900/30"
                      : "bg-blue-950/40 text-blue-400 border-blue-900/30"
                  }`}>
                    {product.condition}
                  </span>

                  {confirmDeleteId === product._id ? (
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="text-amber-400">Sure?</span>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-rose-600 text-white px-2 py-1 rounded-md"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="bg-slate-800 text-slate-350 px-2 py-1 rounded-md"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <Link href={`/products/${product._id}`} className="text-slate-450 hover:text-violet-400 flex items-center gap-1 text-xs">
                        <Eye size={16} />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => setConfirmDeleteId(product._id)}
                        className="text-slate-450 hover:text-rose-450 flex items-center gap-1 text-xs"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
