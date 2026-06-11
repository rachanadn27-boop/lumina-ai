import React, { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { MessageSquare, Send, Trash2, Copy, Check, Brain, Loader2, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatPlayground() {
  const {
    theme,
    selectedModel,
    setSelectedModel,
    availableModels,
    temperature,
    setTemperature,
    saveHistory,
    ollamaConnected
  } = useAppStore()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const accumulatedResponseRef = useRef('')
  const lastUserMsgRef = useRef('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input field on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Listen to Ollama stream IPC events
  useEffect(() => {
    const cleanupChunk = window.luminaAPI.on('ollama:stream-chunk', (chunk: string) => {
      accumulatedResponseRef.current += chunk
      setMessages((prev) => {
        const copy = [...prev]
        if (copy.length > 0 && copy[copy.length - 1].role === 'assistant') {
          copy[copy.length - 1] = {
            role: 'assistant',
            content: accumulatedResponseRef.current
          }
        }
        return copy
      })
    })

    const cleanupEnd = window.luminaAPI.on('ollama:stream-end', () => {
      setIsGenerating(false)
      // Persist the conversation turn in SQLite database history
      if (lastUserMsgRef.current.trim() && accumulatedResponseRef.current.trim()) {
        saveHistory(
          lastUserMsgRef.current,
          accumulatedResponseRef.current,
          'Chat Playground'
        )
      }
    })

    const cleanupError = window.luminaAPI.on('ollama:stream-error', (err: string) => {
      setIsGenerating(false)
      setMessages((prev) => {
        const copy = [...prev]
        if (copy.length > 0 && copy[copy.length - 1].role === 'assistant') {
          copy[copy.length - 1] = {
            role: 'assistant',
            content: `Error: ${err}`
          }
        }
        return copy
      })
    })

    return () => {
      cleanupChunk()
      cleanupEnd()
      cleanupError()
    }
  }, [saveHistory])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const prompt = input.trim()
    if (!prompt || isGenerating || !ollamaConnected) return

    setInput('')
    lastUserMsgRef.current = prompt
    accumulatedResponseRef.current = ''

    const newMessages: Message[] = [...messages, { role: 'user', content: prompt }]
    setMessages([...newMessages, { role: 'assistant', content: '' }])
    setIsGenerating(true)

    // Setup multi-turn context payload
    const payload = {
      model: selectedModel,
      messages: newMessages.map((m) => ({
        role: m.role,
        content: m.content
      })),
      temperature,
      maxTokens: 2048
    }

    try {
      const success = await window.luminaAPI.invoke('ollama:generate', payload)
      if (!success) {
        setIsGenerating(false)
        setMessages((prev) => {
          const copy = [...prev]
          if (copy.length > 0) {
            copy[copy.length - 1] = {
              role: 'assistant',
              content: 'Failed to prompt local AI. Please verify Ollama is serving on port 11434.'
            }
          }
          return copy
        })
      }
    } catch (err: any) {
      setIsGenerating(false)
      setMessages((prev) => {
        const copy = [...prev]
        if (copy.length > 0) {
          copy[copy.length - 1] = {
            role: 'assistant',
            content: `Error communicating with local agent: ${err.message}`
          }
        }
        return copy
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopyMessage = (text: string, index: number) => {
    window.luminaAPI.send('clipboard:write', text)
    setCopiedId(index)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClear = () => {
    setMessages([])
    setInput('')
    setIsGenerating(false)
  }

  return (
    <div className="w-full h-full flex flex-col p-4 animate-fade-in min-h-0">
      {/* Top Config bar */}
      <div className="flex items-center justify-between mb-3 text-xs border-b border-gray-500/10 pb-2">
        <div className="flex items-center space-x-2">
          <span className="opacity-60">Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isGenerating}
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

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="opacity-60">Temp:</span>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={temperature}
              disabled={isGenerating}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-16 accent-brand-primary cursor-pointer"
            />
            <span className="font-mono w-5 text-right">{temperature}</span>
          </div>

          <button
            onClick={handleClear}
            disabled={messages.length === 0 || isGenerating}
            className={`p-1.5 rounded transition ${
              theme === 'dark'
                ? 'hover:bg-bg-darkTertiary text-text-darkSecondary hover:text-red-400'
                : 'hover:bg-bg-lightTertiary text-text-lightSecondary hover:text-red-500'
            } disabled:opacity-30`}
            title="Clear Chat Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message History display */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3.5 pr-1 mb-3.5 min-h-0 select-text">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-45 space-y-3 py-16">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-brand-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider">Local AI Playground</h4>
              <p className="text-[10px] max-w-[200px] leading-relaxed">
                Compose messages, write code, or test prompts offline. Conversions are processed locally on your machine.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Brain className="w-3.5 h-3.5 text-brand-primary" />
                </div>
              )}

              <div
                className={`max-w-[78%] p-3 rounded-xl text-xs relative group transition-all duration-150 ${
                  msg.role === 'user'
                    ? 'bg-brand-primary text-white rounded-tr-none'
                    : theme === 'dark'
                    ? 'bg-bg-darkSecondary border border-border-dark text-text-darkPrimary rounded-tl-none'
                    : 'bg-bg-lightSecondary border border-border-light text-text-lightPrimary rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-sans">{msg.content || (
                  <div className="flex items-center space-x-1.5 opacity-55">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                    <span>Typing...</span>
                  </div>
                )}</div>

                {/* Copy button hovered */}
                {msg.content && (
                  <button
                    onClick={() => handleCopyMessage(msg.content, index)}
                    className={`absolute -bottom-2.5 right-2 opacity-0 group-hover:opacity-100 transition p-1 rounded-md border text-[9px] font-bold flex items-center space-x-1 ${
                      theme === 'dark'
                        ? 'bg-bg-darkTertiary border-border-dark hover:text-white'
                        : 'bg-bg-lightTertiary border-border-light hover:text-text-lightPrimary'
                    } ${msg.role === 'user' ? 'text-gray-300' : 'text-gray-400'}`}
                  >
                    {copiedId === index ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === index ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-gray-500/10 border border-gray-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 opacity-60" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box form */}
      <form onSubmit={handleSend} className="flex items-end space-x-2">
        <textarea
          ref={inputRef}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            ollamaConnected
              ? "Type message... (Press Enter to send, Shift+Enter for new line)"
              : "Connecting to Ollama..."
          }
          disabled={!ollamaConnected}
          className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none resize-none custom-scrollbar transition ${
            theme === 'dark'
              ? 'bg-bg-darkSecondary border-border-dark text-text-darkPrimary focus:border-brand-primary'
              : 'bg-bg-lightSecondary border-border-light text-text-lightPrimary focus:border-brand-primary'
          } disabled:opacity-40`}
        />
        <button
          type="submit"
          disabled={!ollamaConnected || isGenerating || !input.trim()}
          className="p-3 bg-brand-primary hover:bg-brand-hover text-white rounded-xl transition-all duration-150 flex items-center justify-center shadow-md shadow-brand-primary/20 disabled:opacity-45 h-[42px] w-[42px]"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  )
}

export default ChatPlayground
