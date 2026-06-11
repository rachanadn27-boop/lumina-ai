import React, { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { CheckCircle2, AlertCircle, Loader2, Download, Keyboard, Cpu, Sparkles, ArrowRight, RefreshCw } from 'lucide-react'

export function OnboardingWizard() {
  const {
    ollamaConnected,
    checkOllamaStatus,
    availableModels,
    pullModel,
    cancelPullModel,
    setOnboardingComplete,
    setView,
    shortcut,
    setShortcut,
    theme
  } = useAppStore()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [checking, setChecking] = useState(false)
  const [pulling, setPulling] = useState(false)
  const [pullStatus, setPullStatus] = useState<string>('')
  const [pullPercent, setPullPercent] = useState<number>(0)
  const [customKey, setCustomKey] = useState(shortcut)
  const [recordingKey, setRecordingKey] = useState(false)

  // Autocheck connection on load
  useEffect(() => {
    handleCheckConnection()
  }, [])

  // Listen to pull progress
  useEffect(() => {
    const cleanup = window.luminaAPI.on('ollama:pull-progress', (progress: any) => {
      setPullStatus(progress.status)
      setPullPercent(progress.percent)
    })
    return () => cleanup()
  }, [])

  const handleCheckConnection = async () => {
    setChecking(true)
    await checkOllamaStatus()
    setChecking(false)
  }

  const handleStartPull = async () => {
    setPulling(true)
    setPullStatus('Starting download...')
    setPullPercent(0)
    
    const success = await pullModel('qwen3:8b')
    setPulling(false)
    if (success) {
      setStep(3)
    } else {
      setPullStatus('Pull failed. Please check network/space and retry.')
    }
  }

  const handleFinish = async () => {
    await setOnboardingComplete(true)
    setView('floating')
  }

  const handleRecordKey = (e: React.KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const keys: string[] = []
    if (e.ctrlKey) keys.push('Ctrl')
    if (e.shiftKey) keys.push('Shift')
    if (e.altKey) keys.push('Alt')
    if (e.metaKey) keys.push('Meta')
    
    // Capture standard letters, numbers, or function keys
    if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Meta') {
      keys.push(e.key.toUpperCase())
    }

    if (keys.length > 1) {
      const binding = keys.join('+')
      setCustomKey(binding)
      setRecordingKey(false)
    }
  }

  const handleSaveShortcut = async () => {
    const success = await setShortcut(customKey)
    if (success) {
      alert(`Shortcut updated to ${customKey}`)
    } else {
      alert('Could not register shortcut key combination.')
    }
  }

  // Helper values
  const hasQwen = availableModels.some(m => m.startsWith('qwen3') || m.startsWith('qwen'))

  return (
    <div className="w-full h-full flex flex-col p-6 animate-fade-in">
      {/* Wizard Header Progress */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-brand-primary" />
          <h2 className="text-base font-bold font-sans">Setup Wizard</h2>
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s ? 'w-8 bg-brand-primary' : 'w-2 bg-gray-600/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main wizard cards */}
      <div className="flex-1 flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-sans">Connect Local AI Engine</h3>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-text-darkSecondary' : 'text-text-lightSecondary'}`}>
                Lumina runs entirely on your local machine to protect your privacy. It communicates with Ollama, the local AI runtime.
              </p>
            </div>

            {ollamaConnected ? (
              <div className={`p-4 rounded-lg flex items-start space-x-3 border ${
                theme === 'dark' ? 'bg-brand-success/10 border-brand-success/20 text-green-400' : 'bg-green-500/10 border-green-500/20 text-green-600'
              }`}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Ollama Detected</h4>
                  <p className="text-xs opacity-90 mt-1">Successfully connected to Ollama daemon running on port 11434.</p>
                </div>
              </div>
            ) : (
              <div className={`p-4 rounded-lg flex items-start space-x-3 border ${
                theme === 'dark' ? 'bg-brand-warning/10 border-brand-warning/20 text-amber-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
              }`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-semibold">Ollama Offline</h4>
                  <p className="text-xs opacity-90 mt-1">We couldn't connect to Ollama. Please ensure Ollama is installed and running.</p>
                  <a
                    href="https://ollama.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 text-xs font-bold underline text-brand-primary hover:text-brand-hover"
                  >
                    Download Ollama from ollama.com
                  </a>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleCheckConnection}
                disabled={checking}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  theme === 'dark' ? 'bg-bg-darkTertiary hover:bg-bg-darkTertiary/80 border border-border-dark' : 'bg-bg-lightTertiary hover:bg-bg-lightTertiary/80 border border-border-light'
                }`}
              >
                {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>Check Connection</span>
              </button>

              {ollamaConnected && (
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center space-x-2 px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-lg text-sm font-semibold ml-auto transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-sans">Pull AI Model</h3>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-text-darkSecondary' : 'text-text-lightSecondary'}`}>
                To process your text locally, Lumina requires an AI model. We recommend downloading **qwen3:8b** (Qwen 3 8-Billion model) which offers high speed and premium writing quality.
              </p>
            </div>

            {hasQwen ? (
              <div className={`p-4 rounded-lg flex items-start space-x-3 border ${
                theme === 'dark' ? 'bg-brand-success/10 border-brand-success/20 text-green-400' : 'bg-green-500/10 border-green-500/20 text-green-600'
              }`}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Model Installed</h4>
                  <p className="text-xs opacity-90 mt-1">Qwen model was detected locally. You are ready to proceed!</p>
                </div>
              </div>
            ) : pulling ? (
              <div className={`p-4 rounded-lg border space-y-3 ${
                theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
              }`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center space-x-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                    <span>{pullStatus}</span>
                  </span>
                  <span>{pullPercent}%</span>
                </div>
                <div className={`h-2 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-bg-darkTertiary' : 'bg-bg-lightTertiary'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-brand-primary to-purple-500 transition-all duration-300"
                    style={{ width: `${pullPercent}%` }}
                  />
                </div>
                <button
                  onClick={cancelPullModel}
                  className="text-xs text-red-400 hover:text-red-500 font-bold underline block"
                >
                  Cancel Download
                </button>
              </div>
            ) : (
              <div className={`p-4 rounded-lg flex items-center justify-between border ${
                theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
              }`}>
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-brand-primary" />
                  <div>
                    <h4 className="font-semibold text-sm">qwen3:8b</h4>
                    <p className={`text-xs ${theme === 'dark' ? 'text-text-darkSecondary' : 'text-text-lightSecondary'}`}>Approx size: 4.7 GB</p>
                  </div>
                </div>
                <button
                  onClick={handleStartPull}
                  className="px-4 py-1.5 bg-brand-primary hover:bg-brand-hover text-white rounded-md text-xs font-bold transition"
                >
                  Download Model
                </button>
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  theme === 'dark' ? 'bg-bg-darkTertiary hover:bg-bg-darkTertiary/80 border border-border-dark' : 'bg-bg-lightTertiary hover:bg-bg-lightTertiary/80 border border-border-light'
                }`}
              >
                Back
              </button>

              {(hasQwen || step === 2) && (
                <button
                  onClick={() => setStep(3)}
                  disabled={pulling}
                  className="flex items-center space-x-2 px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-lg text-sm font-semibold ml-auto transition disabled:opacity-50"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-sans">Configure Global Hotkey</h3>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-text-darkSecondary' : 'text-text-lightSecondary'}`}>
                Open Lumina from anywhere on your computer by selecting text and pressing this key combination.
              </p>
            </div>

            <div className={`p-5 rounded-lg border flex flex-col items-center space-y-4 ${
              theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
            }`}>
              <div className="flex items-center space-x-2">
                <Keyboard className="w-5 h-5 text-brand-primary" />
                <span className="text-xs font-bold uppercase tracking-wider">Trigger Combination</span>
              </div>

              {recordingKey ? (
                <div
                  onKeyDown={handleRecordKey}
                  tabIndex={0}
                  className="px-6 py-4 rounded-xl border border-dashed border-brand-primary bg-brand-primary/5 text-brand-primary font-mono text-lg font-bold outline-none cursor-pointer animate-pulse"
                >
                  Press keys now... (e.g. Ctrl+Shift+R)
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className={`px-5 py-3 rounded-lg border font-mono text-lg font-bold ${
                    theme === 'dark' ? 'bg-bg-darkTertiary border-border-dark text-brand-primary' : 'bg-bg-lightTertiary border-border-light text-brand-primary'
                  }`}>
                    {customKey}
                  </div>
                  <button
                    onClick={() => setRecordingKey(true)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      theme === 'dark' ? 'bg-bg-darkTertiary hover:bg-bg-darkTertiary/80 border border-border-dark' : 'bg-bg-lightTertiary hover:bg-bg-lightTertiary/80 border border-border-light'
                    }`}
                  >
                    Re-bind
                  </button>
                </div>
              )}

              {customKey !== shortcut && (
                <button
                  onClick={handleSaveShortcut}
                  className="px-4 py-1.5 bg-brand-primary hover:bg-brand-hover text-white rounded-md text-xs font-bold transition"
                >
                  Save Binding
                </button>
              )}
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  theme === 'dark' ? 'bg-bg-darkTertiary hover:bg-bg-darkTertiary/80 border border-border-dark' : 'bg-bg-lightTertiary hover:bg-bg-lightTertiary/80 border border-border-light'
                }`}
              >
                Back
              </button>

              <button
                onClick={handleFinish}
                className="flex items-center space-x-2 px-6 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-lg text-sm font-bold ml-auto transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Finish Setup</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OnboardingWizard
