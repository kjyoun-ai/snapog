import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="text-sm text-purple-400 hover:text-purple-300 transition mb-8 inline-block"
      >
        &larr; Back to home
      </Link>

      <h1 className="text-4xl font-bold mb-8">API Documentation</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
        <p className="text-gray-400 mb-4">
          Generate an Open Graph image by making a GET request:
        </p>
        <pre className="bg-[#111] border border-white/10 rounded-xl p-6 text-sm font-mono overflow-x-auto mb-4">
          <code>
            GET https://snapog.com/api/og?title=My+Page&description=A+description&theme=gradient
          </code>
        </pre>
        <p className="text-gray-400">
          The API returns a <code className="text-purple-400">1200&times;630 PNG</code> image.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Parameters</h2>
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5">
                <th className="text-left px-4 py-3 font-medium">Parameter</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Default</th>
                <th className="text-left px-4 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-mono text-purple-400">title</td>
                <td className="px-4 py-3 text-gray-400">string</td>
                <td className="px-4 py-3 text-gray-500">&quot;Hello World&quot;</td>
                <td className="px-4 py-3 text-gray-400">Main heading text</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-purple-400">description</td>
                <td className="px-4 py-3 text-gray-400">string</td>
                <td className="px-4 py-3 text-gray-500">&quot;Generated with SnapOG&quot;</td>
                <td className="px-4 py-3 text-gray-400">Subtitle or description</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-purple-400">theme</td>
                <td className="px-4 py-3 text-gray-400">string</td>
                <td className="px-4 py-3 text-gray-500">&quot;default&quot;</td>
                <td className="px-4 py-3 text-gray-400">
                  One of: default, dark, gradient, minimal, bold
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-purple-400">logo</td>
                <td className="px-4 py-3 text-gray-400">string</td>
                <td className="px-4 py-3 text-gray-500">&quot;SnapOG&quot;</td>
                <td className="px-4 py-3 text-gray-400">Brand name shown on image</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Templates</h2>
        <ul className="space-y-3 text-gray-400">
          <li>
            <strong className="text-white">default</strong> — Clean white
            background, professional look
          </li>
          <li>
            <strong className="text-white">dark</strong> — Dark background,
            great for dev tools
          </li>
          <li>
            <strong className="text-white">gradient</strong> — Purple-to-violet
            gradient, eye-catching
          </li>
          <li>
            <strong className="text-white">minimal</strong> — Centered layout,
            subtle and elegant
          </li>
          <li>
            <strong className="text-white">bold</strong> — Large type, dark
            indigo background, impactful
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>

        <h3 className="text-lg font-medium mb-3">HTML meta tag</h3>
        <pre className="bg-[#111] border border-white/10 rounded-xl p-6 text-sm font-mono overflow-x-auto mb-6">
          <code>{`<meta property="og:image"
  content="https://snapog.com/api/og?title=My+Blog&theme=dark" />`}</code>
        </pre>

        <h3 className="text-lg font-medium mb-3">Next.js metadata</h3>
        <pre className="bg-[#111] border border-white/10 rounded-xl p-6 text-sm font-mono overflow-x-auto mb-6">
          <code>{`export const metadata = {
  openGraph: {
    images: [
      {
        url: "https://snapog.com/api/og?title=My+App&theme=gradient",
        width: 1200,
        height: 630,
      },
    ],
  },
};`}</code>
        </pre>
      </section>
    </main>
  );
}
