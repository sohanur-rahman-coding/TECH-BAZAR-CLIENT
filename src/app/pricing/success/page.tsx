"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const SERVER_URL = "/api/backend";

function PricingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const planKey = searchParams?.get("plan");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId || !planKey) {
      setError("Invalid success session parameters.");
      setLoading(false);
      return;
    }

    const upgradePlan = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/users/upgrade-plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ planKey }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to upgrade your account.");
        toast.success(`Successfully upgraded to ${planKey} tier!`);
      } catch (err: any) {
        console.error("Upgrade error:", err);
        setError(err.message || "Something went wrong upgrading your account.");
      } finally {
        setLoading(false);
      }
    };

    upgradePlan();
  }, [sessionId, planKey]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
        <Loader2 className="animate-spin mb-4 text-violet-500" size={48} />
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Activating your plan...</h2>
        <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">Upgrading your account to Seller status.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 px-4">
        <div className="h-20 w-20 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase">Upgrade Error</h2>
        <p className="text-sm mt-3 max-w-md text-center text-slate-600 dark:text-slate-400">{error}</p>
        <Link href="/pricing" className="mt-8 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition border border-slate-200 dark:border-slate-700">
          Return to Pricing
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 py-20">
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full" />
        <div className="relative h-24 w-24 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 border border-emerald-400/20">
          <CheckCircle size={48} className="text-white" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-4"
      >
        Subscription Active!
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-lg"
      >
        Congratulations! You are now a{" "}
        <strong className="text-emerald-600 dark:text-emerald-400 capitalize">{planKey} Seller</strong> on Tech Bazaar.
        You can immediately start listing your gadgets for sale.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
      >
        <Link
          href="/dashboard/items/add"
          className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
        >
          Add Your First Gadget <ArrowRight size={18} />
        </Link>
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
        >
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

export default function PricingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
        <Loader2 className="animate-spin mb-4 text-violet-500" size={48} />
        <p className="text-sm">Loading...</p>
      </div>
    }>
      <PricingSuccessContent />
    </Suspense>
  );
}
