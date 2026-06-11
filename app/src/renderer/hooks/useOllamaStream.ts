import { useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useOllamaStream() {
  const {
    selectedModel,
    temperature,
    maxTokens,
    setGeneratedText,
    setIsGenerating,
    saveHistory
  } = useAppStore()

  const currentOriginalTextRef = useRef<string>('')
  const currentActionRef = useRef<string>('')
  const accumulatedResponseRef = useRef<string>('')

  // Clean up IPC listeners
  useEffect(() => {
    // Guard: luminaAPI is injected by the preload script via contextBridge.
    // If it's undefined the preload hasn't loaded yet — skip and avoid crash.
    if (!window.luminaAPI) {
      console.error('[useOllamaStream] window.luminaAPI is undefined — preload not loaded')
      return
    }

    // 1. Listen for chunks
    const cleanupChunk = window.luminaAPI.on('ollama:stream-chunk', (chunk: string) => {
      accumulatedResponseRef.current += chunk
      setGeneratedText(accumulatedResponseRef.current)
    })

    // 2. Listen for end
    const cleanupEnd = window.luminaAPI.on('ollama:stream-end', () => {
      setIsGenerating(false)
      if (accumulatedResponseRef.current.trim()) {
        saveHistory(
          currentOriginalTextRef.current,
          accumulatedResponseRef.current,
          currentActionRef.current
        )
      }
    })

    // 3. Listen for error
    const cleanupError = window.luminaAPI.on('ollama:stream-error', (errMessage: string) => {
      setIsGenerating(false)
      setGeneratedText(`Error generating response: ${errMessage}`)
    })

    return () => {
      cleanupChunk()
      cleanupEnd()
      cleanupError()
    }
  }, [setGeneratedText, setIsGenerating, saveHistory])

  const startStream = useCallback(
    async (originalText: string, actionName: string, systemInstruction: string, userTemplate: string) => {
      setGeneratedText('')
      setIsGenerating(true)
      accumulatedResponseRef.current = ''
      currentOriginalTextRef.current = originalText
      currentActionRef.current = actionName

      // Process user template, replacing {{text}} placeholder
      const userContent = userTemplate.replace('{{text}}', originalText)

      const payload = {
        model: selectedModel,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userContent }
        ],
        temperature,
        maxTokens
      }

      try {
        const success = await window.luminaAPI.invoke('ollama:generate', payload)
        if (!success) {
          setIsGenerating(false)
          setGeneratedText('Failed to start local text generation. Is Ollama running?')
        }
      } catch (err: any) {
        setIsGenerating(false)
        setGeneratedText(`Failed to connect to local AI process: ${err.message}`)
      }
    },
    [selectedModel, temperature, maxTokens, setGeneratedText, setIsGenerating]
  )

  return { startStream }
}
export default useOllamaStream
