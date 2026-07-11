"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import BannerSlider from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Product } from "@/types";
import {
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  ShieldCheck,
  Zap,
  Users,
  Compass,
  Star,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await fetch(`${SERVER_URL}/api/products?limit=4`);
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Subscribed successfully! Welcome to Tech Bazaar newsletter.");
    setEmail("");
  };

  const categories = [
    { name: "Laptops", count: "120+ Listings", icon: <Laptop className="h-6 w-6" />, href: "/products?category=Laptops" },
    { name: "Smartphones", count: "250+ Listings", icon: <Smartphone className="h-6 w-6" />, href: "/products?category=Smartphones" },
    { name: "Audio", count: "90+ Listings", icon: <Headphones className="h-6 w-6" />, href: "/products?category=Audio" },
    { name: "Smartwatches", count: "70+ Listings", icon: <Watch className="h-6 w-6" />, href: "/products?category=Smartwatches" },
  ];

  const stats = [
    { label: "Active Listings", value: "1,200+", detail: "Daily gadgets listed" },
    { label: "Escrow Secured", value: "100%", detail: "Buyer guarantee plan" },
    { label: "Verified Users", value: "24,000+", detail: "Buyers & sellers" },
    { label: "Fast Shipping", value: "2-3 Days", detail: "Across all districts" },
  ];

  const benefits = [
    {
      title: "Secure Verification",
      description: "We verify listings and seller profiles to ensure you get genuine tech gadgets without worry.",
      icon: <ShieldCheck className="h-7 w-7 text-violet-400" />,
    },
    {
      title: "Instant Listing Tool",
      description: "List your unused electronics in less than 60 seconds with our intuitive item creation system.",
      icon: <Zap className="h-7 w-7 text-violet-400" />,
    },
    {
      title: "Interactive Escrow",
      description: "Payments are held securely in escrow and only released once you inspect and approve the item.",
      icon: <BookmarkCheck className="h-7 w-7 text-violet-400" />,
    },
    {
      title: "District Logistics",
      description: "Fast deliveries and pickup hubs across 64 districts with full package insurance support.",
      icon: <Compass className="h-7 w-7 text-violet-400" />,
    },
  ];

  const testimonials = [
    {
      name: "Sajjad Hossain",
      role: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      content: "Found a flagship laptop in pristine condition for 35% less than retail price. The escrow service gave me complete peace of mind.",
      rating: 5,
    },
    {
      name: "Nusrat Jahan",
      role: "UI/UX Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      content: "Selling my smartphone was incredibly fast. I listed it in under a minute, got three inquiries the next day, and finalized the sale.",
      rating: 5,
    },
    {
      name: "Rifat Chowdhury",
      role: "Tech Enthusiast",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      content: "Great support, genuine products, and very fast shipping. The dashboard interface is beautiful and so easy to use.",
      rating: 4,
    },
  ];

  const blogs = [
    {
      title: "Choosing the Right Laptop for Coding in 2026",
      category: "Guides",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
      link: "/blog/coding-laptops",
      date: "Jul 10, 2026",
    },
    {
      title: "Why Refurbished Flagships Are Dominating the Market",
      category: "Tech Trends",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
      link: "/blog/refurbished-phones",
      date: "Jul 05, 2026",
    },
    {
      title: "ANC vs ENC: Sound Cancellation Formats Explained",
      category: "Audio",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
      link: "/blog/audio-guides",
      date: "Jun 28, 2026",
    },
  ];

  return (
    <div className="space-y-20">
      
      {/* 1. Hero Carousel */}
      <section className="relative">
        <BannerSlider />
      </section>

      {/* 2. Categories Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
            Browse by Category
          </h2>
          <p className="text-sm text-slate-400">
            Find specialized devices sorted by hardware configurations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href}>
              <div className="flex flex-col items-center justify-center p-6 bg-slate-900/30 border border-slate-800 rounded-2xl text-center group hover:border-violet-500/50 hover:bg-slate-900/60 transition duration-300 h-full">
                <div className="p-4 bg-slate-950 rounded-2xl text-violet-400 group-hover:text-violet-300 group-hover:scale-110 transition duration-300 border border-slate-800 shadow-md">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-200 mt-4 group-hover:text-violet-400 transition">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-500 mt-1 uppercase font-medium">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-900 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
              Featured Highlights
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top reviewed and recently listed hardware on Tech Bazaar.
            </p>
          </div>
          <Link href="/products" className="group flex items-center gap-1.5 text-sm font-semibold text-violet-400 hover:text-violet-300">
            <span>Explore All</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/10 border border-slate-850 rounded-3xl">
            <TrendingUp className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300">No Featured Gadgets Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">Be the first to list a premium tech gadget!</p>
            <Link href="/items/add">
              <button className="bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white px-5 py-2.5 rounded-xl cursor-pointer">
                Create Listing
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Stats Section */}
      <section className="bg-gradient-to-r from-violet-950/20 via-slate-900/30 to-violet-950/20 border border-slate-800/80 rounded-3xl p-8 md:p-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2">
              <span className="block text-3xl md:text-4xl font-extrabold text-violet-400">{stat.value}</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{stat.label}</h3>
              <p className="text-[11px] text-slate-500">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Benefits Section */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
            Designed for Tech Trade
          </h2>
          <p className="text-sm text-slate-400">
            A comprehensive trade system custom-built for high-end electronics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex flex-col p-6 bg-slate-900/20 border border-slate-800/60 rounded-2xl shadow-sm hover:border-violet-500/30 transition-all duration-300">
              <div className="p-3 bg-slate-950 rounded-xl w-fit border border-slate-800 shadow-sm mb-4">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-slate-200 text-base mb-2">{benefit.title}</h3>
              <p className="text-xs text-slate-450 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
            Trust & Customer Success
          </h2>
          <p className="text-sm text-slate-400">
            See how buyers and sellers rates their platform experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div key={idx} className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  {Array.from({ length: 5 - test.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-slate-700" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{test.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 border-t border-slate-800/50 pt-4">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="h-9 w-9 rounded-full object-cover border border-slate-800"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{test.name}</h4>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Blogs Section */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
            Bazaar Insights & Tech News
          </h2>
          <p className="text-sm text-slate-400">
            Guides, trends and tutorials written by hardware professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog, idx) => (
            <div key={idx} className="group bg-slate-900/20 border border-slate-800 hover:border-violet-500/30 rounded-2xl overflow-hidden transition-all duration-300">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span className="text-violet-400">{blog.category}</span>
                  <span>{blog.date}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-200 leading-snug group-hover:text-violet-400 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-violet-400 transition flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
            Frequently Answered FAQ
          </h2>
          <p className="text-sm text-slate-400">
            Answers to common questions about trade operations.
          </p>
        </div>

        <div className="space-y-4">
          <details className="group bg-slate-900/20 border border-slate-800 rounded-2xl p-5 cursor-pointer">
            <summary className="font-bold text-sm text-slate-200 flex justify-between items-center list-none">
              <span>How does the escrow buyer protection plan work?</span>
              <span className="transition duration-300 group-open:rotate-180 text-violet-400">+</span>
            </summary>
            <p className="text-xs text-slate-400 leading-relaxed mt-3 pt-3 border-t border-slate-800/40">
              When a buyer purchases an item, their payment is secured in Tech Bazaar's escrow holding. The seller ships the gadget. Once delivered, the buyer has 48 hours to inspect the item. After inspection confirmation, the funds are released to the seller.
            </p>
          </details>

          <details className="group bg-slate-900/20 border border-slate-800 rounded-2xl p-5 cursor-pointer">
            <summary className="font-bold text-sm text-slate-200 flex justify-between items-center list-none">
              <span>Can I edit or delete my gadgets after listing them?</span>
              <span className="transition duration-300 group-open:rotate-180 text-violet-400">+</span>
            </summary>
            <p className="text-xs text-slate-400 leading-relaxed mt-3 pt-3 border-t border-slate-800/40">
              Yes, absolutely. By navigating to the "Manage Listings" page, you can see all your listed products. You can edit parameters (price, specifications, photos) or delete the listing entirely at any time.
            </p>
          </details>

          <details className="group bg-slate-900/20 border border-slate-800 rounded-2xl p-5 cursor-pointer">
            <summary className="font-bold text-sm text-slate-200 flex justify-between items-center list-none">
              <span>Are there listing fees on Tech Bazaar?</span>
              <span className="transition duration-300 group-open:rotate-180 text-violet-400">+</span>
            </summary>
            <p className="text-xs text-slate-400 leading-relaxed mt-3 pt-3 border-t border-slate-800/40">
              Basic listings are 100% free of charge. We offer premium subscription plans for pro sellers who want unlimited listings, analytics dashboards, and highlighted category placements.
            </p>
          </details>
        </div>
      </section>

      {/* 9. Newsletter Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/60 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 md:p-16 text-center space-y-6">
        <div className="absolute top-0 right-0 h-40 w-40 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-violet-600/10 rounded-full blur-3xl" />
        
        <div className="max-w-xl mx-auto space-y-3 relative z-10">
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Newsletter
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Never Miss Out on Tech Deals
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Subscribe to our weekly dispatch of newly added items, price drops, and member-exclusive discount alerts.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-grow bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition"
          />
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-6 py-3 text-xs transition duration-200 shadow-md shadow-violet-900/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Send size={14} />
            <span>Subscribe</span>
          </button>
        </form>
      </section>

    </div>
  );
}
