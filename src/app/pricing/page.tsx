"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Check,
  Zap,
  Crown,
  Building2,
  ShieldCheck,
  BarChart3,
  Users,
  Package,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const SERVER_URL = "/api/backend";
const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

/* ─── Load Stripe once (outside component) ─── */
const stripePromise = STRIPE_KEY && STRIPE_KEY !== "pk_test_YOUR_PUBLISHABLE_KEY_HERE"
  ? loadStripe(STRIPE_KEY)
  : null;

/* ─── Plan definitions ─── */
const plans = [
  {
    key: "starter",
    name: "Starter Seller",
    price: "$4",
    period: "/month",
    description: "Perfect for new sellers starting their tech listing journey.",
    icon: <Zap className="h-5 w-5" />,
    color: "from-violet-600 to-purple-600",
    popular: false,
    features: [
      "Up to 50 product listings",
      "Basic analytics dashboard",
      "Order management tools",
      "Verified seller profile badge",
      "Email & chat support",
      "Secure escrow payments",
    ],
  },
  {
    key: "professional",
    name: "Professional Seller",
    price: "$14",
    period: "/month",
    description: "For growing businesses that need more reach and visibility.",
    icon: <Crown className="h-5 w-5" />,
    color: "from-violet-500 to-indigo-500",
    popular: true,
    features: [
      "Unlimited product listings",
      "Advanced analytics & reports",
      "Priority listing placement",
      "Promotional campaign tools",
      "Full inventory management",
      "Priority support (24hr SLA)",
      "Featured category badge",
    ],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For brands and large-scale electronics businesses.",
    icon: <Building2 className="h-5 w-5" />,
    color: "from-slate-600 to-slate-700",
    popular: false,
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom API integrations",
      "Homepage featured placement",
      "White-label storefront",
      "24/7 priority support line",
      "Custom analytics reports",
    ],
  },
];

const benefits = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-violet-400" />,
    title: "Secure Escrow",
    desc: "Every transaction protected by our built-in escrow payment system.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-violet-400" />,
    title: "Rich Analytics",
    desc: "Track listing views, category performance, and revenue trends.",
  },
  {
    icon: <Users className="h-6 w-6 text-violet-400" />,
    title: "24K+ Buyers",
    desc: "Access a growing marketplace of verified electronics buyers.",
  },
  {
    icon: <Package className="h-6 w-6 text-violet-400" />,
    title: "Smart Inventory",
    desc: "Manage, update, and organize all listings from one dashboard.",
  },
];

/* ─── Success / Cancel Banners ─── */
function StatusBanner() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const plan = searchParams.get("plan");

  if (success) {
    return (
      <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-700/40 text-emerald-300 rounded-2xl px-5 py-4 text-sm font-semibold">
        <Check className="h-5 w-5 flex-shrink-0" />
        <span>
          🎉 Payment successful! Your <strong className="capitalize">{plan || "seller"}</strong> plan is now active.
          Welcome to Tech Bazaar's seller community!
        </span>
      </div>
    );
  }

  if (canceled) {
    return (
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 text-slate-300 rounded-2xl px-5 py-4 text-sm">
        Payment was canceled. Choose a plan below to get started.
      </div>
    );
  }

  return null;
}

/* ─── Pricing Inner (uses useSearchParams) ─── */
function PricingContent() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [stripeConfigured, setStripeConfigured] = useState(true);

  /* Check if Stripe is configured on mount */
  useEffect(() => {
    fetch(`${SERVER_URL}/api/payments/config`)
      .then((r) => r.json())
      .then((d) => setStripeConfigured(d.configured))
      .catch(() => setStripeConfigured(false));
  }, []);

  const handleSubscribe = async (planKey: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe to a plan.");
      return;
    }

    if (!stripeConfigured || !stripePromise) {
      toast.error(
        "Stripe is not configured yet. Add your STRIPE_SECRET_KEY to the server .env file.",
        { duration: 5000 }
      );
      return;
    }

    setLoadingPlan(planKey);
    const toastId = toast.loading("Redirecting to secure checkout...");

    try {
      const res = await fetch(`${SERVER_URL}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planKey,
          userEmail: user.email,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");

      toast.dismiss(toastId);

      /* Redirect to Stripe hosted checkout */
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err: any) {
      toast.error(err.message || "Payment initialization failed", { id: toastId });
      setLoadingPlan(null);
    }
  };

  return (
    <main className="space-y-20 py-6">
      {/* ── Hero ── */}
      <section className="text-center space-y-5 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider">
          <Sparkles size={12} />
          Seller Plans
        </span>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-slate-100 leading-tight">
          Grow Your Business
          <span className="block bg-gradient-to-r from-white to-violet-400 bg-clip-text text-transparent mt-2">
            Sell to Thousands
          </span>
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          Start selling on Tech Bazaar and reach active electronics buyers. Secure payments, powerful analytics, and full seller tools included.
        </p>

        {/* Stripe not configured banner */}
        {!stripeConfigured && (
          <div className="flex items-center gap-2 justify-center bg-amber-950/30 border border-amber-700/40 text-amber-300 rounded-xl px-4 py-3 text-xs font-medium">
            ⚠️ Stripe payments not configured — add your keys to the server <code className="bg-black/20 px-1 rounded">.env</code> file to enable checkout.
          </div>
        )}

        {/* Status banners from Stripe redirect */}
        <Suspense fallback={null}>
          <StatusBanner />
        </Suspense>
      </section>

      {/* ── Pricing Cards ── */}
      <section>
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative rounded-3xl border bg-slate-900/30 p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                plan.popular
                  ? "border-violet-500 ring-2 ring-violet-500/10 shadow-violet-900/20"
                  : "border-slate-800"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-1 text-[10px] uppercase font-bold tracking-widest text-white shadow-md shadow-violet-900/30">
                  ⭐ Most Popular
                </div>
              )}

              {/* Plan icon */}
              <div
                className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${plan.color} mb-5 w-fit shadow-lg`}
              >
                <div className="text-white">{plan.icon}</div>
              </div>

              <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight">{plan.name}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed flex-grow">{plan.description}</p>

              {/* Price */}
              <div className="mt-6 mb-8">
                <span className="text-4xl font-extrabold text-slate-100">{plan.price}</span>
                {plan.period && (
                  <span className="text-xs text-slate-500 font-semibold ml-1">{plan.period}</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 border-t border-slate-800/60 pt-6 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <Check className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {plan.key === "enterprise" ? (
                <a
                  href="mailto:support@techbazaar.com?subject=Enterprise Plan Inquiry"
                  className="block w-full text-center text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 py-3.5 rounded-2xl transition duration-200 cursor-pointer active:scale-95 border border-slate-700"
                >
                  Contact Sales →
                </a>
              ) : !user ? (
                <Link href="/signin" className="block">
                  <button className="w-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-3.5 rounded-2xl transition duration-200 shadow-md shadow-violet-900/30 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5">
                    <span>Sign In to Subscribe</span>
                    <ArrowRight size={14} />
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={loadingPlan === plan.key}
                  className={`w-full text-xs font-bold text-white py-3.5 rounded-2xl transition duration-200 shadow-md cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${
                    plan.popular
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-900/30"
                      : "bg-violet-600 hover:bg-violet-500 shadow-violet-900/20"
                  }`}
                >
                  {loadingPlan === plan.key ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Redirecting...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe — {plan.price}{plan.period}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="border-t border-slate-900 pt-16 space-y-10">
        <h2 className="text-center text-xl sm:text-2xl font-black uppercase text-slate-200 tracking-tight">
          Why Sell With Tech Bazaar?
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 space-y-3 hover:border-violet-500/30 transition duration-300"
            >
              <div className="p-3 bg-slate-950 rounded-xl w-fit border border-slate-800">
                {b.icon}
              </div>
              <h3 className="font-bold text-slate-200 text-sm">{b.title}</h3>
              <p className="text-xs text-slate-450 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-center text-xl font-black uppercase text-slate-200 tracking-tight">FAQ</h2>

        {[
          {
            q: "Can I cancel my subscription at any time?",
            a: "Yes. You can cancel your subscription at any time from your Stripe billing portal. Your plan remains active until the end of the billing period.",
          },
          {
            q: "Is my payment information secure?",
            a: "All payments are processed by Stripe, a PCI-DSS Level 1 certified payment processor. We never store your card details.",
          },
          {
            q: "What payment methods are accepted?",
            a: "We accept all major credit and debit cards (Visa, MasterCard, Amex, Discover) through Stripe.",
          },
          {
            q: "Can I switch plans later?",
            a: "Absolutely. You can upgrade or downgrade your plan at any time. Prorated charges apply when upgrading.",
          },
        ].map((item) => (
          <details
            key={item.q}
            className="group bg-slate-900/20 border border-slate-800 rounded-2xl p-5 cursor-pointer"
          >
            <summary className="font-bold text-sm text-slate-200 flex justify-between items-center list-none">
              <span>{item.q}</span>
              <span className="transition duration-300 group-open:rotate-45 text-violet-400 text-xl leading-none">+</span>
            </summary>
            <p className="text-xs text-slate-400 leading-relaxed mt-3 pt-3 border-t border-slate-800/40">
              {item.a}
            </p>
          </details>
        ))}
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-violet-950/30 via-slate-900/30 to-slate-950 p-10 text-center space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 bg-violet-600/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-100 tracking-tight">
              Ready to Start Selling?
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Join thousands of verified sellers already growing their electronics business on Tech Bazaar.
            </p>
            {!user ? (
              <div className="flex gap-3 justify-center">
                <Link href="/signup">
                  <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-8 py-3 text-xs transition duration-200 shadow-md shadow-violet-900/20 cursor-pointer active:scale-95">
                    Create Seller Account
                  </button>
                </Link>
                <Link href="/products">
                  <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl px-8 py-3 text-xs transition duration-200 cursor-pointer active:scale-95">
                    Browse Products
                  </button>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => handleSubscribe("professional")}
                disabled={!!loadingPlan}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl px-8 py-3 text-xs transition duration-200 shadow-md shadow-violet-900/20 cursor-pointer active:scale-95 disabled:opacity-60"
              >
                Get Professional Plan — $14/mo
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─── Page wrapper with Suspense for useSearchParams ─── */
export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8 py-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-10 bg-slate-900 rounded w-1/3 mx-auto" />
        <div className="grid grid-cols-3 gap-6">
          <div className="h-96 bg-slate-900 rounded-3xl" />
          <div className="h-96 bg-slate-900 rounded-3xl" />
          <div className="h-96 bg-slate-900 rounded-3xl" />
        </div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
