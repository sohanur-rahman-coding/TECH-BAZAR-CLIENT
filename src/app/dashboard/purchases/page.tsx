"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await fetch(`${SERVER_URL}/api/products/purchases`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch purchases");
        const data = await res.json();
        setPurchases(data);
      } catch (err: any) {
        toast.error("Failed to load purchase history");
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl shadow-sm">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-900 dark:text-slate-100 tracking-tight">Purchase History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">View and track all the tech gadgets you have ordered</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex flex-col bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-48 space-y-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
              </div>
              <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mt-auto" />
            </div>
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 sm:p-14 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 shadow-sm">
          <Package className="h-16 w-16 text-slate-300 dark:text-slate-700" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Purchases Yet</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
            You haven't bought any gadgets yet. Head over to the products page to find your next tech upgrade.
          </p>
          <Link href="/products">
            <button className="mt-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-violet-500/20 text-xs transition flex items-center gap-2 cursor-pointer active:scale-95">
              Browse Products <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map((product) => (
            <div key={product._id} className="group flex flex-col bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-violet-400 dark:hover:border-violet-700 transition duration-300">
              <div className="p-5 flex flex-col sm:flex-row gap-4 h-full">
                <div className="h-24 w-full sm:w-20 sm:h-20 flex-shrink-0 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <img src={product.imageUrl || "https://placehold.co/100"} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="flex flex-col flex-grow min-w-0 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">{product.category}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-slate-100">${product.price}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate" title={product.title}>{product.title}</h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">Seller: {product.userName || "Verified Seller"}</p>
                  
                  <div className="mt-auto pt-3 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                      Paid & Secured
                    </span>
                    <Link href={`/products/${product._id}`} className="text-[10px] text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 font-bold flex items-center gap-1 transition">
                      View Item <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
