"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = searchParams.get("key");
    const planParam = searchParams.get("plan");
    const emailParam = searchParams.get("email");

    if (key) {
      setApiKey(key);
      setPlan(planParam || "free");
      setEmail(emailParam || "");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  function copyKey() {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-green-400 text-3xl">&#10003;</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">
          {apiKey ? "Your API Key is Ready!" : "Welcome to SnapOG"}
        </h1>

        {apiKey ? (
          <>
            <p className="text-gray-400 mb-6">
              {plan !== "free" ? `You're now on the ${plan} plan.` : "Your free API key is ready."} Save your key below — you'll need it for every request.
            </p>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6 mb-6">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Your API Key</div>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-sm font-mono text-purple-400 break-all text-left">{apiKey}</code>
                <button
                  onClick={copyKey}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition shrink-0"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {email && <p className="text-sm text-gray-500 mb-6">Key sent to {email}</p>}

            <div className="bg-[#111] border border-white/10 rounded-xl p-6 mb-8 text-left">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Quick Start</div>
              <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
{`curl "https://snapog-wheat.vercel.app/api/og\\
  ?title=Hello+World\\
  &key=${apiKey.slice(0, 12)}..."`}
              </pre>
            </div>
          </>
        ) : (
          <p className="text-gray-400 mb-6">
            Something went wrong retrieving your key. Please check your email or contact support.
          </p>
        )}

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/docs"
            className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition text-sm"
          >
            View Docs
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/20 text-gray-300 font-medium transition text-sm"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
