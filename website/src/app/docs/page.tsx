'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Terminal, Keyboard, Shield, Sparkles, Brain, Cpu,
  Download, Settings, History, MessageSquare, Zap,
  ChevronRight, AlertTriangle, CheckCircle2, ExternalLink, BookOpen
} from 'lucide-react'

const sections = [
  { id: 'intro',       label: 'Introduction',           group: 'Getting Started' },
  { id: 'install',     label: 'Installation',           group: 'Getting Started' },
  { id: 'ollama',      label: 'Ollama Setup',           group: 'Getting Started' },
  { id: 'firstrun',    label: 'First Launch',           group: 'Getting Started' },
  { id: 'hotkey',      label: 'Using the Hotkey',       group: 'Core Features' },
  { id: 'templates',   label: 'Prompt Templates',       group: 'Core Features' },
  { id: 'chat',        label: 'Chat Playground',        group: 'Core Features' },
  { id: 'history',     label: 'History & Search',       group: 'Core Features' },
  { id: 'rag',         label: 'Context Library (RAG)',  group: 'Core Features' },
  { id: 'settings',    label: 'Settings',               group: 'Core Features' },
  { id: 'models',      label: 'Choosing a Model',       group: 'Advanced' },
  { id: 'shortcuts',   label: 'All Shortcuts',          group: 'Advanced' },
  { id: 'faq',         label: 'FAQ & Troubleshooting',  group: 'Advanced' },
]

function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="relative group my-3">
      <div className="flex items-center justify-between bg-black/60 border border-white/5 rounded-t-lg px-4 py-1.5">
        <span className="text-[10px] font-mono text-gray-500 uppercase">{lang}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          className="text-[10px] text-gray-500 hover:text-white transition"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-black/40 border border-t-0 border-white/5 rounded-b-lg px-4 py-3 overflow-x-auto">
        <code className="text-xs text-green-400 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-block bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-[11px] font-mono text-indigo-300 font-bold shadow-sm">
      {children}
    </kbd>
  )
}

function SectionHead({ id, icon: Icon, title }: { id: string; icon: any; title: string }) {
  return (
    <h2 id={id} className="text-xl font-extrabold text-white font-outfit flex items-center gap-2.5 scroll-mt-20">
      <span className="w-7 h-7 rounded-lg bg-brand-primary/15 border border-brand-primary/25 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-brand-primary" />
      </span>
      {title}
    </h2>
  )
}

function Note({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warn' | 'tip' }) {
  const styles = {
    info: 'bg-indigo-500/5 border-indigo-500/20 text-indigo-200',
    warn: 'bg-yellow-500/5 border-yellow-500/20 text-yellow-200',
    tip:  'bg-green-500/5 border-green-500/20 text-green-200',
  }
  const icons = { info: '💡', warn: '⚠️', tip: '✅' }
  return (
    <div className={`flex gap-3 p-4 rounded-xl border text-xs leading-relaxed my-3 ${styles[type]}`}>
      <span className="text-base flex-shrink-0">{icons[type]}</span>
      <div>{children}</div>
    </div>
  )
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('intro')

  const groups = [...new Set(sections.map(s => s.group))]

  return (
    <div className="min-h-screen bg-bg-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 flex gap-8">

        {/* ── Sidebar ───────────────────────────────────── */}
        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-6 self-start space-y-6">
          <div className="text-xs font-bold text-white flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-brand-primary" />
            Documentation
          </div>
          {groups.map(group => (
            <div key={group} className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{group}</p>
              {sections.filter(s => s.group === group).map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                  className={`block text-xs py-1 px-2 rounded-lg transition-all ${
                    activeSection === s.id
                      ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          ))}
          <div className="pt-4 border-t border-white/5">
            <Link href="/download" className="flex items-center gap-2 text-xs text-indigo-300 hover:text-white transition font-semibold">
              <Download className="w-3.5 h-3.5" />
              Download Lumina
            </Link>
          </div>
        </aside>

        {/* ── Main Content ──────────────────────────────── */}
        <article className="flex-1 space-y-14 text-sm leading-relaxed max-w-3xl">

          {/* INTRO */}
          <section className="space-y-4">
            <SectionHead id="intro" icon={Sparkles} title="Introduction" />
            <p>
              <strong className="text-white">Lumina</strong> is a privacy-first, local AI writing assistant. It runs entirely on your own hardware using <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="underline text-indigo-300">Ollama</a> as the LLM runtime — meaning <strong className="text-white">no data ever leaves your machine</strong>.
            </p>
            <p>Lumina lives in your system tray. When you press its global hotkey while text is selected in any app (Slack, VS Code, Word, Gmail, Notion…), it pops up a small floating overlay, processes your text locally, shows you a visual diff of changes, and lets you insert the result back with one click.</p>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                ['🔒', '100% Offline', 'No API keys, no cloud, no telemetry'],
                ['⚡', 'System-Wide', 'Works in every app on your desktop'],
                ['🆓', 'Free Forever', 'Open source, no subscriptions'],
              ].map(([emoji, title, desc]) => (
                <div key={title as string} className="p-3 rounded-xl bg-bg-darkSecondary border border-white/5 text-center space-y-1">
                  <div className="text-xl">{emoji}</div>
                  <div className="text-xs font-bold text-white">{title}</div>
                  <div className="text-[11px] text-gray-500">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* INSTALLATION */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="install" icon={Download} title="Installation" />
            <p>Download the installer for your operating system from the <Link href="/download" className="underline text-indigo-300 font-semibold">Download page</Link>.</p>

            <div className="space-y-3">
              {[
                { os: '🪟 Windows', steps: ['Run Lumina-Setup-1.0.0.exe', 'Click "More info" → "Run anyway" if SmartScreen warns you', 'Follow the NSIS installer wizard', 'Lumina starts automatically after install'] },
                { os: '🍎 macOS', steps: ['Open the .dmg file', 'Right-click Lumina.app → Open (first time only, to bypass Gatekeeper)', 'Drag to Applications folder', 'Launch from Applications or Spotlight'] },
                { os: '🐧 Linux', steps: ['chmod +x Lumina-1.0.0.AppImage', 'Run ./Lumina-1.0.0.AppImage', 'Or install the .deb with: sudo dpkg -i Lumina-1.0.0.deb'] },
              ].map(({ os, steps }) => (
                <div key={os} className="p-4 rounded-xl bg-bg-darkSecondary border border-white/5 space-y-2">
                  <p className="font-bold text-white text-xs">{os}</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-gray-400 pl-1">
                    {steps.map(s => <li key={s}>{s}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          {/* OLLAMA */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="ollama" icon={Terminal} title="Ollama Setup" />
            <p>Lumina uses <strong className="text-white">Ollama</strong> to run LLMs locally. You must install it separately.</p>

            <div className="space-y-2">
              <p className="text-xs font-bold text-white">Step 1 — Install Ollama</p>
              <p className="text-xs text-gray-400">Go to <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="underline text-indigo-300">ollama.com</a> and download the installer for your OS. Run it.</p>

              <p className="text-xs font-bold text-white mt-3">Step 2 — Pull the recommended model</p>
              <CodeBlock code="ollama pull qwen3:8b" />
              <p className="text-xs text-gray-400">This downloads ~5 GB. It only needs to be done once.</p>

              <p className="text-xs font-bold text-white mt-3">Step 3 — Verify Ollama is running</p>
              <CodeBlock code="ollama list" />
              <p className="text-xs text-gray-400">You should see <code className="bg-white/5 px-1 rounded font-mono">qwen3:8b</code> listed.</p>
            </div>

            <Note type="warn">
              Ollama must be running <strong>before</strong> you launch Lumina. If Lumina can't connect, check that Ollama is active at <code className="bg-white/10 px-1 rounded font-mono">http://localhost:11434</code>.
            </Note>
          </section>

          {/* FIRST RUN */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="firstrun" icon={Zap} title="First Launch" />
            <p>On your first launch, Lumina will show the <strong className="text-white">Onboarding Wizard</strong> automatically.</p>
            <div className="space-y-2">
              {[
                ['Step 1', 'Ollama Connection Check', 'Lumina pings localhost:11434 to confirm Ollama is running.'],
                ['Step 2', 'Model Selection', 'Pick your model (qwen3:8b recommended). Lumina can pull it for you.'],
                ['Step 3', 'Hotkey Setup', 'Set your global activation hotkey (default: Ctrl+Shift+E).'],
                ['Step 4', 'Theme & Preferences', 'Choose dark or light mode, auto-start with Windows/macOS, etc.'],
                ['Step 5', 'Done!', 'Lumina hides to the system tray. Press your hotkey anywhere to activate.'],
              ].map(([step, title, desc]) => (
                <div key={step as string} className="flex gap-3 p-3 rounded-lg bg-bg-darkSecondary/50 border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-[10px] font-bold text-brand-primary flex items-center justify-center flex-shrink-0 font-mono mt-0.5">
                    {(step as string).split(' ')[1]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* HOTKEY USAGE */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="hotkey" icon={Keyboard} title="Using the Hotkey" />
            <p>This is the core feature of Lumina — global text processing from any application.</p>
            <div className="p-5 rounded-xl bg-bg-darkSecondary border border-white/5 space-y-3">
              <p className="text-xs font-bold text-white uppercase tracking-wider text-brand-primary">How it works</p>
              {[
                ['1', 'Select text', 'Highlight any text in any app on your computer'],
                ['2', 'Press hotkey', <>Hit <Kbd>Ctrl+Shift+E</Kbd> (or your custom hotkey)</>],
                ['3', 'Lumina opens', 'The floating overlay appears with your text pre-loaded'],
                ['4', 'Choose action', 'Select a preset (Professional Tone, Summarize, Translate, etc.) or type a custom prompt'],
                ['5', 'Review diff', 'See exactly what changed with a colour-coded visual diff'],
                ['6', 'Insert result', 'Click "Insert Text" — Lumina pastes the result back into your original app'],
              ].map(([n, title, desc]) => (
                <div key={n as string} className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                  <div>
                    <span className="text-xs font-semibold text-white">{title} </span>
                    <span className="text-xs text-gray-400">{typeof desc === 'string' ? desc : ''}</span>
                    {typeof desc !== 'string' && <span className="text-xs text-gray-400">{desc}</span>}
                  </div>
                </div>
              ))}
            </div>
            <Note type="tip">
              You can change the hotkey anytime in <strong>Settings → Hotkey</strong>. Avoid combinations used by other apps (like <Kbd>Ctrl+C</Kbd>).
            </Note>
          </section>

          {/* PROMPT TEMPLATES */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="templates" icon={Sparkles} title="Prompt Templates" />
            <p>Lumina ships with built-in preset actions. You can also create your own custom templates.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-2 pr-4 text-gray-400 font-semibold">Preset</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-semibold">What it does</th>
                    <th className="text-left py-2 text-gray-400 font-semibold">Shortcut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['👔 Professional Tone', 'Rewrites text to sound formal and polished', 'Ctrl+Shift+P'],
                    ['✨ Improve Writing', 'Fixes grammar, clarity, and flow', 'Ctrl+Shift+I'],
                    ['📝 Summarize', 'Condenses long text into key points', 'Ctrl+Shift+S'],
                    ['🌐 Translate', 'Translates to a target language', 'Ctrl+Shift+T'],
                    ['😊 Casual Tone', 'Makes text conversational and friendly', '—'],
                    ['🔍 Explain Simply', 'Rewrites technical content for beginners', '—'],
                  ].map(([name, desc, shortcut]) => (
                    <tr key={name as string}>
                      <td className="py-2 pr-4 text-white font-medium">{name}</td>
                      <td className="py-2 pr-4 text-gray-400">{desc}</td>
                      <td className="py-2"><Kbd>{shortcut as string}</Kbd></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400">To create a custom template, go to <strong className="text-white">Settings → Prompt Templates → + New Template</strong>. You can write a full system prompt and user prompt template.</p>
          </section>

          {/* CHAT PLAYGROUND */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="chat" icon={MessageSquare} title="Chat Playground" />
            <p>The <strong className="text-white">Chat Playground</strong> (click the chat icon in the header) lets you have a multi-turn conversation with your local model — similar to ChatGPT, but fully offline.</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-gray-400">
              <li>Supports markdown responses with code blocks</li>
              <li>Adjustable temperature and max token sliders</li>
              <li>Switch between all your installed Ollama models</li>
              <li>Conversation history is saved locally in SQLite</li>
            </ul>
          </section>

          {/* HISTORY */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="history" icon={History} title="History & Semantic Search" />
            <p>Every generation is saved locally. Open the <strong className="text-white">History</strong> tab (clock icon) to browse past prompts and results.</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-gray-400">
              <li><strong className="text-white">Keyword search</strong> — filters history by text content</li>
              <li><strong className="text-white">Semantic search</strong> — finds conceptually similar past prompts using local vector embeddings (requires a model like <code className="bg-white/5 px-1 rounded font-mono">nomic-embed-text</code>)</li>
              <li>Click any item to copy or re-run the result</li>
              <li>Clear all history from Settings</li>
            </ul>
            <Note type="tip">
              To enable semantic search, run: <code className="bg-white/10 px-2 py-0.5 rounded font-mono text-green-400">ollama pull nomic-embed-text</code> — then restart Lumina.
            </Note>
          </section>

          {/* RAG */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="rag" icon={Brain} title="Context Library (RAG)" />
            <p>The <strong className="text-white">Context Library</strong> lets you upload documents (style guides, brand guidelines, technical docs) that Lumina references when generating text.</p>
            <div className="space-y-2 text-xs text-gray-400">
              <p>Go to <strong className="text-white">Settings → Context Library → Add Document</strong>. Paste or upload your content.</p>
              <p>When you run a prompt, Lumina uses vector similarity to find the most relevant sections from your library and injects them as context into the model prompt — all locally.</p>
            </div>
            <Note type="info">
              RAG requires the <code className="bg-white/10 px-2 py-0.5 rounded font-mono text-indigo-300">nomic-embed-text</code> embedding model. Pull it with <code className="bg-white/10 px-2 py-0.5 rounded font-mono text-green-400">ollama pull nomic-embed-text</code>.
            </Note>
          </section>

          {/* SETTINGS */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="settings" icon={Settings} title="Settings" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-2 pr-4 text-gray-400 font-semibold">Setting</th>
                    <th className="text-left py-2 text-gray-400 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-400">
                  {[
                    ['Default Model', 'The Ollama model used for all generations'],
                    ['Temperature', 'Controls creativity (0 = deterministic, 1 = creative)'],
                    ['Max Tokens', 'Maximum response length'],
                    ['Global Hotkey', 'The keyboard shortcut to open the overlay'],
                    ['Theme', 'Dark or Light mode'],
                    ['Start at Login', 'Auto-launch Lumina when your computer starts'],
                    ['Prompt Templates', 'Create, edit, delete custom prompt presets'],
                    ['Context Library', 'Upload reference documents for RAG'],
                    ['Clear History', 'Wipe all saved generation history'],
                  ].map(([k, v]) => (
                    <tr key={k as string}>
                      <td className="py-2 pr-4 text-white font-medium">{k}</td>
                      <td className="py-2">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* MODELS */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="models" icon={Cpu} title="Choosing a Model" />
            <p>Lumina works with any model available in Ollama. Here are our recommendations:</p>
            <div className="space-y-2">
              {[
                { model: 'qwen3:8b', ram: '8 GB RAM', use: 'Default — great quality, fast on most machines', badge: 'Recommended' },
                { model: 'llama3.1:8b', ram: '8 GB RAM', use: 'Great all-rounder, strong reasoning', badge: '' },
                { model: 'mistral:7b', ram: '8 GB RAM', use: 'Fast, lightweight, good for simple edits', badge: '' },
                { model: 'gemma3:12b', ram: '16 GB RAM', use: 'Higher quality output, slower speed', badge: 'High RAM' },
                { model: 'llama3.1:70b', ram: '48 GB RAM', use: 'Best quality, requires workstation GPU', badge: 'Powerful' },
              ].map(({ model, ram, use, badge }) => (
                <div key={model} className="flex items-center gap-3 p-3 rounded-lg bg-bg-darkSecondary/50 border border-white/5">
                  <code className="text-xs text-green-400 font-mono bg-black/30 px-2 py-1 rounded w-36 flex-shrink-0">{model}</code>
                  <div className="flex-1">
                    <p className="text-xs text-gray-300">{use}</p>
                    <p className="text-[11px] text-gray-500">{ram}</p>
                  </div>
                  {badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-indigo-300 flex-shrink-0">{badge}</span>}
                </div>
              ))}
            </div>
            <CodeBlock code={`# Pull any model\nollama pull llama3.1:8b\n\n# List installed models\nollama list`} />
          </section>

          {/* SHORTCUTS */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="shortcuts" icon={Keyboard} title="All Keyboard Shortcuts" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-2 pr-6 text-gray-400 font-semibold">Shortcut</th>
                    <th className="text-left py-2 text-gray-400 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['Ctrl+Shift+E', 'Open Lumina overlay (global, customisable)'],
                    ['Ctrl+Shift+P', 'Apply Professional Tone preset'],
                    ['Ctrl+Shift+I', 'Improve Writing preset'],
                    ['Ctrl+Shift+S', 'Summarize preset'],
                    ['Ctrl+Shift+T', 'Translate preset'],
                    ['Esc', 'Close/hide the Lumina window'],
                  ].map(([k, v]) => (
                    <tr key={k as string}>
                      <td className="py-2 pr-6"><Kbd>{k}</Kbd></td>
                      <td className="py-2 text-gray-400">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-4 pt-6 border-t border-white/5">
            <SectionHead id="faq" icon={AlertTriangle} title="FAQ & Troubleshooting" />
            <div className="space-y-4">
              {[
                {
                  q: 'Lumina says "Ollama not running"',
                  a: 'Make sure Ollama is installed and started. Run `ollama serve` in a terminal, or launch the Ollama desktop app. Then restart Lumina.',
                },
                {
                  q: 'The hotkey doesn\'t work in some apps',
                  a: 'Some apps (e.g. games, full-screen apps) intercept keyboard shortcuts. Try a different hotkey combination in Settings. On macOS, ensure Lumina has Accessibility permissions in System Preferences.',
                },
                {
                  q: 'Windows SmartScreen blocks the installer',
                  a: 'Click "More info" → "Run anyway". Lumina is open source and safe. This warning appears because the app is not code-signed yet.',
                },
                {
                  q: 'macOS says "Lumina can\'t be opened because it\'s from an unidentified developer"',
                  a: 'Right-click the app → Open → Open. You only need to do this once. Or: System Preferences → Security & Privacy → Open Anyway.',
                },
                {
                  q: 'Generation is very slow',
                  a: 'This is normal on CPU-only machines with large models. Try switching to a smaller model (mistral:7b). For faster results, ensure you have a dedicated GPU and Ollama has GPU acceleration enabled.',
                },
                {
                  q: 'How do I update Lumina?',
                  a: 'Download the latest installer from the Download page and run it. Your settings and history are preserved.',
                },
                {
                  q: 'Where is my data stored?',
                  a: 'All data (settings, history, templates) is stored locally in a SQLite database in your app data folder. Nothing is ever sent to the internet.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="p-4 rounded-xl bg-bg-darkSecondary/50 border border-white/5 space-y-1.5">
                  <p className="text-xs font-bold text-white flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                    {q}
                  </p>
                  <p className="text-xs text-gray-400 pl-5">{a}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/15 text-xs text-center space-y-2">
              <p className="text-white font-semibold">Still need help?</p>
              <a
                href="https://github.com/rachanadn27-boop/lumina-ai/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open an issue on GitHub
              </a>
            </div>
          </section>

        </article>
      </div>
    </div>
  )
}
