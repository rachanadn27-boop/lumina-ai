'use client'
import React, { useState } from 'react'
import { Download, CheckCircle, ShieldCheck, Terminal, Cpu, ExternalLink, ChevronRight, Star } from 'lucide-react'

const REPO = 'rachanadn27-boop/lumina-ai'
const VERSION = '1.0.1'
const BASE_URL = `https://github.com/${REPO}/releases/latest/download`

const platforms = [
  {
    id: 'windows',
    name: 'Windows',
    badge: '10 / 11',
    description: 'Includes a setup assistant, system tray icon, and auto-start support. Works on 64-bit Windows 10 and 11.',
    icon: '🪟',
    downloads: [
      {
        label: 'Download Installer (.exe)',
        url: `${BASE_URL}/Lumina-Setup-${VERSION}.exe`,
        primary: true,
        sublabel: '~110 MB · NSIS Installer',
      },
      {
        label: 'Portable (.exe)',
        url: `${BASE_URL}/Lumina-${VERSION}.exe`,
        primary: false,
        sublabel: '~110 MB · No install needed',
      },
    ],
  },
  {
    id: 'macos',
    name: 'macOS',
    badge: '12+',
    description: 'Universal builds for Apple Silicon (M1/M2/M3) and Intel chips. Sits in your menu bar.',
    icon: '🍎',
    downloads: [
      {
        label: 'Apple Silicon (.dmg)',
        url: `${BASE_URL}/Lumina-${VERSION}-arm64.dmg`,
        primary: true,
        sublabel: '~120 MB · M1 / M2 / M3',
      },
      {
        label: 'Intel Chip (.dmg)',
        url: `${BASE_URL}/Lumina-${VERSION}-x64.dmg`,
        primary: false,
        sublabel: '~125 MB · Intel x64',
      },
    ],
  },
  {
    id: 'linux',
    name: 'Linux',
    badge: 'x64',
    description: 'Portable AppImage runs on Ubuntu, Debian, Fedora, Arch and most modern distros. No install required.',
    icon: '🐧',
    downloads: [
      {
        label: 'Download AppImage',
        url: `${BASE_URL}/Lumina-${VERSION}.AppImage`,
        primary: true,
        sublabel: '~115 MB · Universal portable',
      },
      {
        label: 'Debian Package (.deb)',
        url: `${BASE_URL}/Lumina-${VERSION}.deb`,
        primary: false,
        sublabel: '~110 MB · Ubuntu / Debian',
      },
    ],
  },
]

const steps = [
  {
    step: '1',
    title: 'Install Ollama',
    body: (
      <>
        Download and install{' '}
        <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white inline-flex items-center gap-1">
          Ollama <ExternalLink className="w-3 h-3" />
        </a>
        {' '}— the local LLM runtime that powers Lumina.
      </>
    ),
    code: null,
  },
  {
    step: '2',
    title: 'Pull the AI model',
    body: 'Open your terminal and run this command to download the qwen3:8b model (~5 GB).',
    code: 'ollama pull qwen3:8b',
  },
  {
    step: '3',
    title: 'Install & launch Lumina',
    body: 'Run the installer for your OS above. On first launch, the onboarding wizard will guide you through setup.',
    code: null,
  },
  {
    step: '4',
    title: 'Start writing privately!',
    body: 'Highlight any text in any app on your computer, press the hotkey, and Lumina rewrites it locally.',
    code: 'Ctrl + Shift + E',
  },
]

export default function DownloadPage() {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-bg-dark text-gray-200">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/25 text-xs text-indigo-300 font-bold mb-6">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span>Free & Open Source · v{VERSION}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-outfit mb-4">
            Download Lumina
          </h1>
          <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            Choose your platform below. All builds are free, unsigned (you may see a security warning — click <strong className="text-white">Run Anyway</strong>), and run 100% offline.
          </p>
          <a
            href={`https://github.com/${REPO}/releases/latest`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-xs text-indigo-300 hover:text-white transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View all releases on GitHub
          </a>
        </div>
      </div>

      {/* Platform Download Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {platforms.map((p) => (
            <div
              key={p.id}
              onMouseEnter={() => setHoveredPlatform(p.id)}
              onMouseLeave={() => setHoveredPlatform(null)}
              className={`p-6 rounded-2xl border flex flex-col justify-between space-y-5 transition-all duration-300 ${
                hoveredPlatform === p.id
                  ? 'bg-bg-darkSecondary border-brand-primary/40 shadow-[0_4px_30px_rgba(99,102,241,0.12)]'
                  : 'bg-bg-darkSecondary/60 border-white/5'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.icon}</span>
                    <span className="font-bold text-white text-lg font-outfit">{p.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-indigo-300 font-mono">
                    {p.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{p.description}</p>
              </div>

              <div className="space-y-2">
                {p.downloads.map((dl) => (
                  <a
                    key={dl.label}
                    href={dl.url}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                      dl.primary
                        ? 'bg-brand-primary hover:bg-brand-hover text-white shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 transform'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/8'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 flex-shrink-0" />
                      <div>
                        <div>{dl.label}</div>
                        <div className={`text-[10px] font-normal mt-0.5 ${dl.primary ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {dl.sublabel}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="mt-5 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-300/80 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-400" />
          <span>
            <strong className="text-yellow-300">Security notice:</strong> Lumina is not code-signed yet. Windows may show a SmartScreen warning — click <strong>"More info" → "Run anyway"</strong>. macOS users: right-click the .dmg → Open → Open. The app is open source — you can inspect every line on{' '}
            <a href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer" className="underline text-yellow-200">
              GitHub
            </a>.
          </span>
        </div>

        {/* Setup Steps */}
        <div className="mt-14">
          <h2 className="text-2xl font-extrabold text-white font-outfit text-center mb-8">Get Running in 4 Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="p-5 rounded-xl bg-bg-darkSecondary/50 border border-white/5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-xs font-bold text-brand-primary font-mono flex-shrink-0">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-white text-sm">{s.title}</h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed pl-10">{s.body}</p>
                {s.code && (
                  <div className="ml-10 flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg px-3 py-2">
                    <Terminal className="w-3 h-3 text-brand-primary flex-shrink-0" />
                    <code className="text-xs text-green-400 font-mono">{s.code}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <div className="mt-10 p-6 rounded-xl border border-white/5 bg-bg-darkSecondary/40 max-w-2xl mx-auto space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-brand-primary" />
            <span>System Requirements</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              ['OS', 'Windows 10/11, macOS 12+, Ubuntu 20+'],
              ['RAM', '8 GB minimum (16 GB recommended)'],
              ['Storage', '~7 GB free (model + app)'],
              ['GPU', 'Optional — CPU-only works fine'],
              ['Runtime', 'Ollama installed & running'],
              ['Internet', 'Only needed to pull the model once'],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <span className="text-gray-500 font-mono uppercase tracking-wider text-[10px]">{k}</span>
                <span className="text-gray-300">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to source */}
        <div className="mt-10 text-center">
          <a
            href={`https://github.com/${REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition"
          >
            <ExternalLink className="w-4 h-4" />
            View Source on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
