"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SlideData {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const slides: SlideData[] = [
  {
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80",
    title: "Next-Gen Computing Power",
    subtitle: "Explore high-end workstation laptops and ultraportable notebooks compiled for professionals.",
    ctaText: "Browse Laptops",
    ctaLink: "/products?category=Laptops",
  },
  {
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    title: "Flagship Mobile Devices",
    subtitle: "Experience cinematic cameras, high refresh rate displays, and long battery life.",
    ctaText: "Explore Phones",
    ctaLink: "/products?category=Smartphones",
  },
  {
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    title: "High-Fidelity Audio Gear",
    subtitle: "Immerse yourself in deep bass and active noise cancellation with premium audio hardware.",
    ctaText: "View Audio Devices",
    ctaLink: "/products?category=Audio",
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    title: "Wearables & Smart Living",
    subtitle: "Track your health metrics, sync notifications, and streamline your digital lifestyle.",
    ctaText: "Shop Smartwatches",
    ctaLink: "/products?category=Smartwatches",
  },
];

export default function BannerSlider() {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 4500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative overflow-hidden rounded-3xl mt-3 border border-slate-800 bg-slate-950 shadow-2xl h-[320px] sm:h-[380px] md:h-[450px]" ref={emblaRef}>
      <div className="flex h-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative min-w-0 flex-[0_0_100%] h-full">
            {/* Background Image */}
            <div className="absolute inset-0 bg-slate-950/70 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Slide Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-16 md:px-24 max-w-3xl space-y-4">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-100 tracking-tight leading-tight uppercase bg-gradient-to-r from-white via-slate-100 to-violet-400 bg-clip-text text-transparent">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-xl font-medium">
                {slide.subtitle}
              </p>
              <div className="pt-3">
                <Link href={slide.ctaLink}>
                  <button className="text-xs sm:text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-violet-900/30 cursor-pointer active:scale-95">
                    {slide.ctaText}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 p-2 sm:p-3 text-slate-300 hover:text-violet-400 transition shadow-lg cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 p-2 sm:p-3 text-slate-300 hover:text-violet-400 transition shadow-lg cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              selectedIndex === index ? "w-8 bg-violet-500" : "w-2 bg-slate-700 hover:bg-slate-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
