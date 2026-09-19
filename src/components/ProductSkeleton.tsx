import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col h-full bg-slate-100/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-video w-full bg-slate-200 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800" />

      {/* Content Skeleton */}
      <div className="flex flex-col flex-grow p-5 space-y-4">
        {/* Category & Rating Row */}
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />

        {/* Description Lines */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-800/80 rounded" />
          <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800/80 rounded" />
        </div>

        {/* Meta details footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/40 flex justify-between">
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800/60 rounded" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800/60 rounded" />
        </div>

        {/* Price & Action Row */}
        <div className="flex justify-between items-center pt-2 mt-auto">
          <div className="space-y-1">
            <div className="h-2 w-8 bg-slate-200 dark:bg-slate-800/40 rounded" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
