import React, { useState } from 'react'
import { useAppStore, PromptTemplate } from '../store/useAppStore'
import { Sliders, Keyboard, Sun, Moon, Trash2, Plus, Edit, Sparkles, FolderOpen, Save, Undo } from 'lucide-react'

export function SettingsPanel() {
  const {
    theme,
    setTheme,
    shortcut,
    setShortcut,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    startupOnBoot,
    setStartupOnBoot,
    templates,
    saveTemplate,
    deleteTemplate,
    documents,
    saveDocument,
    deleteDocument
  } = useAppStore()

  const [activeTab, setActiveTab] = useState<'general' | 'templates' | 'context'>('general')

  // General Settings States
  const [customKey, setCustomKey] = useState(shortcut)
  const [recordingKey, setRecordingKey] = useState(false)

  // Custom Template form States
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null)
  const [tempName, setTempName] = useState('')
  const [tempSystem, setTempSystem] = useState('')
  const [tempUser, setTempUser] = useState('')
  const [tempShortcut, setTempShortcut] = useState('')

  // Context Document Form States
  const [docTitle, setDocTitle] = useState('')
  const [docContent, setDocContent] = useState('')

  // ------------------------------------
  // Keybinding Capture handler
  // ------------------------------------
  const handleRecordKey = (e: React.KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const keys: string[] = []
    if (e.ctrlKey) keys.push('Ctrl')
    if (e.shiftKey) keys.push('Shift')
    if (e.altKey) keys.push('Alt')
    if (e.metaKey) keys.push('Meta')
    
    if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Meta') {
      keys.push(e.key.toUpperCase())
    }

    if (keys.length > 1) {
      setCustomKey(keys.join('+'))
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

  // ------------------------------------
  // Templates Management handlers
  // ------------------------------------
  const handleCreateNewTemplate = () => {
    setEditingTemplate({
      id: 'template_' + Math.random().toString(36).substring(2, 9),
      name: '',
      system_instruction: '',
      user_template: 'Rewrite this:\n\n{{text}}',
      icon: 'Sparkles',
      shortcut: '',
      is_custom: 1
    })
    setTempName('')
    setTempSystem('')
    setTempUser('Rewrite this:\n\n{{text}}')
    setTempShortcut('')
  }

  const handleEditTemplate = (t: PromptTemplate) => {
    setEditingTemplate(t)
    setTempName(t.name)
    setTempSystem(t.system_instruction)
    setTempUser(t.user_template)
    setTempShortcut(t.shortcut)
  }

  const handleSaveTemplateForm = async () => {
    if (!editingTemplate || !tempName.trim() || !tempSystem.trim()) return
    await saveTemplate({
      ...editingTemplate,
      name: tempName,
      system_instruction: tempSystem,
      user_template: tempUser,
      shortcut: tempShortcut
    })
    setEditingTemplate(null)
  }

  // ------------------------------------
  // Context Document uploads
  // ------------------------------------
  const handleSaveDoc = async () => {
    if (!docTitle.trim() || !docContent.trim()) return
    await saveDocument(docTitle, docContent)
    setDocTitle('')
    setDocContent('')
  }

  return (
    <div className="w-full h-full flex flex-col p-4 animate-fade-in min-h-0">
      
      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-gray-500/20 pb-2 mb-4">
        {[
          { id: 'general', label: 'Preferences', icon: Sliders },
          { id: 'templates', label: 'Actions Customizer', icon: Sparkles },
          { id: 'context', label: 'Context Library', icon: FolderOpen }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any)
                setEditingTemplate(null)
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === tab.id
                  ? (theme === 'dark' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-primary/10 text-brand-primary')
                  : (theme === 'dark' ? 'text-text-darkSecondary hover:bg-bg-darkTertiary/50 hover:text-white' : 'text-text-lightSecondary hover:bg-bg-lightTertiary/50 hover:text-text-lightPrimary')
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Settings content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        
        {/* PREFERENCES TAB */}
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-lg">
            {/* Global shortcut config */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center space-x-1">
                <Keyboard className="w-4 h-4 text-brand-primary" />
                <span>Global Shortcut</span>
              </label>
              <div className="flex items-center space-x-2">
                {recordingKey ? (
                  <div
                    onKeyDown={handleRecordKey}
                    tabIndex={0}
                    className="px-4 py-2 border border-dashed border-brand-primary rounded bg-brand-primary/5 text-brand-primary font-mono text-xs font-bold outline-none cursor-pointer"
                  >
                    Press key combination...
                  </div>
                ) : (
                  <>
                    <div className={`px-4 py-2 rounded font-mono text-xs font-bold border ${
                      theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
                    }`}>
                      {customKey}
                    </div>
                    <button
                      onClick={() => setRecordingKey(true)}
                      className={`px-3 py-2 rounded text-xs font-bold transition ${
                        theme === 'dark' ? 'bg-bg-darkTertiary hover:bg-bg-darkTertiary/80 border border-border-dark' : 'bg-bg-lightTertiary hover:bg-bg-lightTertiary/80 border border-border-light'
                      }`}
                    >
                      Re-bind
                    </button>
                    {customKey !== shortcut && (
                      <button
                        onClick={handleSaveShortcut}
                        className="px-3 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded text-xs font-bold transition"
                      >
                        Save
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Theme selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-60">Visual Theme</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-xs font-bold border transition ${
                    theme === 'dark'
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : 'border-border-light text-text-lightSecondary hover:bg-bg-lightTertiary'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Mode</span>
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-xs font-bold border transition ${
                    theme === 'light'
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : 'border-border-dark text-text-darkSecondary hover:bg-bg-darkTertiary'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Mode</span>
                </button>
              </div>
            </div>

            {/* AI Parameters controls */}
            <div className="space-y-4 pt-2 border-t border-gray-500/10">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">AI Configurations</h4>
              
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
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

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span>Max Tokens</span>
                  <span>{maxTokens}</span>
                </div>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  className={`px-3 py-1.5 rounded border text-xs font-semibold outline-none focus:border-brand-primary ${
                    theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
                  }`}
                />
              </div>

              {/* Startup behavior toggles */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold">Launch Lumina automatically on startup</span>
                <input
                  type="checkbox"
                  checked={startupOnBoot}
                  onChange={(e) => setStartupOnBoot(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS CUSTOMIZER TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {!editingTemplate ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">Custom Actions List</span>
                  <button
                    onClick={handleCreateNewTemplate}
                    className="flex items-center space-x-1 px-3 py-1 bg-brand-primary hover:bg-brand-hover text-white rounded-md text-xs font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Custom Action</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {templates.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-lg border flex flex-col justify-between ${
                        theme === 'dark' ? 'bg-bg-darkSecondary/40 border-border-dark' : 'bg-bg-lightSecondary border-border-light'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold">{t.name}</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                            t.is_custom ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {t.is_custom ? 'User' : 'System'}
                          </span>
                        </div>
                        <p className="text-[10px] opacity-75 line-clamp-2">{t.system_instruction}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-500/10 pt-2 mt-3 text-xs">
                        <span className="text-[9px] font-mono opacity-50">{t.shortcut || 'No shortcut'}</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditTemplate(t)}
                            className="p-1 hover:text-brand-primary transition"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {t.is_custom === 1 && (
                            <button
                              onClick={() => deleteTemplate(t.id)}
                              className="p-1 hover:text-red-400 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // Create / Edit Template Form
              <div className={`p-4 rounded-lg border space-y-4 animate-fade-in ${
                theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
              }`}>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {editingTemplate.name ? `Editing: ${editingTemplate.name}` : 'New Custom Action'}
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold">Action Name (e.g. "Emoji Replacer")</label>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className={`px-3 py-2 border rounded outline-none focus:border-brand-primary ${
                        theme === 'dark' ? 'bg-bg-darkTertiary border-border-dark' : 'bg-bg-lightTertiary border-border-light'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold">System Instructions (Lays out LLM role behavior)</label>
                    <textarea
                      rows={3}
                      value={tempSystem}
                      onChange={(e) => setTempSystem(e.target.value)}
                      placeholder="You are an emoji translator..."
                      className={`px-3 py-2 border rounded outline-none focus:border-brand-primary font-mono text-[11px] ${
                        theme === 'dark' ? 'bg-bg-darkTertiary border-border-dark' : 'bg-bg-lightTertiary border-border-light'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold">User Template Prompt</label>
                    <textarea
                      rows={3}
                      value={tempUser}
                      onChange={(e) => setTempUser(e.target.value)}
                      className={`px-3 py-2 border rounded outline-none focus:border-brand-primary font-mono text-[11px] ${
                        theme === 'dark' ? 'bg-bg-darkTertiary border-border-dark' : 'bg-bg-lightTertiary border-border-light'
                      }`}
                    />
                    <span className="text-[10px] opacity-50 font-sans">Use **{"{{text}}"}** to represent the user's highlighted text.</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2 text-xs font-bold">
                  <button
                    onClick={() => setEditingTemplate(null)}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg border transition ${
                      theme === 'dark' ? 'bg-bg-darkTertiary hover:bg-bg-darkTertiary/85 border-border-dark' : 'bg-bg-lightTertiary hover:bg-bg-lightTertiary/85 border-border-light'
                    }`}
                  >
                    <Undo className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>

                  <button
                    onClick={handleSaveTemplateForm}
                    className="flex items-center space-x-1 px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-lg transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Action</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTEXT LIBRARY TAB */}
        {activeTab === 'context' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border space-y-3 ${
              theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
            }`}>
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">Add Reference Document</span>
              
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Document Title (e.g. 'Company Tone Guide')"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className={`w-full px-3 py-2 border rounded outline-none focus:border-brand-primary ${
                    theme === 'dark' ? 'bg-bg-darkTertiary border-border-dark' : 'bg-bg-lightTertiary border-border-light'
                  }`}
                />
                <textarea
                  rows={4}
                  placeholder="Paste style rules, guidelines, project specs, or custom references..."
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className={`w-full px-3 py-2 border rounded outline-none focus:border-brand-primary font-mono text-[11px] ${
                    theme === 'dark' ? 'bg-bg-darkTertiary border-border-dark' : 'bg-bg-lightTertiary border-border-light'
                  }`}
                />
                <button
                  onClick={handleSaveDoc}
                  disabled={!docTitle.trim() || !docContent.trim()}
                  className="flex items-center space-x-1 px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-lg font-bold transition disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Index Context</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">Indexed RAG Context Library ({documents.length})</span>
              
              {documents.length === 0 ? (
                <div className="text-xs opacity-50 text-center py-6">No context guides indexed. Upload one above.</div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                        theme === 'dark' ? 'bg-bg-darkSecondary/40 border-border-dark' : 'bg-bg-lightSecondary border-border-light'
                      }`}
                    >
                      <div className="min-w-0 pr-4">
                        <span className="font-bold block truncate">{doc.title}</span>
                        <span className="text-[10px] opacity-50 block truncate">{doc.content}</span>
                      </div>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="text-red-400 hover:text-red-500 transition p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsPanel
