import { create } from 'zustand'

export interface PromptTemplate {
  id: string
  name: string
  system_instruction: string
  user_template: string
  icon: string
  shortcut: string
  is_custom: number
}

export interface HistoryRecord {
  id: string
  original_text: string
  generated_text: string
  prompt_action: string
  model_used: string
  temperature: number
  created_at: string
}

export interface ContextDocument {
  id: string
  title: string
  content: string
  created_at: string
}

interface AppState {
  // Screens & Navigation
  currentView: 'floating' | 'onboarding' | 'settings' | 'history' | 'chat'
  setView: (view: 'floating' | 'onboarding' | 'settings' | 'history' | 'chat') => void
  
  // Settings & Theme
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => Promise<void>
  shortcut: string
  setShortcut: (shortcut: string) => Promise<boolean>
  temperature: number
  setTemperature: (temp: number) => Promise<void>
  maxTokens: number
  setMaxTokens: (tokens: number) => Promise<void>
  onboardingComplete: boolean
  setOnboardingComplete: (complete: boolean) => Promise<void>
  startupOnBoot: boolean
  setStartupOnBoot: (status: boolean) => Promise<void>

  // AI & Ollama State
  ollamaConnected: boolean
  checkOllamaStatus: () => Promise<boolean>
  availableModels: string[]
  fetchAvailableModels: () => Promise<void>
  selectedModel: string
  setSelectedModel: (model: string) => Promise<void>
  
  // Capture & Generation
  capturedText: string
  setCapturedText: (text: string) => void
  generatedText: string
  setGeneratedText: (text: string) => void
  isGenerating: boolean
  setIsGenerating: (status: boolean) => void

  // Data collections
  templates: PromptTemplate[]
  fetchTemplates: () => Promise<void>
  saveTemplate: (template: PromptTemplate) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  
  documents: ContextDocument[]
  fetchDocuments: () => Promise<void>
  saveDocument: (title: string, content: string) => Promise<void>
  deleteDocument: (id: string) => Promise<void>

  history: HistoryRecord[]
  fetchHistory: () => Promise<void>
  saveHistory: (original: string, generated: string, action: string) => Promise<void>
  clearHistory: () => Promise<void>

  // Pulling Model Status
  pullProgress: { status: string; percent: number } | null
  setPullProgress: (progress: { status: string; percent: number } | null) => void
  pullModel: (modelName: string) => Promise<boolean>
  cancelPullModel: () => void

  // Initialize store from SQLite
  initStore: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'floating',
  setView: (view) => set({ currentView: view }),

  theme: 'dark',
  setTheme: async (theme) => {
    set({ theme })
    await window.luminaAPI.invoke('db:save-setting', 'theme', theme)
  },

  shortcut: 'Ctrl+Shift+R',
  setShortcut: async (shortcut) => {
    const success = await window.luminaAPI.invoke('shortcut:update', shortcut)
    if (success) {
      set({ shortcut })
    }
    return success
  },

  temperature: 0.7,
  setTemperature: async (temp) => {
    set({ temperature: temp })
    await window.luminaAPI.invoke('db:save-setting', 'temperature', String(temp))
  },

  maxTokens: 2048,
  setMaxTokens: async (tokens) => {
    set({ maxTokens: tokens })
    await window.luminaAPI.invoke('db:save-setting', 'max_tokens', String(tokens))
  },

  onboardingComplete: false,
  setOnboardingComplete: async (complete) => {
    set({ onboardingComplete: complete })
    await window.luminaAPI.invoke('db:save-setting', 'onboarding_complete', String(complete))
  },

  startupOnBoot: false,
  setStartupOnBoot: async (status) => {
    set({ startupOnBoot: status })
    await window.luminaAPI.invoke('app:set-boot-status', status)
  },

  ollamaConnected: false,
  checkOllamaStatus: async () => {
    const connected = await window.luminaAPI.invoke('ollama:status')
    set({ ollamaConnected: connected })
    if (connected) {
      await get().fetchAvailableModels()
    }
    return connected
  },

  availableModels: [],
  fetchAvailableModels: async () => {
    const models = await window.luminaAPI.invoke('ollama:list-models')
    set({ availableModels: models })
  },

  selectedModel: 'qwen3:8b',
  setSelectedModel: async (model) => {
    set({ selectedModel: model })
    await window.luminaAPI.invoke('db:save-setting', 'default_model', model)
  },

  capturedText: '',
  setCapturedText: (text) => set({ capturedText: text }),

  generatedText: '',
  setGeneratedText: (text) => set({ generatedText: text }),

  isGenerating: false,
  setIsGenerating: (status) => set({ isGenerating: status }),

  templates: [],
  fetchTemplates: async () => {
    const list = await window.luminaAPI.invoke('db:get-templates')
    set({ templates: list })
  },

  saveTemplate: async (t) => {
    await window.luminaAPI.invoke(
      'db:save-template',
      t.id,
      t.name,
      t.system_instruction,
      t.user_template,
      t.icon,
      t.shortcut,
      t.is_custom
    )
    await get().fetchTemplates()
  },

  deleteTemplate: async (id) => {
    await window.luminaAPI.invoke('db:delete-template', id)
    await get().fetchTemplates()
  },

  documents: [],
  fetchDocuments: async () => {
    const docs = await window.luminaAPI.invoke('db:get-documents')
    set({ documents: docs })
  },

  saveDocument: async (title, content) => {
    const id = 'doc_' + Math.random().toString(36).substring(2, 9)
    await window.luminaAPI.invoke('db:save-document', id, title, content)
    await get().fetchDocuments()
  },

  deleteDocument: async (id) => {
    await window.luminaAPI.invoke('db:delete-document', id)
    await get().fetchDocuments()
  },

  history: [],
  fetchHistory: async () => {
    const records = await window.luminaAPI.invoke('db:get-history')
    set({ history: records })
  },

  saveHistory: async (original, generated, action) => {
    const id = 'hist_' + Math.random().toString(36).substring(2, 9)
    await window.luminaAPI.invoke(
      'db:save-history',
      id,
      original,
      generated,
      action,
      get().selectedModel,
      get().temperature
    )
    await get().fetchHistory()
  },

  clearHistory: async () => {
    await window.luminaAPI.invoke('db:clear-history')
    set({ history: [] })
  },

  pullProgress: null,
  setPullProgress: (progress) => set({ pullProgress: progress }),

  pullModel: async (modelName) => {
    return window.luminaAPI.invoke('ollama:pull-model', modelName)
  },

  cancelPullModel: () => {
    window.luminaAPI.send('ollama:pull-model-cancel')
    set({ pullProgress: null })
  },

  initStore: async () => {
    try {
      // 1. Get raw settings from DB
      const settingsList: Array<{ key: string; value: string }> = await window.luminaAPI.invoke('db:get-settings')
      const settingsMap = settingsList.reduce((acc, curr) => {
        acc[curr.key] = curr.value
        return acc
      }, {} as Record<string, string>)

      // 2. Set theme, shortcut, and parameters
      const dbTheme = (settingsMap['theme'] as 'dark' | 'light') || 'dark'
      const dbShortcut = settingsMap['shortcut'] || 'Ctrl+Shift+R'
      const dbTemp = Number(settingsMap['temperature'] || 0.7)
      const dbMaxTokens = Number(settingsMap['max_tokens'] || 2048)
      const dbModel = settingsMap['default_model'] || 'qwen3:8b'
      const onboardingComplete = settingsMap['onboarding_complete'] === 'true'

      // Get boot startup status
      const bootStatus = await window.luminaAPI.invoke('app:get-boot-status')

      set({
        theme: dbTheme,
        shortcut: dbShortcut,
        temperature: dbTemp,
        maxTokens: dbMaxTokens,
        selectedModel: dbModel,
        onboardingComplete,
        startupOnBoot: bootStatus
      })

      // Apply HTML theme class
      const root = window.document.documentElement
      root.classList.remove('theme-light', 'theme-dark', 'light', 'dark')
      root.classList.add(`theme-${dbTheme}`, dbTheme)

      // Load data collections
      await get().fetchTemplates()
      await get().fetchHistory()
      await get().fetchDocuments()
      await get().checkOllamaStatus()
    } catch (err) {
      console.error('Failed to initialize local settings store:', err)
    }
  }
}))
