"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    images: "100 images/mo",
    features: ["5 templates", "PNG output", "Community support"],
    cta: "Get Free API Key",
    highlight: false,
    action: "free",
    priceId: null,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/mo",
    images: "5,000 images/mo",
    features: ["All templates", "PNG + JPEG", "Custom fonts", "Email support"],
    cta: "Subscribe",
    highlight: true,
    action: "checkout",
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || null,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    images: "50,000 images/mo",
    features: ["Everything in Starter", "SVG output", "Custom branding", "Priority support"],
    cta: "Subscribe",
    highlight: false,
    action: "checkout",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || null,
  },
  {
    name: "Scale",
    price: "$79",
    period: "/mo",
    images: "500,000 images/mo",
    features: ["Everything in Pro", "Dedicated CDN", "SLA guarantee", "Slack support"],
    cta: "Contact Us",
    highlight: false,
    action: "contact",
    priceId: null,
  },
];

export default function PricingSection() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ action: string; priceId: string | null }>({ action: "", priceId: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handlePlanClick(action: string, priceId: string | null) {
    if (action === "contact") {
      window.location.href = "mailto:support@snapog.com?subject=Scale%20Plan%20Inquiry";
      return;
    }
    setPendingAction({ action, priceId });
    setShowEmailModal(true);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (pendingAction.action === "free") {
        const res = await fetch("/api/keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        router.push(`/success?key=${encodeURIComponent(data.key)}&plan=free&email=${encodeURIComponent(email)}`);
      } else if (pendingAction.action === "checkout" && pendingAction.priceId) {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId: pendingAction.priceId, email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.url) window.location.href = data.url;
      } else {
        setError("Paid plans coming soon. Get a free key to start!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 flex flex-col ${
              plan.highlight
                ? "border-purple-500/50 bg-purple-500/5"
                : "border-white/10 bg-[#111]"
            }`}
          >
            <div className="text-sm font-medium text-gray-400 mb-2">{plan.name}</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-gray-500 text-sm">{plan.period}</span>
            </div>
            <div className="text-sm text-gray-400 mb-6">{plan.images}</div>
            <ul className="flex-1 space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanClick(plan.action, plan.priceId)}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition ${
                plan.highlight
                  ? "bg-purple-600 hover:bg-purple-500 text-white"
                  : "bg-white/5 hover:bg-white/10 text-gray-300"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setShowEmailModal(false)}>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">
              {pendingAction.action === "free" ? "Get Your Free API Key" : "Enter Your Email"}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {pendingAction.action === "free"
                ? "We'll generate your API key instantly."
                : "We'll redirect you to secure checkout."}
            </p>
            {error && <div className="text-red-400 text-sm mb-3 bg-red-400/10 p-2 rounded">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-purple-500 mb-4"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : pendingAction.action === "free" ? "Get Key" : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
