import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Tech Bazaar - Professional Gadgets Marketplace",
  description: "Browse, buy, and list quality tech gadgets with full security, interactive ratings, and visual analytics.",
  keywords: "tech bazaar, marketplace, gadgets, buy laptops, sell phones, dynamic dashboard, recharts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased dark:bg-slate-950 text-slate-100`}>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-violet-600 selection:text-white">
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #334155"
          }
        }} />
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
