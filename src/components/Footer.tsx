import Link from "next/link";
import { Mail, Phone, MapPin, Cpu } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";
import React from "react";

const footerLinks = {
  shop: [
    { label: "High-End Laptops", href: "/products?category=Laptops" },
    { label: "Flagship Smartphones", href: "/products?category=Smartphones" },
    { label: "Premium Audio", href: "/products?category=Audio" },
    { label: "Smart Wearables", href: "/products?category=Smartwatches" },
  ],
  info: [
    { label: "About Our Bazaar", href: "/about" },
    { label: "Contact Support", href: "/contact" },
    { label: "Membership Pricing", href: "/pricing" },
    { label: "Explore Gadgets", href: "/products" },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-500/20 overflow-hidden flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="16" height="16" x="4" y="4" rx="2" />
                  <rect width="6" height="6" x="9" y="9" rx="1" />
                  <path d="M15 2v2" /><path d="M15 20v2" />
                  <path d="M2 15h2" /><path d="M2 9h2" />
                  <path d="M20 15h2" /><path d="M20 9h2" />
                  <path d="M9 2v2" /><path d="M9 20v2" />
                </svg>
              </div>
              <p className="font-black text-lg tracking-tight bg-gradient-to-r from-violet-600 to-violet-400 dark:from-slate-100 dark:to-violet-400 bg-clip-text text-transparent">
                Tech Bazaar
              </p>
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Discover quality gadgets at competitive prices. Experience fast shipping, secure escrow payments, and reliable support.
            </p>

            <div className="flex items-center gap-3">
              {[
                { href: "https://facebook.com", Icon: FaFacebook, label: "Facebook" },
                { href: "https://instagram.com", Icon: BsInstagram, label: "Instagram" },
                { href: "https://twitter.com", Icon: BsTwitter, label: "Twitter" },
                { href: "https://linkedin.com", Icon: LiaLinkedin, label: "LinkedIn" },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`${label} Link`}
                  className="rounded-full border border-slate-200 dark:border-slate-800 p-2 text-slate-500 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-slate-900 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 transition duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Shop Categories</h3>
            <ul className="space-y-2 text-xs">
              {footerLinks.shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Information</h3>
            <ul className="space-y-2 text-xs">
              {footerLinks.info.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Contact Us</h3>
            <div className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex gap-2.5 items-start">
                <MapPin className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-500 mt-0.5" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Phone className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-500" />
                <span>+880 1712-345678</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-500" />
                <span>support@techbazaar.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs md:flex-row text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Tech Bazaar Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Help Center", href: "/help" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-slate-700 dark:hover:text-slate-300 transition">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}