"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Product } from "@/types";
import { Search, SlidersHorizontal, Trash2, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

const SERVER_URL = "/api/backend";

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    searchParams.get("condition")?.split(",").filter(Boolean) || []
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  
  // Sort and Page States
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state from query params on load/url change
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setSelectedConditions(searchParams.get("condition")?.split(",").filter(Boolean) || []);
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setMinRating(searchParams.get("minRating") || "");
    setSortBy(searchParams.get("sortBy") || "createdAt");
    setSortOrder(searchParams.get("sortOrder") || "desc");
    setPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set("search", search);
        if (category) queryParams.set("category", category);
        if (selectedConditions.length > 0) queryParams.set("condition", selectedConditions.join(","));
        if (minPrice) queryParams.set("minPrice", minPrice);
        if (maxPrice) queryParams.set("maxPrice", maxPrice);
        if (minRating) queryParams.set("minRating", minRating);
        queryParams.set("sortBy", sortBy);
        queryParams.set("sortOrder", sortOrder);
        queryParams.set("page", page.toString());
        queryParams.set("limit", "8"); // 4 per row desktop, 2 rows max

        const res = await fetch(`${SERVER_URL}/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setTotalProducts(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category, selectedConditions, minPrice, maxPrice, minRating, sortBy, sortOrder, page, searchParams]);

  // Update query params when filter changes
  const applyFilters = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Default page reset on filter change
    params.set("page", "1");

    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val.toString());
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  const handleConditionChange = (cond: string) => {
    const isSelected = selectedConditions.includes(cond);
    const updated = isSelected 
      ? selectedConditions.filter(c => c !== cond)
      : [...selectedConditions, cond];
    
    setSelectedConditions(updated);
    applyFilters({ condition: updated.join(",") });
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setSelectedConditions([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
    router.push("/products");
  };

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      applyFilters({ page: pageNum });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search });
  };

  const categoriesList = ["Laptops", "Smartphones", "Audio", "Smartwatches", "Monitors", "Accessories"];

  return (
    <div className="space-y-6">
      
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100">Explore Gadgets</h1>
          <p className="text-xs text-slate-400 mt-1">Browse, filter, and compare listings listed globally.</p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-md">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product title, brand or description..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white px-5 rounded-xl cursor-pointer transition">
            Search
          </button>
        </form>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: Sidebar Filters (Desktop) */}
        <div className="hidden lg:block space-y-6 bg-slate-900/10 border border-slate-900 rounded-2xl p-6 h-fit sticky top-20">
          <div className="flex items-center justify-between pb-4 border-b border-slate-900">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </span>
            <button
              onClick={handleClearFilters}
              className="text-[10px] text-rose-400 hover:text-rose-350 font-bold uppercase flex items-center gap-1 transition cursor-pointer"
            >
              <Trash2 size={12} />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase text-slate-350 tracking-wide">Category</h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => applyFilters({ category: "" })}
                className={`text-left text-xs font-medium py-1 px-2.5 rounded-lg transition ${
                  category === "" ? "bg-violet-600/10 text-violet-400 border border-violet-500/20" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All Categories
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => applyFilters({ category: cat })}
                  className={`text-left text-xs font-medium py-1 px-2.5 rounded-lg transition ${
                    category === cat ? "bg-violet-600/10 text-violet-400 border border-violet-500/20" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-900">
            <h3 className="text-xs font-bold uppercase text-slate-350 tracking-wide">Condition</h3>
            <div className="flex flex-col gap-2">
              {["new", "refurbished", "used"].map((cond) => (
                <label key={cond} className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(cond)}
                    onChange={() => handleConditionChange(cond)}
                    className="accent-violet-600 h-4 w-4 rounded border-slate-800"
                  />
                  <span className="capitalize">{cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-900">
            <h3 className="text-xs font-bold uppercase text-slate-350 tracking-wide">Price Range ($)</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={() => applyFilters({ minPrice })}
                className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={() => applyFilters({ maxPrice })}
                className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-900">
            <h3 className="text-xs font-bold uppercase text-slate-350 tracking-wide">Minimum Rating</h3>
            <select
              value={minRating}
              onChange={(e) => {
                setMinRating(e.target.value);
                applyFilters({ minRating: e.target.value });
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3.0">3.0+ Stars</option>
            </select>
          </div>
        </div>

        {/* RIGHT COLUMN: Listings grid & sorting */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting & Result Counts Bar */}
          <div className="flex items-center justify-between gap-4 bg-slate-900/10 border border-slate-900 p-4 rounded-2xl text-xs">
            <span className="font-medium text-slate-450">
              Showing <span className="text-slate-200 font-bold">{loading ? "..." : products.length}</span> of{" "}
              <span className="text-slate-200 font-bold">{loading ? "..." : totalProducts}</span> products
            </span>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-1 bg-slate-800 text-slate-200 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
            >
              <SlidersHorizontal size={12} />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                  applyFilters({ sortBy: field, sortOrder: order });
                }}
                className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: Highest</option>
                <option value="views-desc">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* MOBILE FILTERS DRAWER (Overlay) */}
          {showMobileFilters && (
            <div className="lg:hidden bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-5 animate-in fade-in duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-200">Filters</span>
                <div className="flex gap-4">
                  <button onClick={handleClearFilters} className="text-[10px] text-rose-400 font-bold uppercase">Reset</button>
                  <button onClick={() => setShowMobileFilters(false)} className="text-[10px] text-violet-400 font-bold uppercase">Close</button>
                </div>
              </div>

              {/* Mobile Category */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase">Category</span>
                <select
                  value={category}
                  onChange={(e) => applyFilters({ category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="">All Categories</option>
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Condition */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Condition</span>
                <div className="flex gap-4">
                  {["new", "refurbished", "used"].map((cond) => (
                    <label key={cond} className="flex items-center gap-2 text-xs text-slate-350">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(cond)}
                        onChange={() => handleConditionChange(cond)}
                      />
                      <span className="capitalize">{cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Price Range</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onBlur={() => applyFilters({ minPrice })}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onBlur={() => applyFilters({ maxPrice })}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductSkeleton key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-3xl space-y-4">
              <Inbox className="h-12 w-12 text-slate-700 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300">No Listings Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No gadgets matched your specific filter properties. Try resetting the filters or broadening your search queries.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-900">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 flex items-center justify-center rounded-xl text-xs font-bold transition cursor-pointer ${
                      page === pageNum
                        ? "bg-violet-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ProductSkeleton key={idx} />
        ))}
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
