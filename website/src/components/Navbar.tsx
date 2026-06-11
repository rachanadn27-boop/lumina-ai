import React from 'react'
import Link from 'next/link'
import { Sparkles, Download, Menu } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-bg-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-purple-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-wide font-sans">Lumina</span>
        </Link>

        {/* Navigation Middle Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-400">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/#features" className="hover:text-white transition">Features</Link>
          <Link href="/docs" className="hover:text-white transition">Docs</Link>
          <Link href="/blog" className="hover:text-white transition">Blog</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center space-x-3">
          <Link
            href="/download"
            className="flex items-center space-x-2 px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Link>
          <button className="md:hidden p-2 text-gray-400 hover:text-white transition">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
