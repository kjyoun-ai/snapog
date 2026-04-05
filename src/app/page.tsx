import Link from "next/link";
import PricingSection from "@/components/PricingSection";

const DEMO_URL =
  "/api/og?title=SnapOG&description=Beautiful+social+images,+instantly&theme=gradient";

function PlatformFrame({
  platform,
  children,
}: {
  platform: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#111]">
      <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2 text-xs text-gray-500">
        <span className="font-medium text-gray-400">{platform}</span>
        <span>· Link preview</span>
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

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
          Free beta — 50 images/mo, no card required
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
          Your links look boring
          <br />
          when shared.{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Fix that with one API call.
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          SnapOG generates the preview images that appear when someone shares
          your link on Twitter, Slack, Discord, or LinkedIn. One GET request →
          one polished image. No design tools, no image pipeline, no
          maintenance.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="#pricing"
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition"
          >
            Get a Free API Key
          </a>
          <a
            href={DEMO_URL}
            target="_blank"
            className="px-6 py-3 rounded-lg border border-white/10 hover:border-white/20 text-gray-300 font-medium transition"
          >
            See a Live Example →
          </a>
        </div>
      </section>

      {/* How it looks — platform preview strip */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-300">
          See how your links look everywhere
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PlatformFrame platform="Twitter / X">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DEMO_URL}
              alt="Twitter card preview"
              className="w-full rounded-lg"
            />
          </PlatformFrame>
          <PlatformFrame platform="Slack">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DEMO_URL}
              alt="Slack unfurl preview"
              className="w-full rounded-lg"
            />
          </PlatformFrame>
          <PlatformFrame platform="Discord">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DEMO_URL}
              alt="Discord embed preview"
              className="w-full rounded-lg"
            />
          </PlatformFrame>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          One request. One image. That&apos;s the entire integration.
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
          Add a single line to your HTML meta tags or fetch from your build
          script. Pass a title, description, and theme — SnapOG returns a
          perfectly sized 1200&times;630 image ready for social platforms.
        </p>
        <CodeBlock />
        <p className="text-sm text-gray-500 text-center mt-4">
          Works with any framework — Next.js, Astro, Hugo, WordPress, or plain
          HTML.
        </p>
      </section>

      {/* Templates */}
      <section id="templates" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Pick a style. Ship it.
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Five built-in themes to match your brand. Pass{" "}
          <code className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded text-sm">
            ?theme=gradient
          </code>{" "}
          and you&apos;re done.
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
          Start free. Pay only when you outgrow 50 images.
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Most side projects never leave the free tier. When yours does, pricing
          is flat and predictable.
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
              href="mailto:kjyoun3@gmail.com"
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
