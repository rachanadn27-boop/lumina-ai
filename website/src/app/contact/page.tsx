'use client'
import React, { useState } from 'react'
import type { Metadata } from 'next'
import { Mail, Github, Bug, Sparkles, Send, ExternalLink, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: 'Rachana D N', email: 'rachanadn27@gmail.com', type: 'General Inquiry', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-primary/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-2xl mx-auto px-4 pt-20 pb-10 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-outfit mb-3">Get in Touch</h1>
          <p className="text-sm text-gray-400 leading-relaxed">Bug report, feature request, or just want to say hi? We read everything.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20 space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Github, label: 'Open an Issue', sub: 'GitHub Issues', href: 'https://github.com/rachanadn27-boop/lumina-ai/issues', color: 'hover:border-gray-400/30' },
            { icon: Bug, label: 'Report a Bug', sub: 'GitHub Issues', href: 'https://github.com/rachanadn27-boop/lumina-ai/issues/new', color: 'hover:border-red-400/30' },
            { icon: Sparkles, label: 'Feature Request', sub: 'GitHub Discussions', href: 'https://github.com/rachanadn27-boop/lumina-ai/discussions', color: 'hover:border-brand-primary/40' },
          ].map(({ icon: Icon, label, sub, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-4 rounded-xl bg-bg-darkSecondary border border-white/5 ${color} transition-all duration-200 hover:bg-bg-darkSecondary flex flex-col items-center gap-2 text-center`}
            >
              <Icon className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform duration-200" />
              <div>
                <p className="text-xs font-bold text-white">{label}</p>
                <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1 mt-0.5">
                  {sub} <ExternalLink className="w-2.5 h-2.5" />
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        {!sent ? (
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl bg-bg-darkSecondary border border-white/5 space-y-4"
          >
            <h2 className="text-sm font-bold text-white mb-1">Send a Message</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/8 outline-none focus:border-brand-primary/60 text-xs text-white placeholder-gray-600 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/8 outline-none focus:border-brand-primary/60 text-xs text-white placeholder-gray-600 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/8 outline-none focus:border-brand-primary/60 text-xs text-white transition-colors"
              >
                <option>General Inquiry</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Security Report</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us what's on your mind..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/8 outline-none focus:border-brand-primary/60 text-xs text-white placeholder-gray-600 font-sans resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all duration-200 hover:-translate-y-px transform shadow-lg shadow-brand-primary/20"
            >
              <Send className="w-3.5 h-3.5" />
              Send Message
            </button>
          </form>
        ) : (
          <div className="p-10 rounded-2xl bg-bg-darkSecondary border border-green-500/20 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">Message received!</h2>
            <p className="text-xs text-gray-400">Thanks for reaching out. We'll get back to you shortly.</p>
            <button
              onClick={() => { setSent(false); setForm({ name: '', email: '', type: 'General Inquiry', message: '' }) }}
              className="text-xs text-indigo-300 hover:text-white transition underline"
            >
              Send another message
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
