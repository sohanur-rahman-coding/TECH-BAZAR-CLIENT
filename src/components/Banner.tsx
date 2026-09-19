"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Zap, ArrowRight, Star, Laptop, Smartphone, Headphones, Watch } from "lucide-react";

interface HeroSlide {
  id: string;
  category: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  image: string;
  ctaText: string;
  ctaLink: string;
  icon: React.ReactNode;
}

const heroSlides: HeroSlide[] = [
  {
    id: "laptops",
    category: "Laptops & Workstations",
    badge: "🔥 Top Trending",
    title: "Unleash Ultimate",
    highlight: "Power & Speed",
    description: "Discover M3 Max & RTX 4090 laptops engineered for heavy compilation, 3D rendering, and pro gaming.",
    price: "$1,499",
    originalPrice: "$1,899",
    rating: 4.9,
    reviews: 1280,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80",
    ctaText: "Explore Laptops",
    ctaLink: "/products?category=Laptops",
    icon: <Laptop className="h-4 w-4" />,
  },
  {
    id: "smartphones",
    category: "Flagship Smartphones",
    badge: "⚡ New Arrival",
    title: "Cinematic Cameras &",
    highlight: "All-Day Performance",
    description: "Trade-in or buy top flagship smartphones with 120Hz OLED displays, 200MP zoom, and verified battery health.",
    price: "$899",
    originalPrice: "$1,099",
    rating: 4.8,
    reviews: 950,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
    ctaText: "Discover Phones",
    ctaLink: "/products?category=Smartphones",
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: "audio",
    category: "Premium Audio Systems",
    badge: "🎧 Studio Grade",
    title: "Pure Spatial Audio &",
    highlight: "Active Noise Cancel",
    description: "Immerse yourself in loss-less acoustics with high-res wireless headphones and audiophile gear.",
    price: "$349",
    originalPrice: "$449",
    rating: 4.95,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
    ctaText: "Shop Sound Systems",
    ctaLink: "/products?category=Audio",
    icon: <Headphones className="h-4 w-4" />,
  },
  {
    id: "smartwatches",
    category: "Smart Wearables",
    badge: "⌚ Health Trackers",
    title: "Smart Fitness &",
    highlight: "Real-Time Metrics",
    description: "Track titanium GPS coordinates, ECG heart monitors, and notification syncing on sleek OLED watches.",
    price: "$279",
    originalPrice: "$349",
    rating: 4.7,
    reviews: 840,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    ctaText: "View Smartwatches",
    ctaLink: "/products?category=Smartwatches",
    icon: <Watch className="h-4 w-4" />,
  },
];

export default function BannerSlider() {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Advanced Mouse Parallax Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D rotations
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });
  
  // Smooth springs for translation (parallax depth)
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), { stiffness: 150, damping: 20 });
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Auto slide ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[activeIdx];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-[2.5rem] overflow-hidden mt-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 md:p-14 min-h-[440px] md:min-h-[540px] flex flex-col justify-between"
      style={{ perspective: 1200 }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 dark:from-violet-600/10 dark:via-transparent dark:to-indigo-600/10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container - Applies global 3D rotation */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center h-full my-auto"
      >
        {/* LEFT COLUMN: Hero Copywriting */}
        <div className="lg:col-span-7 space-y-6 text-left" style={{ transform: "translateZ(30px)" }}>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{slide.badge}</span>
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
              {slide.icon}
              <span>{slide.category}</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-title"}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-1"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                {slide.title}{" "}
                <span className="block mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {slide.highlight}
                </span>
              </h1>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={slide.id + "-desc"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm md:text-base text-slate-600 dark:text-slate-350 leading-relaxed max-w-lg font-medium"
            >
              {slide.description}
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">{slide.price}</span>
              <span className="text-sm sm:text-base line-through text-slate-400 dark:text-slate-500 font-bold">{slide.originalPrice}</span>
            </div>
            <div className="h-8 w-[2px] bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{slide.rating}</span>
              <span className="text-xs text-slate-500 font-semibold">({slide.reviews}+)</span>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Link href={slide.ctaLink}>
              <button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl shadow-slate-900/20 dark:shadow-white/10 flex items-center gap-2 transition active:scale-95 group">
                <span>{slide.ctaText}</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="/products">
              <button className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-200 font-bold text-xs sm:text-sm px-7 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 transition active:scale-95">
                View All
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Image Card */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-center h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-image-container"}
              initial={{ opacity: 0, scale: 0.9, rotateY: 15, z: -100 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: -15, z: -100 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              style={{ x: translateX, y: translateY, transformStyle: "preserve-3d" }}
              className="relative w-full max-w-sm sm:max-w-md aspect-[4/3] sm:aspect-square rounded-[2rem] overflow-hidden border border-white/40 dark:border-slate-700/50 shadow-2xl group"
            >
              {/* The Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Inner Glow / Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

              {/* Floating Element 1 (Top Left) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "translateZ(60px)" }}
                className="absolute top-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Escrow Secured</span>
              </motion.div>

              {/* Floating Element 2 (Bottom Right) */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ transform: "translateZ(80px)" }}
                className="absolute bottom-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-2xl flex items-center gap-3"
              >
                <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Fast Delivery</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">2-3 Days</span>
                </div>
              </motion.div>

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* FOOTER CONTROLS: Category Pills & Carousel Nav */}
      <div className="relative z-20 pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6" style={{ transform: "translateZ(20px)" }}>
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
          {heroSlides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveIdx(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeIdx === idx
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md shadow-slate-900/10 dark:shadow-white/10 scale-105"
                  : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:scale-105"
              }`}
            >
              {s.icon}
              <span>{s.category.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Arrow Controls & Indicators */}
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIdx === idx ? "w-8 bg-slate-900 dark:bg-white" : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveIdx((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
              className="p-3 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 shadow-sm hover:scale-110 transition cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setActiveIdx((prev) => (prev + 1) % heroSlides.length)}
              className="p-3 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 shadow-sm hover:scale-110 transition cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
