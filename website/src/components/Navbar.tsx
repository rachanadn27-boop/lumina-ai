'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Download, Menu, X, Github } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#features', label: 'Features' },
  { href: '/docs', label: 'Docs' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-bg-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-brand-primary/40 transition-shadow duration-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-wide font-outfit">Lumina</span>
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-indigo-300 font-mono">v1.0.1</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-400">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center space-x-2">
          <a
            href="https://github.com/rachanadn27-boop/lumina-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-all duration-200"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <Link
            href="/download"
            className="flex items-center space-x-2 px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-md shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-px transform"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition rounded-lg hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-bg-dark/95 backdrop-blur-md">
          <nav className="flex flex-col px-4 py-3 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/5 mt-1">
              <a
                href="https://github.com/rachanadn27-boop/lumina-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                <Github className="w-4 h-4" />
                View Source on GitHub
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
