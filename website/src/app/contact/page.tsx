"use client"

import React from 'react'
import { Mail, MessageSquare, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Contact Lumina Support</h1>
        <p className="text-sm text-gray-400">Have a feature request, bug report, or want to contribute? Get in touch.</p>
      </div>

      {/* Contact Form */}
      <form className="p-6 rounded-xl bg-bg-darkSecondary border border-white/5 space-y-4 text-xs font-semibold text-gray-300">
        <div className="flex flex-col space-y-1.5">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="px-3.5 py-2 rounded-lg bg-bg-darkTertiary border border-white/5 outline-none focus:border-brand-primary text-xs font-medium text-white"
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            className="px-3.5 py-2 rounded-lg bg-bg-darkTertiary border border-white/5 outline-none focus:border-brand-primary text-xs font-medium text-white"
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <label>Message Type</label>
          <select className="px-3.5 py-2 rounded-lg bg-bg-darkTertiary border border-white/5 outline-none focus:border-brand-primary text-xs font-medium text-white">
            <option>General Inquiry</option>
            <option>Feature Request</option>
            <option>Bug Report</option>
            <option>Security Report</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label>Message Content</label>
          <textarea
            rows={5}
            placeholder="Tell us what you think..."
            className="px-3.5 py-2 rounded-lg bg-bg-darkTertiary border border-white/5 outline-none focus:border-brand-primary text-xs font-medium text-white font-sans"
          />
        </div>

        <button
          type="submit"
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-lg font-bold transition pt-3"
          onClick={(e) => {
            e.preventDefault()
            alert('Feedback captured locally. Thank you for contributing!')
          }}
        >
          <Send className="w-4 h-4" />
          <span>Send Message</span>
        </button>
      </form>
    </div>
  )
}
