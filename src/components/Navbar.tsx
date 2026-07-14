"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
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
    pathname === path || pathname.startsWith(path + "/");

  /* Nav links */
  const baseLinks = [
    { label: "Explore", href: "/products" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  /* Seller-only header links */
  const sellerNavLinks = [
    { label: "Add Item", href: "/items/add" },
    { label: "Manage", href: "/items/manage" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <div className="w-full">
      {/* ── Top Announcement Banner ── */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-violet-950 overflow-hidden py-1.5 border-b border-violet-900/20">
        <div
          className="inline-block whitespace-nowrap text-xs font-semibold text-violet-300"
          style={{ animation: "marquee-scroll 35s linear infinite" }}
        >
          🎉 Avail Up to 4% Extra Discount with Bank Transfer &nbsp;&nbsp;|&nbsp;&nbsp; 💳 Cash on Delivery Available &nbsp;&nbsp;|&nbsp;&nbsp; 🚚 Fast Delivery in 2–3 Days &nbsp;&nbsp;|&nbsp;&nbsp; 🎉 Avail Up to 4% Extra Discount with Bank Transfer &nbsp;&nbsp;|&nbsp;&nbsp; 💳 Cash on Delivery Available &nbsp;&nbsp;|&nbsp;&nbsp; 🚚 Fast Delivery in 2–3 Days
        </div>
        <style>{`
          @keyframes marquee-scroll {
            0%   { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>

      {/* ── Sticky Main Nav ── */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
        <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90 flex-shrink-0">
            <div className="relative h-9 w-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/30 overflow-hidden">
              <Image
                fill
                sizes="36px"
                loading="eager"
                src="/logo.webp"
                alt="logo"
                className="object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <span className="font-extrabold text-white text-lg select-none z-10">TB</span>
            </div>
            <p className="font-black text-lg tracking-tight bg-gradient-to-r from-slate-100 to-violet-400 bg-clip-text text-transparent">
              Tech Bazaar
            </p>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-5 md:flex text-sm">
            {baseLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-medium transition duration-200 hover:text-violet-400 ${
                    isActive(link.href) ? "text-violet-400" : "text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Seller & Admin desktop links */}
            {user && (isSeller || isAdmin) &&
              sellerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-medium transition duration-200 hover:text-violet-400 ${
                      isActive(link.href) ? "text-violet-400" : "text-slate-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>

          {/* Right: Auth section */}
          <div className="flex items-center gap-3">

            {/* ── Not logged in ── */}
            {!user && !isPending && (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/signin"
                  className="text-sm font-semibold text-slate-300 hover:text-violet-400 transition"
                >
                  Login
                </Link>
                <Link href="/signup">
                  <button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs h-9 px-4 cursor-pointer transition active:scale-95 shadow-md shadow-violet-900/20">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            {/* ── Loading skeleton ── */}
            {isPending && (
              <div className="hidden md:flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-slate-800 animate-pulse" />
              </div>
            )}

            {/* ── Logged in: Avatar + Dropdown ── */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar trigger button */}
                <button
                  onClick={() => setIsDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-800/60 transition duration-200 cursor-pointer group"
                  aria-label="User menu"
                >
                  <UserAvatar image={user.image} name={user.name} />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-200 leading-tight">
                      {user.name.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize leading-tight">
                      {isAdmin ? "Admin" : isSeller ? "Seller" : "Buyer"}
                    </p>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-500 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Panel */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">

                    {/* User Header */}
                    <div className="flex items-center gap-3 p-4 bg-slate-950/50 border-b border-slate-800">
                      <UserAvatar image={user.image} name={user.name} size="md" />
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-bold text-slate-100 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span
                          className={`mt-1 inline-flex w-fit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isAdmin 
                              ? "bg-rose-950/60 text-rose-300 border-rose-800/50"
                              : isSeller
                              ? "bg-violet-950/60 text-violet-300 border-violet-800/50"
                              : "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                          }`}
                        >
                          {isAdmin ? "👑 Admin" : isSeller ? "⚡ Seller" : "🛍 Buyer"}
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-0.5">

                      {/* Dashboard — all users */}
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-violet-400 transition w-full"
                      >
                        <MdDashboard className="text-base text-violet-400 flex-shrink-0" />
                        <span>Dashboard</span>
                      </Link>

                      {/* Buyer-only: My Purchases */}
                      {!isSeller && (
                        <Link
                          href="/products"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-violet-400 transition w-full"
                        >
                          <ShoppingBag size={15} className="text-violet-400 flex-shrink-0" />
                          <span>Browse Products</span>
                        </Link>
                      )}

                      {/* Seller-only: Manage & Add */}
                      {isSeller && (
                        <>
                          <Link
                            href="/items/manage"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-violet-400 transition w-full"
                          >
                            <BiListUl className="text-base text-violet-400 flex-shrink-0" />
                            <span>Manage Listings</span>
                          </Link>

                          <Link
                            href="/items/add"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-violet-400 transition w-full"
                          >
                            <BiPlusCircle className="text-base text-violet-400 flex-shrink-0" />
                            <span>Add New Gadget</span>
                          </Link>
                        </>
                      )}

                      {/* Pricing */}
                      <Link
                        href="/pricing"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-violet-400 transition w-full"
                      >
                        <Tag size={15} className="text-violet-400 flex-shrink-0" />
                        <span>Pricing Plans</span>
                      </Link>

                      {/* Divider */}
                      <div className="border-t border-slate-800 my-1" />

                      {/* Logout */}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition w-full text-left cursor-pointer"
                      >
                        <BiLogOut className="text-base flex-shrink-0" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Mobile Hamburger ── */}
            <button
              className="md:hidden text-slate-300 hover:text-violet-400 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer transition"
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
        </header>

        {/* ── Mobile Menu ── */}
        {isMenuOpen && (
          <div className="border-t border-slate-800 md:hidden bg-slate-950/95 backdrop-blur-xl">
            {/* Mobile user info bar */}
            {user && (
              <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/30">
                <UserAvatar image={user.image} name={user.name} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-100 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className={`text-[9px] font-bold uppercase ${isAdmin ? "text-rose-400" : isSeller ? "text-violet-400" : "text-emerald-400"}`}>
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
                    className={`flex items-center py-2.5 px-3 rounded-xl hover:bg-slate-900 hover:text-violet-400 transition ${
                      isActive(link.href) ? "bg-slate-900/50 text-violet-400" : "text-slate-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Seller & Admin mobile links */}
              {user && (isSeller || isAdmin) && (
                <>
                  <li className="pt-2">
                    <p className="px-3 pb-1 text-[10px] font-bold uppercase text-slate-600 tracking-widest">{isAdmin ? "Admin Tools" : "Seller Tools"}</p>
                  </li>
                  {isSeller && (
                    <>
                      <li>
                        <Link
                          href="/items/add"
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-slate-900 hover:text-violet-400 transition ${isActive("/items/add") ? "bg-slate-900/50 text-violet-400" : "text-slate-300"}`}
                        >
                          <BiPlusCircle /> <span>Add Item</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/items/manage"
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-slate-900 hover:text-violet-400 transition ${isActive("/items/manage") ? "bg-slate-900/50 text-violet-400" : "text-slate-300"}`}
                        >
                          <BiListUl /> <span>Manage Listings</span>
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-slate-900 hover:text-violet-400 transition ${isActive("/dashboard") ? "bg-slate-900/50 text-violet-400" : "text-slate-300"}`}
                    >
                      <MdDashboard /> <span>Dashboard</span>
                    </Link>
                  </li>
                </>
              )}

              {/* Mobile logout */}
              {user && (
                <li className="mt-2 border-t border-slate-800 pt-2">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 py-2.5 px-3 rounded-xl text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition cursor-pointer"
                  >
                    <BiLogOut /> <span>Logout</span>
                  </button>
                </li>
              )}

              {/* Mobile login/signup */}
              {!user && !isPending && (
                <li className="mt-3 border-t border-slate-800 pt-3 flex flex-col gap-2">
                  <Link
                    href="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-2.5 text-slate-300 hover:text-violet-400 font-semibold"
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
      </nav>
    </div>
  );
};

export default Navbar;
