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

    await (authClient.signUp.email as any)(
      {
        email,
        password,
        name,
        image: imageUrl || undefined,
        role,
        plan: "free",
      },
      {
        onSuccess: async () => {
          // Trigger instant login after successful registration
          await authClient.signIn.email(
            {
              email,
              password,
              callbackURL: "/",
            },
            {
              onSuccess: () => {
                toast.success("Account created and logged in!", { id: toastId });
                router.push("/");
                router.refresh();
              },
              onError: (ctx) => {
                toast.error(ctx.error.message || "Failed to log in after register", { id: toastId });
                setLoading(false);
              },
            }
          );
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to register account", { id: toastId });
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-8">
      <div className="w-full max-w-md bg-slate-900/30 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative backdrop light */}
        <div className="absolute top-0 right-0 h-28 w-28 bg-violet-600/5 rounded-full blur-2xl" />

        <div className="space-y-6 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black uppercase text-slate-100 tracking-tight flex items-center justify-center gap-2">
              <UserPlus className="text-violet-500" size={24} />
              <span>Create Account</span>
            </h1>
            <p className="text-xs text-slate-400">
              Join Tech Bazaar to listing items and posting reviews.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 uppercase font-semibold">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Image URL */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 uppercase font-semibold">Avatar Image URL (Optional)</label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 uppercase font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 uppercase font-semibold">Sign Up As</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
              >
                <option value="buyer">Buyer (Discover & Review items)</option>
                <option value="seller">Seller (List & Manage gadgets)</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl py-3 text-xs transition duration-200 shadow-md shadow-violet-900/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Registering..." : "Create Account"}</span>
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/signin" className="text-violet-400 font-bold hover:text-violet-300 transition flex items-center gap-0.5 justify-center mt-1">
              <span>Sign In Instead</span>
              <ArrowRight size={12} />
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
