import { useState, useMemo } from 'react'
import { useAppStore, HistoryRecord } from '../store/useAppStore'
import { Search, Download, Trash2, Calendar, Sparkles, Brain, Check } from 'lucide-react'

// Cosine similarity for local vector comparison
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export function HistoryPanel() {
  const { history, clearHistory, theme, ollamaConnected } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [useSemantic, setUseSemantic] = useState(false)
  const [semanticResults, setSemanticResults] = useState<Record<string, number>>({})
  const [searchingSemantic, setSearchingSemantic] = useState(false)
  const [activeItem, setActiveItem] = useState<HistoryRecord | null>(null)

  // CSV Exporter
  const handleExportCSV = () => {
    if (history.length === 0) return

    // Escape CSV values
    const escapeCsv = (str: string) => {
      if (!str) return '""'
      const escaped = str.replace(/"/g, '""')
      return `"${escaped}"`
    }

    const headers = ['ID', 'Prompt Action', 'Model Used', 'Temperature', 'Original Text', 'Generated Text', 'Created At']
    const rows = history.map(h => [
      h.id,
      h.prompt_action,
      h.model_used,
      h.temperature,
      escapeCsv(h.original_text),
      escapeCsv(h.generated_text),
      h.created_at
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    triggerDownload(csvContent, 'lumina_history.csv', 'text/csv;charset=utf-8;')
  }

  // JSON Exporter
  const handleExportJSON = () => {
    if (history.length === 0) return
    const jsonString = JSON.stringify(history, null, 2)
    triggerDownload(jsonString, 'lumina_history.json', 'application/json;charset=utf-8;')
  }

  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Trigger Local Semantic Search
  const handleSemanticSearch = async () => {
    if (!searchQuery.trim() || !ollamaConnected) return
    
    setSearchingSemantic(true)
    try {
      // 1. Generate embedding for query
      const queryVec: number[] = await window.luminaAPI.invoke('ollama:embed', searchQuery)
      if (queryVec.length === 0) {
        alert('Could not compute query embedding. Ensure nomic-embed-text model is loaded.')
        setSearchingSemantic(false)
        return
      }

      const scores: Record<string, number> = {}
      
      // 2. Loop and compare vectors
      for (const item of history) {
        // Fallback: If item does not have embedding, lazily create one
        let itemVec: number[] = (item as any).embedding ? Array.from(new Float32Array((item as any).embedding)) : []
        if (itemVec.length === 0) {
          itemVec = await window.luminaAPI.invoke('ollama:embed', item.original_text)
        }
        
        if (itemVec.length > 0) {
          scores[item.id] = cosineSimilarity(queryVec, itemVec)
        }
      }
      
      setSemanticResults(scores)
      setUseSemantic(true)
    } catch (e) {
      console.error('Semantic search failed:', e)
    } finally {
      setSearchingSemantic(false)
    }
  }

  // Clear query and disable semantic mode
  const handleClearSearch = () => {
    setSearchQuery('')
    setUseSemantic(false)
    setSemanticResults({})
  }

  // Compute final filtered list
  const filteredHistory = useMemo(() => {
    if (useSemantic) {
      return [...history]
        .filter(item => semanticResults[item.id] !== undefined)
        .sort((a, b) => (semanticResults[b.id] || 0) - (semanticResults[a.id] || 0))
    }

    if (!searchQuery.trim()) return history

    const query = searchQuery.toLowerCase()
    return history.filter(h =>
      h.prompt_action.toLowerCase().includes(query) ||
      h.original_text.toLowerCase().includes(query) ||
      h.generated_text.toLowerCase().includes(query)
    )
  }, [history, searchQuery, useSemantic, semanticResults])

  return (
    <div className="w-full h-full flex flex-col p-4 animate-fade-in min-h-0">
      
      {/* Search and Action Bar */}
      <div className="flex items-center space-x-2 mb-3">
        <div className={`flex-1 flex items-center px-3 py-1.5 rounded-lg border text-xs focus-within:border-brand-primary ${
          theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
        }`}>
          <Search className="w-4 h-4 opacity-50 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompt, original text, or results..."
            className="flex-1 bg-transparent border-none outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSemanticSearch()
            }}
          />
          {searchQuery && (
            <button onClick={handleClearSearch} className="text-[10px] opacity-60 hover:opacity-100 font-bold px-1">Clear</button>
          )}
        </div>

        {/* Semantic Vector Toggler */}
        <button
          onClick={useSemantic ? handleClearSearch : handleSemanticSearch}
          disabled={!ollamaConnected || !searchQuery.trim()}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition disabled:opacity-40 ${
            useSemantic
              ? 'bg-brand-primary border-brand-primary text-white'
              : (theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark text-text-darkSecondary hover:text-white' : 'bg-bg-lightSecondary border-border-light text-text-lightSecondary hover:text-text-lightPrimary')
          }`}
          title="Search by meaning using local vector embeddings"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>{searchingSemantic ? 'Thinking...' : 'AI Semantic'}</span>
        </button>
      </div>

      {/* Export Toolbar */}
      <div className="flex items-center justify-between text-xs mb-3">
        <span className="opacity-60 font-semibold">{filteredHistory.length} logs found</span>
        
        {history.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded transition ${
                theme === 'dark' ? 'bg-bg-darkTertiary hover:bg-bg-darkTertiary/80' : 'bg-bg-lightTertiary hover:bg-bg-lightTertiary/80'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded transition ${
                theme === 'dark' ? 'bg-bg-darkTertiary hover:bg-bg-darkTertiary/80' : 'bg-bg-lightTertiary hover:bg-bg-lightTertiary/80'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={clearHistory}
              className="flex items-center space-x-1 px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Split Content */}
      <div className="flex-1 flex overflow-hidden min-h-0 space-x-4">
        {/* Left Side: History List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-xs py-8">
              <span>No history matches found</span>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const semanticScore = semanticResults[item.id]
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`w-full text-left p-3 rounded-lg border transition duration-150 relative ${
                    activeItem?.id === item.id
                      ? (theme === 'dark' ? 'bg-bg-darkTertiary border-brand-primary' : 'bg-bg-lightTertiary border-brand-primary')
                      : (theme === 'dark' ? 'bg-bg-darkSecondary/40 border-border-dark hover:bg-bg-darkTertiary/30' : 'bg-bg-lightSecondary border-border-light hover:bg-bg-lightTertiary/30')
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                      <span className="text-xs font-bold">{item.prompt_action}</span>
                    </div>
                    {semanticScore !== undefined && (
                      <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">
                        Match: {Math.round(semanticScore * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] opacity-75 line-clamp-2 mb-2">{item.original_text}</p>
                  <div className="flex items-center justify-between text-[10px] opacity-50 font-mono">
                    <span>{item.model_used}</span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Right Side: Active Inspector Panel */}
        {activeItem && (
          <div className={`w-80 flex flex-col p-3 rounded-lg border overflow-y-auto custom-scrollbar space-y-3 select-text ${
            theme === 'dark' ? 'bg-bg-darkSecondary border-border-dark' : 'bg-bg-lightSecondary border-border-light'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 border-gray-500/20">
              <span className="text-xs font-bold">Details</span>
              <button
                onClick={() => {
                  window.luminaAPI.send('clipboard:write', activeItem.generated_text)
                  alert('Copied to clipboard!')
                }}
                className="flex items-center space-x-1 text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded"
              >
                <Check className="w-3 h-3" />
                <span>Copy Output</span>
              </button>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-50 block mb-1">Original Input</span>
              <div className="text-[11px] p-2 rounded bg-black/20 max-h-24 overflow-y-auto custom-scrollbar whitespace-pre-wrap">{activeItem.original_text}</div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-50 block mb-1">Generated Output</span>
              <div className="flex-1 text-[11px] p-2 rounded bg-black/20 overflow-y-auto custom-scrollbar whitespace-pre-wrap">{activeItem.generated_text}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] border-t pt-2 border-gray-500/20 opacity-60 font-mono">
              <div>Model: {activeItem.model_used}</div>
              <div>Temp: {activeItem.temperature}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPanel
