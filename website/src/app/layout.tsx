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
  title: 'Lumina - Privacy-First Local AI Writing Assistant',
  description: 'Boost your writing, grammar, and productivity globally across any app using 100% local AI models like Qwen3 and Llama3. Telemetry-free, cloud-free, secure.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-bg-dark text-gray-200 antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Simple Footer */}
        <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} Lumina. Built locally, run privately. No rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
