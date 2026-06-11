import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import OnboardingWizard from './components/OnboardingWizard'
import FloatingPopup from './components/FloatingPopup'
import SettingsPanel from './components/SettingsPanel'
import HistoryPanel from './components/HistoryPanel'
import ChatPlayground from './components/ChatPlayground'
import { Sparkles, History, Settings, X, MessageSquare } from 'lucide-react'

export function App() {
  const {
    currentView,
    setView,
    initStore,
    setCapturedText,
    theme
  } = useAppStore()

  useEffect(() => {
    // Initialize DB data and load configurations
    initStore()

    // 1. Listen for global navigation triggers
    const cleanupNav = window.luminaAPI.on('app:navigate', (view: any) => {
      if (['onboarding', 'floating', 'settings', 'history', 'chat'].includes(view)) {
        setView(view)
      }
    })

    // 2. Listen for keyboard shortcut triggers
    const cleanupShortcut = window.luminaAPI.on('shortcut:triggered', (capturedText: string) => {
      setCapturedText(capturedText)
      setView('floating')
    })

    return () => {
      cleanupNav()
      cleanupShortcut()
    }
  }, [initStore, setView, setCapturedText])

  const handleClose = () => {
    window.luminaAPI.send('app:hide')
  }

  return (
    <div className={`w-full h-screen flex flex-col font-sans select-none border border-border-dark/80 rounded-xl overflow-hidden shadow-premium transition-colors duration-200 ${
      theme === 'dark' ? 'glass-container-dark text-text-darkPrimary' : 'glass-container-light text-text-lightPrimary'
    }`}>
      {/* Header Bar */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b ${
        theme === 'dark' ? 'border-border-dark/60 bg-bg-darkSecondary/40' : 'border-border-light bg-bg-lightSecondary/60'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-brand-primary to-purple-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-wide font-sans">Lumina</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
            theme === 'dark' ? 'bg-bg-darkTertiary text-brand-primary' : 'bg-bg-lightTertiary text-brand-primary'
          }`}>v1.0.0</span>
        </div>

        {/* Global Navigation Tabs (Except when in onboarding wizard) */}
        <div className="flex items-center space-x-1">
          {currentView !== 'onboarding' && (
            <>
              <button
                onClick={() => setView('floating')}
                className={`p-1.5 rounded-md transition-all ${
                  currentView === 'floating'
                    ? (theme === 'dark' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-primary/10 text-brand-primary')
                    : (theme === 'dark' ? 'text-text-darkSecondary hover:text-white hover:bg-bg-darkTertiary' : 'text-text-lightSecondary hover:text-text-lightPrimary hover:bg-bg-lightTertiary')
                }`}
                title="Assistant Popup"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('chat')}
                className={`p-1.5 rounded-md transition-all ${
                  currentView === 'chat'
                    ? (theme === 'dark' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-primary/10 text-brand-primary')
                    : (theme === 'dark' ? 'text-text-darkSecondary hover:text-white hover:bg-bg-darkTertiary' : 'text-text-lightSecondary hover:text-text-lightPrimary hover:bg-bg-lightTertiary')
                }`}
                title="Chat Playground"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('history')}
                className={`p-1.5 rounded-md transition-all ${
                  currentView === 'history'
                    ? (theme === 'dark' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-primary/10 text-brand-primary')
                    : (theme === 'dark' ? 'text-text-darkSecondary hover:text-white hover:bg-bg-darkTertiary' : 'text-text-lightSecondary hover:text-text-lightPrimary hover:bg-bg-lightTertiary')
                }`}
                title="History Logs"
              >
                <History className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('settings')}
                className={`p-1.5 rounded-md transition-all ${
                  currentView === 'settings'
                    ? (theme === 'dark' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-primary/10 text-brand-primary')
                    : (theme === 'dark' ? 'text-text-darkSecondary hover:text-white hover:bg-bg-darkTertiary' : 'text-text-lightSecondary hover:text-text-lightPrimary hover:bg-bg-lightTertiary')
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <div className={`h-4 w-[1px] mx-1 ${theme === 'dark' ? 'bg-border-dark' : 'bg-border-light'}`} />
            </>
          )}
          <button
            onClick={handleClose}
            className={`p-1 rounded-md transition-all ${
              theme === 'dark' ? 'text-text-darkSecondary hover:text-red-400 hover:bg-red-500/10' : 'text-text-lightSecondary hover:text-red-500 hover:bg-red-500/10'
            }`}
            title="Close Window"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {currentView === 'onboarding' && <OnboardingWizard />}
        {currentView === 'floating' && <FloatingPopup />}
        {currentView === 'chat' && <ChatPlayground />}
        {currentView === 'settings' && <SettingsPanel />}
        {currentView === 'history' && <HistoryPanel />}
      </div>
    </div>
  )
}

export default App
