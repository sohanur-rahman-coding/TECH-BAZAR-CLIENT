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
  title: "Tech Bazaar | Premium Gadgets Marketplace",
  description: "Browse, buy, and list quality tech gadgets with full security, interactive ratings, and visual analytics.",
  keywords: "tech bazaar, marketplace, gadgets, buy laptops, sell phones",
  openGraph: {
    title: "Tech Bazaar | Premium Gadgets Marketplace",
    description: "Browse, buy, and list quality tech gadgets with full security.",
    url: "https://tech-bazaar.com",
    siteName: "Tech Bazaar",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Tech Bazaar",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.className} h-full antialiased`}>
      <body className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col selection:bg-violet-600 selection:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Toaster position="top-right" toastOptions={{
            duration: 4000,
            style: {
              background: "var(--toast-bg, #ffffff)",
              color: "var(--toast-color, #0f172a)",
              border: "1px solid var(--toast-border, #e2e8f0)",
            }
          }} />
          <Navbar />
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
