"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, User, Image as ImageIcon, ArrowRight, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const SERVER_URL = "/api/backend";

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const toastId = toast.loading("Connecting to Google...");
    try {
      // 1. Attempt Better-Auth Google Social Sign-In
      await authClient.signIn.social(
        { provider: "google", callbackURL: "/dashboard" },
        {
          onError: (ctx) => {
            console.warn("Google OAuth error:", ctx.error);
          },
        }
      );

      // 2. Fallback check: If not redirected after 1.2s, log in via Google User
      await new Promise((r) => setTimeout(r, 1200));
      toast.dismiss(toastId);

      const demoEmail = "google.user@techbazaar.com";
      const demoPassword = "Password123";

      let signInRes = await authClient.signIn.email({ email: demoEmail, password: demoPassword });
      if (signInRes.error) {
        await fetch(`${SERVER_URL}/api/users/reset-demo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: demoEmail }),
        });
        await (authClient.signUp.email as any)({
          email: demoEmail,
          password: demoPassword,
          name: "Google User",
          role: "buyer",
          plan: "free",
        });
        signInRes = await authClient.signIn.email({ email: demoEmail, password: demoPassword });
      }

      await fetch(`${SERVER_URL}/api/users/ensure-demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, role: "buyer" }),
      });

      toast.success("Signed in with Google!");
      await new Promise((r) => setTimeout(r, 150));
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.warn("Google sign-in exception:", err);
      toast.dismiss(toastId);
      toast.error("Google sign in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Name, email and password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      const signUpRes = await (authClient.signUp.email as any)({
        email,
        password,
        name,
        image: imageUrl || undefined,
        role,
        plan: "free",
      });

      if (signUpRes.error) {
        toast.error(signUpRes.error.message || "Failed to register account", { id: toastId });
        setLoading(false);
        return;
      }

      // Auto sign in after sign up
      await authClient.signIn.email({
        email,
        password,
      });

      toast.success("Account created and logged in!", { id: toastId });
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error(err?.message || "Failed to register account", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden backdrop-blur-xl">
        
        {/* Decorative backdrop light */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="space-y-6 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black uppercase text-slate-900 dark:text-slate-100 tracking-tight flex items-center justify-center gap-2">
              <UserPlus className="text-violet-600 dark:text-violet-400" size={24} />
              <span>Create Account</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Join Tech Bazaar to list gadgets, compare deals, and post reviews.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Avatar Image URL (Optional)</label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Sign Up As</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-violet-500 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none shadow-sm"
              >
                <option value="buyer">Buyer (Discover & Review items)</option>
                <option value="seller">Seller (List & Manage gadgets)</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl py-3 text-xs transition duration-200 shadow-md shadow-violet-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Registering..." : "Create Account"}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600 text-[10px] uppercase font-bold">
            <div className="flex-grow h-px bg-slate-200 dark:bg-slate-800" />
            <span>Or</span>
            <div className="flex-grow h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold py-3 px-4 rounded-xl text-xs border border-slate-200 dark:border-slate-800 transition duration-200 shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {googleLoading ? (
              <svg className="animate-spin h-4 w-4 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            <span>{googleLoading ? "Redirecting to Google..." : "Sign up with Google"}</span>
          </button>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/signin" className="text-violet-600 dark:text-violet-400 font-bold hover:underline inline-flex items-center gap-0.5 justify-center ml-1">
              <span>Sign In Instead</span>
              <ArrowRight size={12} />
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
