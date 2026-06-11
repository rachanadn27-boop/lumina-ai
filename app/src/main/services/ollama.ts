import http from 'http'
import { BrowserWindow } from 'electron'
import { logger } from '../utils/logger'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GeneratePayload {
  model: string
  messages: ChatMessage[]
  temperature: number
  maxTokens: number
}

class OllamaService {
  private ollamaHost: string = '127.0.0.1'
  private ollamaPort: number = 11434
  private pullActiveRequest: http.ClientRequest | null = null
  private generateActiveRequest: http.ClientRequest | null = null



  async checkStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      const options = {
        hostname: this.ollamaHost,
        port: this.ollamaPort,
        path: '/',
        method: 'GET',
        timeout: 2000
      }

      const req = http.request(options, (res) => {
        resolve(res.statusCode === 200)
      })

      req.on('error', () => {
        resolve(false)
      })

      req.on('timeout', () => {
        req.destroy()
        resolve(false)
      })

      req.end()
    })
  }

  async listModels(): Promise<string[]> {
    return new Promise((resolve) => {
      const options = {
        hostname: this.ollamaHost,
        port: this.ollamaPort,
        path: '/api/tags',
        method: 'GET',
        timeout: 3000
      }

      const req = http.request(options, (res) => {
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          try {
            const parsed = JSON.parse(rawData)
            const models = parsed.models || []
            resolve(models.map((m: any) => m.name))
          } catch (e) {
            logger.error('Failed to parse listModels response', e)
            resolve([])
          }
        })
      })

      req.on('error', (err) => {
        logger.error('Failed to list Ollama models:', err)
        resolve([])
      })

      req.end()
    })
  }

  async pullModel(modelName: string, window: BrowserWindow): Promise<boolean> {
    this.cancelPull()

    return new Promise((resolve) => {
      const postData = JSON.stringify({ name: modelName })
      
      const options = {
        hostname: this.ollamaHost,
        port: this.ollamaPort,
        path: '/api/pull',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }

      this.pullActiveRequest = http.request(options, (res) => {
        let buffer = ''
        
        res.on('data', (chunk) => {
          buffer += chunk.toString()
          
          // Split by newline since Ollama streams JSON objects
          const lines = buffer.split('\n')
          // Save last incomplete chunk
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim()) continue
            try {
              const data = JSON.parse(line)
              // Send progress to renderer
              const completed = data.completed || 0
              const total = data.total || 0
              const percent = total > 0 ? Math.round((completed / total) * 100) : 0
              
              window.webContents.send('ollama:pull-progress', {
                status: data.status,
                percent,
                completed,
                total
              })
            } catch (err) {
              logger.error('Failed to parse pull progress JSON', err)
            }
          }
        })

        res.on('end', () => {
          this.pullActiveRequest = null
          resolve(true)
        })
      })

      this.pullActiveRequest.on('error', (err) => {
        logger.error(`Ollama pull error for ${modelName}:`, err)
        this.pullActiveRequest = null
        resolve(false)
      })

      this.pullActiveRequest.write(postData)
      this.pullActiveRequest.end()
    })
  }

  cancelPull() {
    if (this.pullActiveRequest) {
      this.pullActiveRequest.destroy()
      this.pullActiveRequest = null
      logger.info('Cancelled active Ollama pull request')
    }
  }

  async generateStream(payload: GeneratePayload, window: BrowserWindow): Promise<boolean> {
    this.cancelGenerate()

    return new Promise((resolve) => {
      const postData = JSON.stringify({
        model: payload.model,
        messages: payload.messages,
        options: {
          temperature: payload.temperature,
          num_predict: payload.maxTokens
        },
        stream: true
      })

      const options = {
        hostname: this.ollamaHost,
        port: this.ollamaPort,
        path: '/api/chat',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }

      this.generateActiveRequest = http.request(options, (res) => {
        let buffer = ''

        res.on('data', (chunk) => {
          buffer += chunk.toString()
          
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim()) continue
            try {
              const data = JSON.parse(line)
              if (data.message && data.message.content) {
                window.webContents.send('ollama:stream-chunk', data.message.content)
              }
              if (data.done) {
                window.webContents.send('ollama:stream-end')
              }
            } catch (err) {
              logger.error('Failed to parse generation chunk', err)
            }
          }
        })

        res.on('end', () => {
          this.generateActiveRequest = null
          resolve(true)
        })
      })

      this.generateActiveRequest.on('error', (err) => {
        logger.error('Ollama generation error:', err)
        window.webContents.send('ollama:stream-error', err.message)
        this.generateActiveRequest = null
        resolve(false)
      })

      this.generateActiveRequest.write(postData)
      this.generateActiveRequest.end()
    })
  }

  cancelGenerate() {
    if (this.generateActiveRequest) {
      this.generateActiveRequest.destroy()
      this.generateActiveRequest = null
      logger.info('Cancelled active Ollama generation request')
    }
  }

  async getEmbedding(text: string, model: string = 'nomic-embed-text'): Promise<number[]> {
    return new Promise((resolve) => {
      const postData = JSON.stringify({
        model,
        prompt: text
      })

      const options = {
        hostname: this.ollamaHost,
        port: this.ollamaPort,
        path: '/api/embeddings',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 4000
      }

      const req = http.request(options, (res) => {
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
          try {
            const parsed = JSON.parse(rawData)
            resolve(parsed.embedding || [])
          } catch (e) {
            logger.error('Failed to parse embedding response', e)
            resolve([])
          }
        })
      })

      req.on('error', (err) => {
        logger.error('Embedding API failed:', err)
        resolve([])
      })

      req.on('timeout', () => {
        req.destroy()
        resolve([])
      })

      req.write(postData)
      req.end()
    })
  }
}

export const ollamaService = new OllamaService()
