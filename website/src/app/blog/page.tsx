import React from 'react'
import Link from 'next/link'
import { BookOpen, Calendar, User } from 'lucide-react'

interface Post {
  id: string
  title: string
  description: string
  author: string
  date: string
}

const POSTS: Post[] = [
  {
    id: 'local-llm-future',
    title: 'Why Offline Local LLMs are the Future of Writing Assistants',
    description: 'Cloud API models are powerful but compromise data privacy. Learn how local runtimes like Ollama provide secure, offline alternatives.',
    author: 'Elena Rostova',
    date: 'June 4, 2026'
  },
  {
    id: 'optimize-ollama',
    title: 'How to Optimize Local LLM Response Times on Standard Laptops',
    description: 'Tips for choosing the right model size, configuring GPU acceleration, and managing active memory configurations for Ollama.',
    author: 'Marcus Vance',
    date: 'May 28, 2026'
  },
  {
    id: 'crafting-system-instructions',
    title: 'Crafting Highly Effective System Prompts for Text Rewriting',
    description: 'Learn how specific instructions guide small local models to rewrite text precisely without introducing hallucinated facts.',
    author: 'Elena Rostova',
    date: 'May 12, 2026'
  }
]

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-brand-primary" />
          <span>Lumina Technical Blog</span>
        </h1>
        <p className="text-sm text-gray-400">Insights into local AI systems, privacy engineering, and writing tools development.</p>
      </div>

      {/* Blog list */}
      <div className="space-y-6">
        {POSTS.map((post) => (
          <div
            key={post.id}
            className="p-6 rounded-xl bg-bg-darkSecondary border border-white/5 space-y-3 hover:border-brand-primary/20 transition"
          >
            <h2 className="text-lg font-bold text-white hover:text-brand-primary transition">
              {post.title}
            </h2>
            
            <p className="text-xs text-gray-400 leading-relaxed">{post.description}</p>
            
            <div className="flex items-center space-x-4 text-[10px] text-gray-500 font-mono">
              <span className="flex items-center">
                <User className="w-3.5 h-3.5 mr-1" />
                {post.author}
              </span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {post.date}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
