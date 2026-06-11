import React from 'react'
import Link from 'next/link'
import { Sparkles, Brain, Lock, Cpu, Eye, History, Zap, CheckCircle2, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center relative overflow-hidden bg-bg-dark text-gray-200">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[80%] left-1/3 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Glowing Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-xs text-indigo-300 font-bold tracking-wide shadow-[0_0_15px_rgba(99,102,241,0.15)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>100% Offline Local AI Writing Assistant</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight font-outfit leading-[1.08] select-none">
            Write Better. <br />
            <span className="bg-gradient-to-r from-brand-primary via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              Anywhere. Privately.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Lumina runs powerful LLMs right on your computer. Highlight text in any application, press <code className="bg-white/10 px-2 py-1 rounded text-sm text-indigo-300 font-mono font-bold border border-white/5">Ctrl+Shift+R</code>, and immediately improve, summarize, or translate without exposing your data.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/download"
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-brand-primary/25 flex items-center justify-center space-x-2 font-sans"
            >
              <span>Get Lumina Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl border border-white/10 transition-all duration-200 font-sans"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Visual Simulator Mock */}
      <section className="w-full max-w-5xl px-4 pb-28 z-10">
        <div className="relative rounded-2xl border border-white/10 bg-bg-darkSecondary/60 backdrop-blur-md p-2 shadow-2xl shadow-black/80">
          {/* Header element bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="pl-2 font-mono text-[10px] opacity-65">Lumina Overlay System</span>
            </div>
            <span className="font-mono text-[10px] bg-brand-primary/10 text-indigo-300 px-2 py-0.5 rounded border border-brand-primary/20">Hotkey Active: Ctrl+Shift+R</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 min-h-[300px]">
            {/* Left Col: Captured Prompt */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">Captured Text Input</span>
                  <p className="text-xs text-gray-300 italic">"hey just wanted to check if you are free tomorrow for the meeting to go over the final specs of the project let me know ASAP"</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Select Preset Action</span>
                  <div className="space-y-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-white font-bold flex items-center justify-between">
                      <span>👔 Professional Tone</span>
                      <span className="text-[8px] bg-brand-primary/20 text-indigo-300 px-1.5 py-0.5 rounded">Selected</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 flex items-center justify-between transition">
                      <span>✨ Improve Writing</span>
                      <span className="text-[9px] font-mono opacity-50">Ctrl+Shift+I</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 flex items-center justify-between transition">
                      <span>📝 Summarize</span>
                      <span className="text-[9px] font-mono opacity-50">Ctrl+Shift+S</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">Powered by local qwen3:8b</div>
            </div>

            {/* Right Col: Diff output mock */}
            <div className="md:col-span-7 flex flex-col bg-black/40 rounded-xl border border-white/5 p-4 justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 flex items-center space-x-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visual Diff View</span>
                  </span>
                  <span className="text-[9px] font-mono text-gray-500">10 changes detected</span>
                </div>
                <div className="font-mono text-xs space-y-1.5 leading-relaxed">
                  <div className="bg-red-950/20 text-red-400 px-1.5 py-0.5 rounded border-l-2 border-red-500 flex flex-wrap items-center">
                    <span className="line-through">hey just wanted to check if you are free tomorrow for the meeting</span>
                  </div>
                  <div className="bg-green-950/20 text-green-400 px-1.5 py-0.5 rounded border-l-2 border-green-500 flex flex-wrap items-center">
                    <span>I would like to verify your availability tomorrow for our scheduled meeting</span>
                  </div>
                  <div className="bg-red-950/20 text-red-400 px-1.5 py-0.5 rounded border-l-2 border-red-500 flex flex-wrap items-center">
                    <span className="line-through">to go over the final specs of the project let me know ASAP</span>
                  </div>
                  <div className="bg-green-950/20 text-green-400 px-1.5 py-0.5 rounded border-l-2 border-green-500 flex flex-wrap items-center">
                    <span>to review the final project specifications. Please let me know at your earliest convenience.</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-end space-x-2 border-t border-white/5 pt-3 mt-4">
                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold transition text-gray-300">Copy Draft</button>
                <button className="px-4 py-1.5 bg-brand-primary hover:bg-brand-hover text-white rounded-lg text-xs font-bold transition shadow-md shadow-brand-primary/20">Insert Text</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="w-full py-28 bg-bg-darkSecondary/35 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">Designed for Privacy, Built for Speed</h2>
            <p className="text-base text-gray-400 leading-relaxed font-sans">Everything you expect from modern cloud AI writing assistants, hosted entirely offline on your hardware.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-bg-darkSecondary border border-white/5 hover:border-brand-primary/35 hover:shadow-[0_4px_30px_rgba(99,102,241,0.08)] transition duration-300 group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Lock className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-white font-outfit">100% Offline Privacy</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">No API keys, no subscriptions, no cloud. Your keystrokes and sensitive clipboard contents never leave your machine, guaranteeing absolute data safety.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-bg-darkSecondary border border-white/5 hover:border-brand-primary/35 hover:shadow-[0_4px_30px_rgba(99,102,241,0.08)] transition duration-300 group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Zap className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-white font-outfit">Global App Integration</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">Works across Slack, VS Code, Word, Chrome, Gmail, or Obsidian. Simply highlight text in any workspace, press your hotkey, and Lumina handles the rest.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-bg-darkSecondary border border-white/5 hover:border-brand-primary/35 hover:shadow-[0_4px_30px_rgba(99,102,241,0.08)] transition duration-300 group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Eye className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-white font-outfit">Visual Diff Viewer</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">Accept or reject revisions confidently. Side-by-side Git-style visual highlights clearly map out exactly what words the AI removed or appended.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-bg-darkSecondary border border-white/5 hover:border-brand-primary/35 hover:shadow-[0_4px_30px_rgba(99,102,241,0.08)] transition duration-300 group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Brain className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-white font-outfit">Semantic Vector Search</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">Retrieve historical prompts and translations conceptually. Combines a vector embeddings model locally to match query ideas, not just exact keywords.</p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-bg-darkSecondary border border-white/5 hover:border-brand-primary/35 hover:shadow-[0_4px_30px_rgba(99,102,241,0.08)] transition duration-300 group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Cpu className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-white font-outfit">Local RAG Knowledge</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">Index custom style guides, prompt guidelines, and documents. Lumina references your context library to align responses with specific local resources.</p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-bg-darkSecondary border border-white/5 hover:border-brand-primary/35 hover:shadow-[0_4px_30px_rgba(99,102,241,0.08)] transition duration-300 group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <History className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-white font-outfit">Adjustable Parameters</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">Tune temperature, max tokens, and models directly from the overlay slider bar. Switch models instantly for lightweight edits or advanced tasks.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Free Forever / Callout section */}
      <section className="w-full py-28 flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-bg-darkSecondary to-bg-darkTertiary/30 border border-white/10 p-10 sm:p-16 rounded-3xl space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-outfit">Completely Free. Run Forever.</h2>
          <p className="text-base text-gray-400 leading-relaxed max-w-2xl mx-auto font-sans">
            Since Lumina executes LLMs locally on your processor, there are no cloud API usage charges or monthly subscriptions. It is open-source, telemetry-free, and runs entirely under your control.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-400 pt-2 font-sans">
            <span className="flex items-center space-x-2"><CheckCircle2 className="w-5 h-5 text-brand-primary" /> <span>No Cloud APIs</span></span>
            <span className="flex items-center space-x-2"><CheckCircle2 className="w-5 h-5 text-brand-primary" /> <span>No Account Required</span></span>
            <span className="flex items-center space-x-2"><CheckCircle2 className="w-5 h-5 text-brand-primary" /> <span>100% Free Open Source</span></span>
          </div>

          <div className="pt-6">
            <Link
              href="/download"
              className="px-8 py-4 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-xl transition duration-200 shadow-md shadow-brand-primary/20 hover:-translate-y-0.5 transform font-sans inline-block"
            >
              Get Started Instantly
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
