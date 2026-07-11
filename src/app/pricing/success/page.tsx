"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Loader2, Award } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";

export default function PricingSuccessPage() {
  const router = useRouter();
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
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ planKey }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to upgrade your account.");
        }
        
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4 text-violet-500" size={48} />
        <h2 className="text-xl font-bold tracking-tight">Activating your plan...</h2>
        <p className="text-sm mt-2">Upgrading your account to Seller status.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <div className="h-20 w-20 bg-red-950 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Award size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-100 uppercase">Upgrade Error</h2>
        <p className="text-sm mt-3 max-w-md text-center">{error}</p>
        <Link href={`/pricing`} className="mt-8 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition">
          Return to Pricing
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 py-20">
      
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-600 blur-3xl opacity-20 rounded-full" />
        <div className="relative h-24 w-24 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-2xl border border-white/10">
          <CheckCircle size={48} className="text-white" />
        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-slate-100 uppercase tracking-tight mb-4">
        Subscription Active!
      </h1>
      
      <p className="text-slate-400 text-lg mb-10 max-w-lg">
        Congratulations! You are now a <strong className="text-emerald-400 capitalize">{planKey} Seller</strong> on Tech Bazaar. You can immediately start listing your gadgets for sale.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Link href="/items/add" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2">
          Add Your First Gadget <ArrowRight size={18} />
        </Link>
        <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
