import React from 'react'
import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Lumina — Privacy-First Local AI Writing Assistant',
    template: '%s | Lumina',
  },
  description: 'Write better in any app — 100% offline. Lumina uses local LLMs via Ollama to rewrite, summarize, and translate your text with a global hotkey. No cloud, no API keys, no telemetry.',
  keywords: ['local AI', 'writing assistant', 'offline AI', 'Ollama', 'privacy', 'LLM', 'Electron', 'desktop app'],
  authors: [{ name: 'Lumina AI' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lumina-ai-deploy1.vercel.app',
    siteName: 'Lumina',
    title: 'Lumina — Privacy-First Local AI Writing Assistant',
    description: 'Write better in any app — 100% offline. Global hotkey. Visual diff. Powered by Ollama.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumina — Privacy-First Local AI Writing Assistant',
    description: 'Write better in any app — 100% offline. Global hotkey. Visual diff. Powered by Ollama.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-bg-dark text-gray-200 antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>

        {/* Rich Footer */}
        <footer className="border-t border-white/5 bg-bg-darkSecondary/40 mt-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-primary to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">L</span>
                  </div>
                  <span className="text-white font-bold font-outfit">Lumina</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                  A privacy-first local AI writing assistant. No cloud. No subscriptions. 100% offline.
                </p>
                <a
                  href="https://github.com/rachanadn27-boop/lumina-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-indigo-300 hover:text-white transition font-semibold"
                >
                  ⭐ Star on GitHub
                </a>
              </div>

              {/* Product Links */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product</p>
                <ul className="space-y-2 text-xs text-gray-400">
                  {[
                    { label: 'Download', href: '/download' },
                    { label: 'Documentation', href: '/docs' },
                    { label: 'Blog', href: '/blog' },
                    { label: 'Changelog', href: 'https://github.com/rachanadn27-boop/lumina-ai/releases' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="hover:text-white transition">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Legal & Support</p>
                <ul className="space-y-2 text-xs text-gray-400">
                  {[
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Contact', href: '/contact' },
                    { label: 'Report a Bug', href: 'https://github.com/rachanadn27-boop/lumina-ai/issues' },
                    { label: 'Source Code', href: 'https://github.com/rachanadn27-boop/lumina-ai' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="hover:text-white transition">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-600">
              <p>© {new Date().getFullYear()} Lumina. Open source. No rights reserved.</p>
              <p className="flex items-center gap-1">
                Built with 💜 — runs locally, always
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
