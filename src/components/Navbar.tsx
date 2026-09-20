"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiLogOut,
  BiPlusCircle,
  BiListUl,
  BiPackage,
} from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ShoppingBag, Tag, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

/* ─── Helpers ─── */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ─── Avatar ─── */
function UserAvatar({
  image,
  name,
  size = "sm",
}: {
  image?: string | null;
  name: string;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-violet-600 to-purple-700 border-2 border-violet-500/60 flex items-center justify-center overflow-hidden font-bold text-white uppercase flex-shrink-0 shadow-lg shadow-violet-900/30`}
    >
      {image && !imgError ? (
        <img
          src={image}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="select-none">{getInitials(name)}</span>
      )}
    </div>
  );
}

/* ─── Main Navbar ─── */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  // Read role stored by better-auth (server stores it on the user document)
  const role = (user as any)?.role as string | undefined;
  const isAdmin = role === "admin";
  const isSeller = role === "seller";

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Close mobile menu on route change is handled by Next.js or clicking links */

  const handleSignOut = async () => {
    try {
      setIsDropdownOpen(false);
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/");

  /* Nav links */
  const baseLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/products" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  if (user) {
    baseLinks.push({ label: "Dashboard", href: "/dashboard" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90 flex-shrink-0">
         <div className="relative flex ">
                                   <Image
                                     src="/transparent-background.png" // public ফোল্ডারের ইমেজ পাথ
                                     alt="Logo"
                                     width={40}
                                     height={40}
                                     className="z-10 object-contain"
                                   />
                                 </div>
          <p className="font-black text-lg tracking-tight bg-gradient-to-r from-violet-600 to-violet-400 dark:from-slate-100 dark:to-violet-400 bg-clip-text text-transparent">
            Tech Bazaar
          </p>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-6 md:flex text-sm">
          {baseLinks.map((link) => (
            <li key={link.href} className="relative">
              <Link
                href={link.href}
                className={`relative px-1 py-2 font-medium transition duration-300 hover:text-violet-600 dark:hover:text-violet-400 ${isActive(link.href) ? "text-violet-600 dark:text-violet-400" : "text-slate-600 dark:text-slate-300"
                  }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}


        </ul>

        {/* Right: Auth section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* ── Not logged in ── */}
          {!user && !isPending && (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/signin"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition"
              >
                Login
              </Link>
              <Link href="/signup">
                <button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs h-9 px-4 cursor-pointer transition active:scale-95 shadow-md shadow-violet-500/10">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {/* ── Loading skeleton ── */}
          {isPending && (
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
          )}

          {/* ── Logged in: Avatar + Dropdown ── */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar trigger button */}
              <button
                onClick={() => setIsDropdownOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition duration-200 cursor-pointer group"
                aria-label="User menu"
              >
                <UserAvatar image={user.image} name={user.name} />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 leading-tight">
                    {user.name.split(" ")[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize leading-tight">
                    {isAdmin ? "Admin" : isSeller ? "Seller" : "Buyer"}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-50"
                  >

                    {/* User Header */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                      <UserAvatar image={user.image} name={user.name} size="md" />
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        <span
                          className={`mt-1 inline-flex w-fit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${isAdmin
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20"
                              : isSeller
                                ? "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20"
                            }`}
                        >
                          {isAdmin ? "👑 Admin" : isSeller ? "⚡ Seller" : "🛍 Buyer"}
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-0.5">

                      {/* Dashboard */}
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-400 transition w-full"
                      >
                        <MdDashboard className="text-base text-violet-600 dark:text-violet-400 flex-shrink-0" />
                        <span>Dashboard</span>
                      </Link>

                      {/* Divider */}
                      <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                      {/* Logout */}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition w-full text-left cursor-pointer font-medium"
                      >
                        <BiLogOut className="text-base flex-shrink-0" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl transition-colors">
          {/* Mobile user info bar */}
          {user && (
            <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
              <UserAvatar image={user.image} name={user.name} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                <span className={`text-[9px] font-bold uppercase ${isAdmin ? "text-rose-600 dark:text-rose-400" : isSeller ? "text-violet-600 dark:text-violet-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {isAdmin ? "👑 Admin Account" : isSeller ? "⚡ Seller Account" : "🛍 Buyer Account"}
                </span>
              </div>
            </div>
          )}

          <ul className="flex flex-col gap-0.5 p-3 text-sm font-medium">
            {baseLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-violet-600 dark:hover:text-violet-400 transition ${isActive(link.href) ? "bg-slate-100 dark:bg-slate-900/50 text-violet-600 dark:text-violet-400 font-bold" : "text-slate-700 dark:text-slate-300"
                    }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Mobile logout */}
            {user && (
              <li className="mt-2 border-t border-slate-200 dark:border-slate-800 pt-2">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 py-2.5 px-3 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer font-semibold"
                >
                  <BiLogOut /> <span>Logout</span>
                </button>
              </li>
            )}

            {/* Mobile login/signup */}
            {!user && !isPending && (
              <li className="mt-3 border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-col gap-2">
                <Link
                  href="/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center py-2.5 text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 font-semibold"
                >
                  Login
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl py-2.5 text-sm cursor-pointer transition">
                    Sign Up
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
