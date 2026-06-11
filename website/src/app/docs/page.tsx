import React from 'react'
import { Sparkles, Terminal, Keyboard, Shield } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-8 min-h-screen">
      
      {/* Sidebar navigation links */}
      <aside className="w-full md:w-56 flex-shrink-0 text-xs font-semibold text-gray-400 space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white">Getting Started</span>
        <ul className="space-y-2.5">
          <li><a href="#install" className="hover:text-white block transition text-brand-primary">1. Quick Installation</a></li>
          <li><a href="#compatibility" className="hover:text-white block transition">2. Hardware & Models</a></li>
        </ul>

        <span className="text-[10px] font-bold uppercase tracking-wider text-white block pt-3">Key Features</span>
        <ul className="space-y-2.5">
          <li><a href="#shortcuts" className="hover:text-white block transition">Keyboard Shortcuts</a></li>
          <li><a href="#customization" className="hover:text-white block transition">Custom Prompt Templates</a></li>
          <li><a href="#rag" className="hover:text-white block transition">Context & Style Guides</a></li>
          <li><a href="#semantic" className="hover:text-white block transition">Semantic Vector Search</a></li>
        </ul>
      </aside>

      {/* Docs Articles */}
      <article className="flex-1 space-y-12 text-sm text-gray-300 leading-relaxed">
        
        {/* Intro */}
        <section className="space-y-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Lumina Documentation</h1>
          <p>Lumina is a local AI writing assistant that connects to your local Ollama runtime, letting you rewrite, summarize, or edit text globally within any editor or text area.</p>
        </section>

        {/* Quick Installation */}
        <section id="install" className="space-y-4 pt-4 border-t border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-brand-primary" />
            <span>1. Quick Installation</span>
          </h2>
          <p>Setting up Lumina involves two simple steps to keep operations 100% local:</p>
          <ol className="list-decimal list-inside space-y-2 pl-2 text-xs">
            <li>Download and run the <a href="https://ollama.com" target="_blank" className="underline font-bold text-white">Ollama AI server</a>.</li>
            <li>Download and install the Lumina executable for your OS.</li>
            <li>Run Lumina; the setup wizard will detect Ollama and guide you through downloading the default Qwen model.</li>
          </ol>
        </section>

        {/* Hardware & Models */}
        <section id="compatibility" className="space-y-4 pt-4 border-t border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Shield className="w-4 h-4 text-brand-primary" />
            <span>2. Hardware & Models Compatibility</span>
          </h2>
          <p>Because processing runs locally, hardware specs dictate speed. We recommend:</p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-xs">
            <li><strong>Minimum</strong>: Apple M1 Chip, or Intel Core i5 with 8GB RAM. Run <strong>qwen3:8b</strong>.</li>
            <li><strong>Recommended</strong>: Apple Silicon M1 Pro/M2/M3 with 16GB unified RAM, or dedicated GPU with 6GB+ VRAM. Run <strong>llama3:8b</strong>.</li>
            <li><strong>Heavy Tasks</strong>: Apple Ultra/Max or NVIDIA RTX 4070 with 24GB+ RAM. Run <strong>gemma3:12b</strong>.</li>
          </ul>
        </section>

        {/* Keyboard Shortcuts */}
        <section id="shortcuts" className="space-y-4 pt-4 border-t border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Keyboard className="w-4 h-4 text-brand-primary" />
            <span>3. Keyboard Shortcuts</span>
          </h2>
          <p>Highlight text in Chrome, Notepad, Word, or VS Code, then press <code className="bg-white/5 px-2 py-0.5 rounded font-mono font-bold text-brand-primary text-xs">Ctrl+Shift+E</code>. Lumina automatically copies the text, opens its frameless overlay, and shows your action prompts. Select an action to process, and click "Insert Text" to paste back.</p>
        </section>

        {/* RAG & Style Guides */}
        <section id="rag" className="space-y-4 pt-4 border-t border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span>4. Style Guides & Local RAG</span>
          </h2>
          <p>In Settings, select "Context Library" to index documents containing your company rules, notes, or writing samples. When generating edits, Lumina retrieves matching guidelines offline and feeds them as reference parameters to the model, aligning tone perfectly.</p>
        </section>

      </article>
    </div>
  )
}
