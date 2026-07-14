"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { PlusCircle, Plus, Trash2, Sparkles, Send, ShieldAlert } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";

interface SpecItem {
  key: string;
  value: string;
}

export default function AddItemPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = (user as any)?.role as string | undefined;
  const isSeller = role === "seller";

  // Form Fields State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Laptops");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("new");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [specifications, setSpecifications] = useState<SpecItem[]>([
    { key: "brand", value: "" },
    { key: "model", value: "" },
  ]);

  const [loading, setLoading] = useState(false);

  // Specifications helpers
  const handleAddSpec = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, idx) => idx !== index));
  };

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specifications];
    updated[index][field] = val;
    setSpecifications(updated);
  };

  // Auto-populate for test efficiency
  const handleAutofill = () => {
    setTitle("MacBook Pro 16 M3 Max");
    setCategory("Laptops");
    setBrand("Apple");
    setPrice("3200");
    setCondition("new");
    setLocation("Gulshan, Dhaka");
    setImageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80");
    setShortDescription("Latest MacBook Pro with Apple M3 Max chip, 36GB unified memory, and 1TB SSD storage.");
    setDescription(
      "This is a brand new Apple MacBook Pro 16-inch featuring the high-performance M3 Max chip (14-core CPU, 30-core GPU). Includes original box and packing materials. Liquid Retina XDR display offers beautiful contrast. Full local reseller warranty included."
    );
    setSpecifications([
      { key: "Processor", value: "Apple M3 Max" },
      { key: "RAM", value: "36GB Unified Memory" },
      { key: "Storage", value: "1TB SSD" },
      { key: "Display", value: "16.2-inch Liquid Retina XDR" },
      { key: "Battery Health", value: "100%" },
    ]);
    toast.success("Form autofilled with test gadget parameters!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !brand || !price || !location || !imageUrl || !shortDescription || !description) {
      toast.error("Please fill in all required form fields");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Price must be a positive number");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Adding gadget listing...");

    try {
      const res = await fetch(`${SERVER_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          category,
          brand,
          price: parsedPrice,
          shortDescription,
          description,
          imageUrl,
          location,
          condition,
          specifications: specifications.filter(s => s.key && s.value),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Listing created successfully!", { id: toastId });
        router.push("/items/manage");
      } else {
        toast.error(data.message || "Failed to create listing", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error: Could not reach backend server", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /* ─── Loading ─── */
  if (isPending) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 py-4 animate-pulse">
        <div className="h-8 bg-slate-900 rounded w-1/3" />
        <div className="h-96 bg-slate-900 rounded-3xl" />
      </div>
    );
  }

  /* ─── Not logged in ─── */
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <ShieldAlert size={48} className="text-slate-600" />
        <h2 className="text-xl font-black uppercase text-slate-200">Login Required</h2>
        <p className="text-xs text-slate-400 max-w-xs">You must be signed in to create a listing.</p>
        <Link href="/signin">
          <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition">
            Sign In
          </button>
        </Link>
      </div>
    );
  }

  /* ─── Buyer trying to access seller page ─── */
  if (!isSeller) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <ShieldAlert size={48} className="text-amber-500" />
        <h2 className="text-xl font-black uppercase text-slate-200">Seller Access Only</h2>
        <p className="text-xs text-slate-400 max-w-xs">
          Only seller accounts can list products. Upgrade your account on the Pricing page to become a seller.
        </p>
        <div className="flex gap-3">
          <Link href="/pricing">
            <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition">
              View Pricing
            </button>
          </Link>
          <Link href="/products">
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl px-6 py-2.5 text-xs cursor-pointer transition">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-2">
            <PlusCircle className="text-violet-500" />
            <span>List A New Gadget</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Publish hardware listings with full pricing and tech specifications.</p>
        </div>

        {/* Auto fill Action */}
        <button
          type="button"
          onClick={handleAutofill}
          className="flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-violet-400 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition active:scale-95 shadow-sm"
        >
          <Sparkles size={14} className="text-violet-400" />
          <span>Demo Autofill</span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/10 border border-slate-900 p-6 sm:p-8 rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-1 md:col-span-2">
            <label className="block text-[10px] text-slate-500 uppercase font-semibold">Product Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dell XPS 15 9530 / iPhone 15 Pro Max"
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 uppercase font-semibold">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
            >
              <option value="Laptops">Laptops</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Audio">Audio</option>
              <option value="Smartwatches">Smartwatches</option>
              <option value="Monitors">Monitors</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Brand */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 uppercase font-semibold">Hardware Brand *</label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Apple, Sony, Logitech"
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 uppercase font-semibold">Price (USD $) *</label>
            <input
              type="number"
              required
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 899"
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* Condition */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 uppercase font-semibold">Gadget Condition *</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
            >
              <option value="new">Brand New (Sealed)</option>
              <option value="refurbished">Refurbished (A-grade)</option>
              <option value="used">Used (Like New / Fair)</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 uppercase font-semibold">Pickup Location *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Banani, Dhaka"
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 uppercase font-semibold">Image URL *</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* Short Description */}
          <div className="space-y-1 md:col-span-2">
            <label className="block text-[10px] text-slate-500 uppercase font-semibold">Short Description (Cards view) *</label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief summary showing card features..."
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* Full Description */}
          <div className="space-y-1 md:col-span-2">
            <label className="block text-[10px] text-slate-500 uppercase font-semibold">Full Description Overview *</label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide clean and detailed information about the hardware specs, condition, or package content..."
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl p-4 text-xs text-slate-200 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Dynamic Specifications Block */}
        <div className="space-y-4 pt-6 border-t border-slate-900">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide">Detailed Specifications</label>
            <button
              type="button"
              onClick={handleAddSpec}
              className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 font-bold uppercase transition bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <Plus size={12} />
              <span>Add Spec Row</span>
            </button>
          </div>

          {specifications.length > 0 ? (
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                    placeholder="e.g. CPU / RAM / Storage"
                    className="w-1/2 bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    placeholder="e.g. M3 Max / 32GB"
                    className="w-1/2 bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="p-2 text-rose-400 hover:text-rose-350 hover:bg-slate-900/50 rounded-xl transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No specific specs added. Click 'Add Spec Row' to supply technical metrics.</p>
          )}
        </div>

        {/* Submit action */}
        <div className="pt-6 border-t border-slate-900">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl py-3.5 text-xs transition duration-200 shadow-md shadow-violet-900/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send size={14} />
            <span>{loading ? "Adding Gadget..." : "Create Gadget Listing"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
