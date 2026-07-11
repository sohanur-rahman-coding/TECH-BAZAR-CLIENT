"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, LogIn, ShieldAlert, ArrowRight, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Authenticating...");

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Successfully logged in!", { id: toastId });
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to sign in", { id: toastId });
          setLoading(false);
        },
      }
    );
  };

  // Bulletproof Demo login helper
  const handleDemoLogin = async (demoEmail: string, role: string) => {
    setDemoLoading(true);
    const toastId = toast.loading(`Accessing demo as ${role}...`);
    const demoPassword = "Password123";
    const name = role === "seller" ? "Demo Seller" : "Demo Buyer";

    // 1. Try to register the user first
    await (authClient.signUp.email as any)(
      {
        email: demoEmail,
        password: demoPassword,
        name,
        role,
        plan: "free",
      },
      {
        onSuccess: async () => {
          // Success signup, now sign in
          await authClient.signIn.email(
            {
              email: demoEmail,
              password: demoPassword,
              callbackURL: "/",
            },
            {
              onSuccess: () => {
                toast.success(`Demo registration success. Logged in as ${role}!`, { id: toastId });
                router.push("/");
                router.refresh();
              },
              onError: (ctx) => {
                toast.error(ctx.error.message || "Demo sign in failed", { id: toastId });
                setDemoLoading(false);
              },
            }
          );
        },
        onError: async (ctx) => {
          // If already registered, simply sign in directly
          if (ctx.error.message?.toLowerCase().includes("already") || ctx.error.status === 422 || ctx.error.status === 400) {
            await authClient.signIn.email(
              {
                email: demoEmail,
                password: demoPassword,
                callbackURL: "/",
              },
              {
                onSuccess: () => {
                  toast.success(`Logged in as Demo ${role}!`, { id: toastId });
                  router.push("/");
                  router.refresh();
                },
                onError: (errCtx) => {
                  toast.error(errCtx.error.message || "Demo sign in failed", { id: toastId });
                  setDemoLoading(false);
                },
              }
            );
          } else {
            toast.error(ctx.error.message || "Demo signup failed", { id: toastId });
            setDemoLoading(false);
          }
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-slate-900/30 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative lights */}
        <div className="absolute top-0 right-0 h-28 w-28 bg-violet-600/5 rounded-full blur-2xl" />
        
        <div className="space-y-6 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black uppercase text-slate-100 tracking-tight flex items-center justify-center gap-2">
              <LogIn className="text-violet-500" size={24} />
              <span>Welcome Back</span>
            </h1>
            <p className="text-xs text-slate-400">
              Enter your credentials or use a demo profile to login.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 uppercase font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] text-slate-500 uppercase font-semibold">Password</label>
                <span className="text-[10px] text-violet-400 hover:text-violet-300">Forgot?</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl py-3 text-xs transition duration-200 shadow-md shadow-violet-900/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-slate-700 text-[10px] uppercase font-bold">
            <div className="flex-grow h-px bg-slate-800" />
            <span>Demo Autofills</span>
            <div className="flex-grow h-px bg-slate-800" />
          </div>

          {/* Demo Login Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading || demoLoading}
              onClick={() => handleDemoLogin("buyer@techbazaar.com", "buyer")}
              className="bg-slate-950 border border-slate-850 hover:border-violet-500/40 text-slate-200 font-semibold p-3.5 rounded-xl text-xs flex flex-col items-center justify-center gap-1.5 transition duration-200 shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <UserCheck size={16} className="text-violet-400" />
              <span className="block text-[10px] uppercase text-slate-400 font-bold">Demo Buyer</span>
            </button>

            <button
              type="button"
              disabled={loading || demoLoading}
              onClick={() => handleDemoLogin("seller@techbazaar.com", "seller")}
              className="bg-slate-950 border border-slate-850 hover:border-violet-500/40 text-slate-200 font-semibold p-3.5 rounded-xl text-xs flex flex-col items-center justify-center gap-1.5 transition duration-200 shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <ShieldAlert size={16} className="text-violet-400" />
              <span className="block text-[10px] uppercase text-slate-400 font-bold">Demo Seller</span>
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-violet-400 font-bold hover:text-violet-300 transition flex items-center gap-0.5 justify-center mt-1">
              <span>Create Account</span>
              <ArrowRight size={12} />
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
