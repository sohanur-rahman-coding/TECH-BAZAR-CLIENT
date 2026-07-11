import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";
import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                TB
              </div>
              <span className="font-bold text-slate-100 text-lg tracking-tight">Tech Bazaar</span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              Discover quality gadgets at competitive prices. Experience fast shipping, secure escrow payments, and reliable support.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-800 p-2 hover:bg-slate-900 hover:text-violet-400 transition"
                aria-label="Facebook Link"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-800 p-2 hover:bg-slate-900 hover:text-violet-400 transition"
                aria-label="Instagram Link"
              >
                <BsInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-800 p-2 hover:bg-slate-900 hover:text-violet-400 transition"
                aria-label="Twitter Link"
              >
                <BsTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-800 p-2 hover:bg-slate-900 hover:text-violet-400 transition"
                aria-label="LinkedIn Link"
              >
                <LiaLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-200">
              Shop Categories
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=Laptops" className="hover:text-violet-400 transition">
                  High-End Laptops
                </Link>
              </li>
              <li>
                <Link href="/products?category=Smartphones" className="hover:text-violet-400 transition">
                  Flagship Smartphones
                </Link>
              </li>
              <li>
                <Link href="/products?category=Audio" className="hover:text-violet-400 transition">
                  Premium Audio
                </Link>
              </li>
              <li>
                <Link href="/products?category=Smartwatches" className="hover:text-violet-400 transition">
                  Smart Wearables
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-200">
              Information
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-violet-400 transition">
                  About Our Bazaar
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-violet-400 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-violet-400 transition">
                  Membership Pricing
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-violet-400 transition">
                  Explore Gadgets
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-200">
              Contact Us
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex gap-2.5 items-start">
                <MapPin className="h-4 w-4 shrink-0 text-violet-500 mt-0.5" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Phone className="h-4 w-4 shrink-0 text-violet-500" />
                <span>+880 1712-345678</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail className="h-4 w-4 shrink-0 text-violet-500" />
                <span>support@techbazaar.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-900 py-6 text-center text-xs md:flex-row text-slate-500">
          <p>© {new Date().getFullYear()} Tech Bazaar Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition">
              Terms of Service
            </Link>
            <Link href="/help" className="hover:text-slate-300 transition">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}