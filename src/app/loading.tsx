import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
      
      {/* Background Glowing Orbs */}
      <div className="absolute h-72 w-72 bg-violet-500/15 dark:bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute h-60 w-60 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        
        {/* Animated Brand Logo Icon */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur-md opacity-75 animate-pulse" />
          <div className="relative h-16 w-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow">
              <rect width="16" height="16" x="4" y="4" rx="2" />
              <rect width="6" height="6" x="9" y="9" rx="1" />
              <path d="M15 2v2" />
              <path d="M15 20v2" />
              <path d="M2 15h2" />
              <path d="M2 9h2" />
              <path d="M20 15h2" />
              <path d="M20 9h2" />
              <path d="M9 2v2" />
              <path d="M9 20v2" />
            </svg>
          </div>
        </div>

        {/* Loading Spinner Ring & Text */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-violet-600 dark:bg-violet-400 rounded-full animate-ping" />
            <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
              Tech Bazaar
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Preparing your experience...
          </p>
        </div>

        {/* Progress bar loader */}
        <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full animate-indeterminate" />
        </div>

      </div>

      <style>{`
        @keyframes indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-indeterminate {
          animation: indeterminate 1.5s infinite ease-in-out;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
