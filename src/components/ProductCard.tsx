import React from "react";
import Link from "next/link";
import { MapPin, Calendar, Star, Tag } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedDate = new Date(product.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group flex flex-col h-full bg-slate-900/40 border border-slate-800 hover:border-violet-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-violet-950/20">
      {/* Product Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-800">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=500&q=80";
          }}
        />
        {/* Condition Tag */}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border shadow-sm uppercase tracking-wider ${
          product.condition === "new"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : product.condition === "refurbished"
            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
        }`}>
          {product.condition}
        </span>
      </div>

      {/* Product Body Content */}
      <div className="flex flex-col flex-grow p-5">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs text-violet-400 font-medium tracking-wide uppercase">
            <Tag size={12} />
            <span>{product.category}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-full text-amber-400 text-xs font-semibold border border-slate-800">
            <Star size={12} className="fill-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-100 text-base line-clamp-1 mb-2 group-hover:text-violet-400 transition-colors">
          {product.title}
        </h3>

        {/* Short Description */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">
          {product.shortDescription}
        </p>

        {/* Meta details footer */}
        <div className="mt-auto space-y-2 mb-4 border-t border-slate-800/60 pt-3 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-500" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-slate-500" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between gap-4 mt-auto pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Price</span>
            <span className="text-lg font-extrabold text-violet-400">${product.price.toLocaleString()}</span>
          </div>
          <Link href={`/products/${product._id}`} className="w-1/2">
            <button className="w-full text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 py-2.5 px-3 rounded-xl transition-all duration-200 shadow-md shadow-violet-900/20 active:scale-95 cursor-pointer">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
