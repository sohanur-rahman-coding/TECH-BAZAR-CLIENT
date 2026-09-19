"use client";

import Link from "next/link";
import { Home, Compass, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 relative overflow-hidden">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 bg-violet-600/15 dark:bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-60 w-60 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={12} />
          <span>Error 404 • Signal Lost</span>
        </div>

        {/* 404 Big Gradient Text */}
        <h1 className="text-7xl sm:text-9xl font-black tracking-tighter bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent select-none">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 dark:text-slate-100 tracking-tight">
            Page Disconnected
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            The gadget or page you are searching for has been moved, unlisted, or no longer exists in our bazaar directory.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs transition duration-200 shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Home size={16} />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Compass size={16} />
            <span>Explore Marketplace</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
