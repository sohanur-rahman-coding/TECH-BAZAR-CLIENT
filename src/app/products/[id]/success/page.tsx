"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";

function GadgetSuccessContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const sessionId = searchParams?.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !sessionId) {
      setError("Invalid success session.");
      setLoading(false);
      return;
    }

    const markAsSold = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/payments/mark-sold`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId: id }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to finalize purchase.");
        }
        
        toast.success("Purchase finalized! Gadget secured.");
      } catch (err: any) {
        console.error("Finalizing error:", err);
        setError(err.message || "Something went wrong finalizing your purchase.");
      } finally {
        setLoading(false);
      }
    };

    markAsSold();
  }, [id, sessionId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
        <Loader2 className="animate-spin mb-4 text-violet-500" size={48} />
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Securing Your Gadget...</h2>
        <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">Please wait while we finalize the escrow transaction.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 px-4">
        <div className="h-20 w-20 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Package size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase">Purchase Error</h2>
        <p className="text-sm mt-3 max-w-md text-center text-slate-600 dark:text-slate-400">{error}</p>
        <Link href={`/products/${id}`} className="mt-8 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition border border-slate-200 dark:border-slate-700">
          Return to Product
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 py-20">
      
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-violet-600 blur-3xl opacity-20 rounded-full" />
        <div className="relative h-24 w-24 bg-gradient-to-tr from-violet-600 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl border border-white/20">
          <CheckCircle size={48} className="text-white" />
        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-4">
        Payment Successful!
      </h1>
      
      <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-lg">
        Your gadget has been securely purchased via escrow. The seller has been notified and is preparing your shipment.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Link href="/products" className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl transition shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
          Keep Exploring <ArrowRight size={18} />
        </Link>
        <Link href="/dashboard/purchases" className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
          View Purchases
        </Link>
      </div>

      <div className="mt-12 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Order Details</p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 dark:text-slate-400">Order ID:</span>
          <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">{sessionId?.substring(0, 16)}...</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-slate-600 dark:text-slate-400">Product ID:</span>
          <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">{id}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-slate-600 dark:text-slate-400">Status:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Secured in Escrow</span>
        </div>
      </div>
    </div>
  );
}

export default function GadgetSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4 text-violet-500" size={48} />
      </div>
    }>
      <GadgetSuccessContent />
    </Suspense>
  );
}
