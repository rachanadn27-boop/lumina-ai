import React from 'react'
import { Sparkles, Download, CheckCircle, Apple, Cpu, ShieldCheck } from 'lucide-react'

export default function DownloadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Download Lumina AI
        </h1>
        <p className="text-base text-gray-400 max-w-xl mx-auto">
          Choose the appropriate installer for your operating system. Ensure you have Ollama running locally.
        </p>
      </div>

      {/* OS Installers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Windows Card */}
        <div className="p-6 rounded-xl bg-bg-darkSecondary border border-white/5 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-lg">Windows</span>
            </div>
            <p className="text-xs text-gray-400">Supports Windows 10 and 11. Built-in setup assistant and tray app.</p>
          </div>
          <button className="w-full flex items-center justify-center space-x-2 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-lg transition">
            <Download className="w-4 h-4" />
            <span>Download Installer (.exe)</span>
          </button>
        </div>

        {/* MacOS Card */}
        <div className="p-6 rounded-xl bg-bg-darkSecondary border border-white/5 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-lg">macOS</span>
            </div>
            <p className="text-xs text-gray-400">Supports Apple Silicon (M1/M2/M3) and Intel processors.</p>
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center space-x-2 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-lg transition">
              <Apple className="w-4 h-4" />
              <span>Apple Silicon (.dmg)</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition">
              <Cpu className="w-4 h-4" />
              <span>Intel Chip (.dmg)</span>
            </button>
          </div>
        </div>

        {/* Linux Card */}
        <div className="p-6 rounded-xl bg-bg-darkSecondary border border-white/5 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-lg">Linux</span>
            </div>
            <p className="text-xs text-gray-400">Universal portable AppImage. Works on Ubuntu, Debian, Fedora, Arch.</p>
          </div>
          <button className="w-full flex items-center justify-center space-x-2 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-lg transition">
            <Download className="w-4 h-4" />
            <span>Download AppImage</span>
          </button>
        </div>
      </div>

      {/* System Requirements / Steps */}
      <div className="p-6 rounded-xl border border-white/5 bg-bg-darkSecondary/40 max-w-2xl mx-auto space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-brand-primary" />
          <span>Quick Setup Checklist</span>
        </h3>
        
        <ul className="text-xs text-gray-400 space-y-2.5">
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <span>Install <strong>Ollama</strong> (via <a href="https://ollama.com" target="_blank" className="underline text-white font-bold">ollama.com</a>).</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <span>Start Ollama and open the newly downloaded Lumina app.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <span>Let Lumina download <strong>qwen3:8b</strong> in the onboarding wizard.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <span>Highlight text, hit <strong>Ctrl+Shift+E</strong>, and write privately!</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
