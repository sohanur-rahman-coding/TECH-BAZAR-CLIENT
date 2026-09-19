"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-full animate-pulse">
        <AlertTriangle size={64} className="text-rose-500" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-100">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          We encountered an unexpected error while rendering this page. Our team has been notified.
        </p>
      </div>

      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl max-w-lg w-full text-left overflow-hidden">
        <p className="text-xs font-mono text-rose-400 break-words">
          {error.message || "Unknown error occurred"}
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition shadow-lg shadow-violet-900/20 cursor-pointer"
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
        <Link href="/">
          <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition cursor-pointer">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}
