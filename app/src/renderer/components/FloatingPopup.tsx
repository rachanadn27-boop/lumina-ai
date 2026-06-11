import React, { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useOllamaStream } from '../hooks/useOllamaStream'
import DiffVisualizer from './DiffVisualizer'
import { Sparkles, Copy, Clipboard, Sliders, Check, Eye, Send, RefreshCcw } from 'lucide-react'

export function FloatingPopup() {
  const {
    capturedText,
    setCapturedText,
    generatedText,
    isGenerating,
    templates,
    theme,
    selectedModel,
    setSelectedModel,
    availableModels,
    temperature,
    setTemperature,
    shortcut
  } = useAppStore()

  const { startStream } = useOllamaStream()

  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [showParameters, setShowParameters] = useState(false)
  const [showDiff, setShowDiff] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pasted, setPasted] = useState(false)
  
  // Follow-up chat state
  const [followUpPrompt, setFollowUpPrompt] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input on open
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Keyboard navigation for command list
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGenerating || selectedTemplate) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % (templates.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + templates.length) % (templates.length || 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (templates[activeIndex]) {
          handleExecute(templates[activeIndex])
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, templates, isGenerating, selectedTemplate])

  const handleExecute = async (template: any) => {
    let textToProcess = capturedText
    if (!textToProcess || textToProcess.trim() === '') {
      // Try to read from clipboard as fallback
      const clipboardText = await window.luminaAPI.invoke('clipboard:read-captured')
      if (clipboardText && clipboardText.trim() !== '') {
        textToProcess = clipboardText
        setCapturedText(clipboardText)
      }
    }

    if (!textToProcess || textToProcess.trim() === '') {
      alert('Please select some text or paste it in the Captured Text box first!')
      return
    }

    setSelectedTemplate(template)
    startStream(textToProcess, template.name, template.system_instruction, template.user_template)
  }

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!followUpPrompt.trim() || isGenerating) return

    // Multi-turn context generation
    const followUpInstruction = `You are editing the previous text. The user wants you to apply this instruction: "${followUpPrompt}". Rewrite the text accordingly.`
    const promptWithHistory = `Original Text:\n${capturedText}\n\nCurrent Draft:\n${generatedText}\n\nTask: ${followUpPrompt}`
    
    startStream(promptWithHistory, `Refinement: ${followUpPrompt.substring(0, 15)}...`, followUpInstruction, '{{text}}')
    setFollowUpPrompt('')
  }

  const handleCopy = () => {
    window.luminaAPI.send('clipboard:write', generatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePasteBack = async () => {
    const success = await window.luminaAPI.invoke('clipboard:paste-back', generatedText)
    if (success) {
      setPasted(true)
      setTimeout(() => setPasted(false), 2000)
    }
  }

  const handleReset = () => {
    setSelectedTemplate(null)
    setCapturedText('')
  }

  return (
    <div className="w-full h-full flex flex-col p-4 animate-fade-in">
      {/* Parameters Dropdown Bar */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center space-x-2">
          {/* Model Switcher */}
          <div className="relative flex items-center space-x-1">
            <span className="opacity-60">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`px-2 py-0.5 rounded border outline-none font-semibold ${
                theme === 'dark'
                  ? 'bg-bg-darkTertiary border-border-dark text-brand-primary'
                  : 'bg-bg-lightTertiary border-border-light text-brand-primary'
              }`}
            >
              {availableModels.length > 0 ? (
                availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))
              ) : (
                <option value="qwen3:8b">qwen3:8b (Offline)</option>
              )}
            </select>
          </div>
        </div>

        {/* Temperature slider toggler */}
        <button
          onClick={() => setShowParameters(!showParameters)}
          className={`flex items-center space-x-1 px-2 py-1 rounded transition ${
            showParameters
              ? 'bg-brand-primary/10 text-brand-primary'
              : (theme === 'dark' ? 'hover:bg-bg-darkTertiary text-text-darkSecondary' : 'hover:bg-bg-lightTertiary text-text-lightSecondary')
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Parameters</span>
        </button>
      </div>

      {showParameters && (
        <div className={`p-3 rounded-lg border mb-3 flex items-center justify-between animate-fade-in ${
          theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
        }`}>
          <div className="flex-1 mr-4">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Temperature (Creativity)</span>
              <span>{temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-brand-primary"
            />
          </div>
          <div className="text-[10px] opacity-60 max-w-[150px]">
            Lower temp = more focused. Higher temp = more creative.
          </div>
        </div>
      )}

      {/* Captured Text Edit Area */}
      <div className={`p-3 rounded-lg border mb-3 flex items-start ${
        theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
      }`}>
        <div className="flex-1">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-1">Captured Text</label>
          <input
            ref={inputRef}
            type="text"
            value={capturedText}
            onChange={(e) => setCapturedText(e.target.value)}
            placeholder={`Select some text and press ${shortcut}, or type/paste here...`}
            className="w-full bg-transparent border-none outline-none text-xs"
          />
        </div>
      </div>

      {/* Layout Split */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {!selectedTemplate ? (
          // Action Command Selection List
          <div ref={listRef} className="w-full overflow-y-auto custom-scrollbar space-y-1 pr-1">
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-50 px-2.5 py-1">Select an AI action</div>
            {templates.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleExecute(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition duration-150 ${
                  activeIndex === index
                    ? (theme === 'dark' ? 'bg-bg-darkTertiary text-white border-l-2 border-brand-primary' : 'bg-bg-lightTertiary text-text-lightPrimary border-l-2 border-brand-primary')
                    : (theme === 'dark' ? 'text-text-darkSecondary hover:bg-bg-darkTertiary/50' : 'text-text-lightSecondary hover:bg-bg-lightTertiary/50')
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-brand-primary/80" />
                  <span className="text-xs font-semibold">{item.name}</span>
                </div>
                {item.shortcut && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    theme === 'dark' ? 'bg-bg-darkSecondary text-text-darkSecondary' : 'bg-bg-lightSecondary text-text-lightSecondary'
                  }`}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          // Results & Output Panel
          <div className="w-full flex flex-col min-h-0 space-y-3">
            {/* Diff View toggled */}
            {showDiff ? (
              <DiffVisualizer original={capturedText} modified={generatedText} theme={theme} />
            ) : (
              // Raw generation panel
              <div className={`flex-1 overflow-y-auto custom-scrollbar p-3 rounded-lg border text-xs leading-relaxed select-text ${
                theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark text-text-darkPrimary' : 'bg-bg-lightSecondary border-border-light text-text-lightPrimary'
              }`}>
                {isGenerating && !generatedText ? (
                  <div className="flex items-center space-x-2 opacity-50">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                    <span>Lumina is thinking...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-sans">{generatedText}</div>
                )}
              </div>
            )}

            {/* Bottom Actions Toolbar */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded font-semibold transition ${
                    theme === 'dark' ? 'bg-bg-darkTertiary hover:bg-bg-darkTertiary/80 text-white' : 'bg-bg-lightTertiary hover:bg-bg-lightTertiary/80 text-text-lightPrimary'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={handlePasteBack}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-primary hover:bg-brand-hover text-white rounded font-semibold transition"
                >
                  {pasted ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                  <span>{pasted ? 'Pasted!' : 'Insert Text'}</span>
                </button>

                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded transition ${
                    showDiff
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : (theme === 'dark' ? 'bg-bg-darkTertiary hover:bg-bg-darkTertiary/80' : 'bg-bg-lightTertiary hover:bg-bg-lightTertiary/80')
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Diff</span>
                </button>
              </div>

              <button
                onClick={handleReset}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded transition ${
                  theme === 'dark' ? 'hover:bg-bg-darkTertiary text-text-darkSecondary hover:text-white' : 'hover:bg-bg-lightTertiary text-text-lightSecondary hover:text-text-lightPrimary'
                }`}
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Follow-up Refine Chat Form */}
            <form onSubmit={handleFollowUpSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                value={followUpPrompt}
                onChange={(e) => setFollowUpPrompt(e.target.value)}
                placeholder="Ask Lumina to refine the output (e.g. 'make it shorter')..."
                className={`flex-1 px-3 py-2 rounded-lg border text-xs outline-none ${
                  theme === 'dark'
                    ? 'bg-bg-darkSecondary border-border-dark text-text-darkPrimary focus:border-brand-primary'
                    : 'bg-bg-lightSecondary border-border-light text-text-lightPrimary focus:border-brand-primary'
                }`}
              />
              <button
                type="submit"
                disabled={isGenerating || !followUpPrompt.trim()}
                className="p-2 bg-brand-primary hover:bg-brand-hover text-white rounded-lg transition disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

// Compact spin loader
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-loader-2 animate-spin ${className}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default FloatingPopup
