import Link from "next/link";
import PricingSection from "@/components/PricingSection";

const DEMO_URL =
  "/api/og?title=SnapOG&description=Beautiful+social+images,+instantly&theme=gradient";

const TEMPLATES = ["default", "dark", "gradient", "minimal", "bold"] as const;

function CodeBlock() {
  return (
    <pre className="bg-[#111] border border-white/10 rounded-xl p-6 text-sm font-mono overflow-x-auto">
      <code>
        <span className="text-blue-400">GET</span>{" "}
        <span className="text-green-400">https://snapog.com/api/og</span>
        {"\n  "}?title=
        <span className="text-yellow-300">My+Blog+Post</span>
        {"\n  "}&description=
        <span className="text-yellow-300">A+great+article</span>
        {"\n  "}&theme=<span className="text-yellow-300">gradient</span>
        {"\n\n"}
        <span className="text-gray-500">
          {"// Returns a 1200\u00d7630 PNG image"}
        </span>
      </code>
    </pre>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-purple-400">Snap</span>OG
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <a href="#pricing" className="hover:text-white transition">
            Pricing
          </a>
          <a href="#templates" className="hover:text-white transition">
            Templates
          </a>
          <Link href="/docs" className="hover:text-white transition">
            Docs
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          Now in public beta
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
          Beautiful social images,
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            one API call away
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          Generate stunning Open Graph images for every page on your site.
          Perfect previews on Twitter, Slack, Discord, LinkedIn — no design
          tools needed.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="#pricing"
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition"
          >
            Get Your API Key
          </a>
          <a
            href={DEMO_URL}
            target="_blank"
            className="px-6 py-3 rounded-lg border border-white/10 hover:border-white/20 text-gray-300 font-medium transition"
          >
            Try Live Demo
          </a>
        </div>
      </section>

      {/* Preview */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#111]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DEMO_URL} alt="SnapOG demo preview" className="w-full" />
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Dead simple API
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
          One GET request. That&apos;s it. Pass your title, description, and
          pick a theme. We return a perfectly sized 1200&times;630 PNG.
        </p>
        <CodeBlock />
      </section>

      {/* Templates */}
      <section id="templates" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          5 built-in templates
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Pick a style that matches your brand. Custom templates coming soon.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((theme) => (
            <div
              key={theme}
              className="rounded-xl border border-white/10 overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/og?title=Hello+World&description=This+is+the+${theme}+template&theme=${theme}`}
                alt={`${theme} template`}
                className="w-full"
              />
              <div className="px-4 py-3 text-sm font-medium capitalize bg-[#111]">
                {theme}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Start free. Scale as you grow. No hidden fees.
        </p>
        <PricingSection />
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <div>
            <span className="text-purple-400 font-bold">Snap</span>OG &copy;{" "}
            {new Date().getFullYear()}
          </div>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">
              Docs
            </Link>
            <a
              href="mailto:support@snapog.com"
              className="hover:text-gray-300 transition"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
