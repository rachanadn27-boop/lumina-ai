import React from 'react'
import Link from 'next/link'
import { BookOpen, Calendar, User, ArrowRight, Tag } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights into local AI, privacy engineering, writing tools, and LLM development from the Lumina team.',
}

interface Post {
  id: string
  title: string
  description: string
  author: string
  date: string
  readTime: string
  tag: string
  tagColor: string
}

const POSTS: Post[] = [
  {
    id: 'local-llm-future',
    title: 'Why Offline Local LLMs are the Future of Writing Assistants',
    description: 'Cloud API models are powerful but compromise data privacy. Learn how local runtimes like Ollama provide secure, offline alternatives that keep your data exactly where it belongs — on your machine.',
    author: 'Elena Rostova',
    date: 'June 4, 2026',
    readTime: '7 min read',
    tag: 'Privacy',
    tagColor: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    id: 'optimize-ollama',
    title: 'How to Optimize Local LLM Response Times on Standard Laptops',
    description: 'Tips for choosing the right model size, configuring GPU acceleration, managing active memory configurations for Ollama, and getting the best throughput from consumer hardware.',
    author: 'Marcus Vance',
    date: 'May 28, 2026',
    readTime: '9 min read',
    tag: 'Performance',
    tagColor: 'text-green-300 bg-green-500/10 border-green-500/20',
  },
  {
    id: 'crafting-system-instructions',
    title: 'Crafting Highly Effective System Prompts for Text Rewriting',
    description: 'Learn how specific instructions guide small local models to rewrite text precisely without introducing hallucinated facts or unintended tone shifts — with real examples from Lumina\'s preset library.',
    author: 'Elena Rostova',
    date: 'May 12, 2026',
    readTime: '6 min read',
    tag: 'Prompting',
    tagColor: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'rag-local-documents',
    title: 'Using Local RAG to Ground Your AI in Your Own Documents',
    description: 'Retrieval-Augmented Generation doesn\'t require a cloud. We walk through how Lumina uses SQLite + nomic-embed-text to build a fully offline vector store that grounds AI outputs in your own style guides.',
    author: 'Marcus Vance',
    date: 'April 30, 2026',
    readTime: '11 min read',
    tag: 'RAG',
    tagColor: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20',
  },
  {
    id: 'electron-global-shortcuts',
    title: 'Building a Global Hotkey Overlay with Electron and React',
    description: 'A deep dive into how Lumina implements a frameless, always-on-top Electron window with system-wide keyboard shortcuts, clipboard capture, and simulated paste — across Windows, macOS, and Linux.',
    author: 'Elena Rostova',
    date: 'April 15, 2026',
    readTime: '13 min read',
    tag: 'Engineering',
    tagColor: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-brand-primary/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-10 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">Lumina Blog</h1>
              <p className="text-xs text-gray-500 mt-0.5">Local AI · Privacy Engineering · Writing Tools</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            Deep dives into local LLM development, privacy engineering, Electron internals, and the craft of building offline-first AI tools.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-5">
        {POSTS.map((post, i) => (
          <article
            key={post.id}
            className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
              i === 0
                ? 'bg-bg-darkSecondary border-brand-primary/20 hover:border-brand-primary/40 hover:shadow-[0_4px_40px_rgba(99,102,241,0.1)]'
                : 'bg-bg-darkSecondary/60 border-white/5 hover:border-white/15 hover:bg-bg-darkSecondary'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${post.tagColor}`}>
                    <Tag className="w-2.5 h-2.5 inline mr-1" />
                    {post.tag}
                  </span>
                  {i === 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/25 text-indigo-300">
                      ✨ Latest
                    </span>
                  )}
                </div>

                <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-primary transition-colors duration-200 font-outfit leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{post.description}</p>

                <div className="flex items-center gap-4 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="flex-shrink-0 self-center">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30 transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Newsletter CTA */}
        <div className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-purple-600/5 border border-brand-primary/15 text-center space-y-3">
          <h3 className="text-lg font-bold text-white font-outfit">Stay in the loop</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">New posts on local AI, privacy, and Lumina updates. No spam.</p>
          <a
            href="https://github.com/rachanadn27-boop/lumina-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all duration-200 hover:-translate-y-px transform shadow-lg shadow-brand-primary/20"
          >
            ⭐ Star the repo for updates
          </a>
        </div>
      </div>
    </div>
  )
}
