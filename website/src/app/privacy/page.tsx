import React from 'react'
import { ShieldAlert, EyeOff, ServerOff, Check } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Effective Date: June 10, 2026</p>
      </div>

      {/* Intro */}
      <div className="p-4 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-xs text-brand-primary font-semibold flex items-center space-x-3">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <span>Lumina is a local-only writing assistant. No telemetry, tracking, or cloud uploads exist in the codebase.</span>
      </div>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <EyeOff className="w-4 h-4 text-brand-primary" />
            <span>1. Zero Data Collection</span>
          </h2>
          <p>Lumina does not collect any personal data, highlighted text, prompt templates, settings, or search histories. All inputs and generated results are saved directly to a local database file on your device and are never broadcasted.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <ServerOff className="w-4 h-4 text-brand-primary" />
            <span>2. Zero Cloud Processing</span>
          </h2>
          <p>Text generation is handled offline by your local Ollama runtime. Lumina does not connect to external servers or API providers (like OpenAI, Anthropic, or proprietary microservices) to process your text.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Third-Party Integrations</h2>
          <p>Lumina contains no tracking codes, analytics engines (like Google Analytics or PostHog), or telemetry scripts. The software operates entirely inside an isolated local desktop environment.</p>
        </section>
      </div>

    </div>
  )
}
