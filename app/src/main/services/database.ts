import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { logger } from '../utils/logger'

// Type definitions for DB operations
export interface DBConnection {
  run(sql: string, params?: any[]): Promise<{ lastID?: any; changes?: number }>
  all<T>(sql: string, params?: any[]): Promise<T[]>
  get<T>(sql: string, params?: any[]): Promise<T | undefined>
  close(): Promise<void>
}

// Fallback JSON-based DB Implementation
class JsonDbFallback implements DBConnection {
  private dbPath: string
  private data: {
    settings: Record<string, string>
    history: any[]
    prompt_templates: any[]
    context_documents: any[]
  }

  constructor(dbPath: string) {
    this.dbPath = dbPath
    this.data = {
      settings: {},
      history: [],
      prompt_templates: [],
      context_documents: []
    }
  }

  async init() {
    if (fs.existsSync(this.dbPath)) {
      try {
        const fileContent = fs.readFileSync(this.dbPath, 'utf8')
        this.data = JSON.parse(fileContent)
        logger.info('JSON fallback database loaded successfully')
      } catch (err) {
        logger.error('Failed to parse fallback JSON DB, initializing empty', err)
        this.save()
      }
    } else {
      this.save()
      logger.info('Created new JSON fallback database')
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8')
    } catch (err) {
      logger.error('Failed to write to JSON fallback DB', err)
    }
  }

  async run(sql: string, params: any[] = []): Promise<{ lastID?: any; changes?: number }> {
    const query = sql.toLowerCase().trim()
    
    if (query.startsWith('insert into settings') || query.startsWith('replace into settings')) {
      const key = params[0]
      const value = params[1]
      this.data.settings[key] = value
      this.save()
      return { changes: 1 }
    }
    
    if (query.startsWith('insert into history')) {
      // params: [id, original_text, generated_text, prompt_action, model_used, temperature, embedding]
      const newRecord = {
        id: params[0],
        original_text: params[1],
        generated_text: params[2],
        prompt_action: params[3],
        model_used: params[4],
        temperature: params[5],
        embedding: params[6],
        created_at: new Date().toISOString()
      }
      this.data.history.push(newRecord)
      this.save()
      return { lastID: newRecord.id, changes: 1 }
    }

    if (query.startsWith('insert into prompt_templates') || query.startsWith('replace into prompt_templates')) {
      // params: [id, name, system_instruction, user_template, icon, shortcut, is_custom]
      const newTemplate = {
        id: params[0],
        name: params[1],
        system_instruction: params[2],
        user_template: params[3],
        icon: params[4],
        shortcut: params[5],
        is_custom: params[6],
        created_at: new Date().toISOString()
      }
      this.data.prompt_templates = this.data.prompt_templates.filter(t => t.id !== newTemplate.id)
      this.data.prompt_templates.push(newTemplate)
      this.save()
      return { lastID: newTemplate.id, changes: 1 }
    }

    if (query.startsWith('insert into context_documents')) {
      // params: [id, title, content, embedding]
      const newDoc = {
        id: params[0],
        title: params[1],
        content: params[2],
        embedding: params[3],
        created_at: new Date().toISOString()
      }
      this.data.context_documents.push(newDoc)
      this.save()
      return { lastID: newDoc.id, changes: 1 }
    }

    if (query.startsWith('delete from history')) {
      if (query.includes('where id =')) {
        const id = params[0]
        this.data.history = this.data.history.filter(h => h.id !== id)
      } else {
        this.data.history = []
      }
      this.save()
      return { changes: 1 }
    }

    if (query.startsWith('delete from prompt_templates')) {
      const id = params[0]
      this.data.prompt_templates = this.data.prompt_templates.filter(t => t.id !== id)
      this.save()
      return { changes: 1 }
    }

    if (query.startsWith('delete from context_documents')) {
      if (query.includes('where id =')) {
        const id = params[0]
        this.data.context_documents = this.data.context_documents.filter(d => d.id !== id)
      } else {
        this.data.context_documents = []
      }
      this.save()
      return { changes: 1 }
    }

    return { changes: 0 }
  }

  async all<T>(sql: string, _params: any[] = []): Promise<T[]> {
    const query = sql.toLowerCase().trim()
    
    if (query.includes('from settings')) {
      return Object.entries(this.data.settings).map(([key, value]) => ({ key, value } as unknown as T))
    }
    if (query.includes('from history')) {
      // Return sorted by created_at desc
      const sorted = [...this.data.history].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      return sorted as unknown as T[]
    }
    if (query.includes('from prompt_templates')) {
      return this.data.prompt_templates as unknown as T[]
    }
    if (query.includes('from context_documents')) {
      return this.data.context_documents as unknown as T[]
    }
    return []
  }

  async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    const query = sql.toLowerCase().trim()
    if (query.includes('from settings') && query.includes('where key =')) {
      const key = params[0]
      const val = this.data.settings[key]
      if (val !== undefined) {
        return { key, value: val } as unknown as T
      }
    }
    if (query.includes('from prompt_templates') && query.includes('where id =')) {
      const id = params[0]
      return this.data.prompt_templates.find(t => t.id === id) as unknown as T
    }
    return undefined
  }

  async close(): Promise<void> {
    this.save()
  }
}

// Primary DB Service Class
class DatabaseService {
  private db: DBConnection | null = null
  private dbPath: string = ''
  private isFallback: boolean = false

  async init() {
    try {
      const baseDir = app ? app.getPath('userData') : path.join(process.cwd(), '.lumina')
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true })
      }
      
      this.dbPath = path.join(baseDir, 'lumina.db')
      logger.info(`Database path: ${this.dbPath}`)

      // Try importing and loading sqlite3
      try {
        const sqlite3 = require('sqlite3')
        const { open } = require('sqlite')

        const sqliteDb = await open({
          filename: this.dbPath,
          driver: sqlite3.Database
        })

        // Wrap SQLite open connection
        this.db = {
          run: (sql, params) => sqliteDb.run(sql, params),
          all: (sql, params) => sqliteDb.all(sql, params),
          get: (sql, params) => sqliteDb.get(sql, params),
          close: () => sqliteDb.close()
        }
        this.isFallback = false
        logger.info('SQLite Database connected successfully')
      } catch (err) {
        logger.warn('Could not load native sqlite3. Falling back to JSON DB file.', err)
        const fallbackPath = path.join(baseDir, 'lumina_fallback_db.json')
        const jsonDb = new JsonDbFallback(fallbackPath)
        await jsonDb.init()
        this.db = jsonDb
        this.isFallback = true
      }

      await this.runMigrations()
      await this.seedDefaults()

      // Migrate existing old default Ctrl+Shift+E setting to new default Ctrl+Shift+R
      const shortcutSetting = await this.get<{ value: string }>('SELECT value FROM settings WHERE key = ?', ['shortcut'])
      if (shortcutSetting?.value === 'Ctrl+Shift+E') {
        await this.run("UPDATE settings SET value = ? WHERE key = ?", ['Ctrl+Shift+R', 'shortcut'])
        logger.info('Migrated global shortcut from Ctrl+Shift+E to Ctrl+Shift+R in database settings.')
      }

    } catch (e) {
      logger.error('Failed to initialize database:', e)
      throw e
    }
  }

  private async runMigrations() {
    if (!this.db) return

    logger.info('Running database migrations...')

    // For standard SQLite, execute queries
    if (!this.isFallback) {
      await this.db.run(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `)
      
      await this.db.run(`
        CREATE TABLE IF NOT EXISTS history (
          id TEXT PRIMARY KEY,
          original_text TEXT NOT NULL,
          generated_text TEXT NOT NULL,
          prompt_action TEXT NOT NULL,
          model_used TEXT NOT NULL,
          temperature REAL NOT NULL,
          embedding BLOB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await this.db.run(`
        CREATE TABLE IF NOT EXISTS prompt_templates (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          system_instruction TEXT NOT NULL,
          user_template TEXT NOT NULL,
          icon TEXT,
          shortcut TEXT,
          is_custom INTEGER DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await this.db.run(`
        CREATE TABLE IF NOT EXISTS context_documents (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          embedding BLOB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
    }
    
    logger.info('Database migrations completed.')
  }

  private async seedDefaults() {
    const existing = await this.all('SELECT * FROM prompt_templates')
    if (existing.length > 0) return

    logger.info('Seeding default prompt templates...')
    const defaults = [
      {
        id: 'improve',
        name: 'Improve Writing',
        system_instruction: 'You are an elite copywriter. Revise the provided text to make it clearer, more engaging, and cohesive while retaining its core meaning.',
        user_template: 'Improve this writing:\n\n{{text}}',
        icon: 'Sparkles',
        shortcut: 'Ctrl+Shift+I',
        is_custom: 0
      },
      {
        id: 'grammar',
        name: 'Fix Grammar',
        system_instruction: 'You are a meticulous editor. Correct all grammatical, spelling, and punctuation errors. Do not rewrite style elements unless they are grammatically incorrect.',
        user_template: 'Fix the grammar in this text:\n\n{{text}}',
        icon: 'CheckCheck',
        shortcut: 'Ctrl+Shift+G',
        is_custom: 0
      },
      {
        id: 'summarize',
        name: 'Summarize',
        system_instruction: 'Summarize the provided text concisely. Highlight the main arguments, insights, and actions as bullet points.',
        user_template: 'Summarize this:\n\n{{text}}',
        icon: 'FileText',
        shortcut: 'Ctrl+Shift+S',
        is_custom: 0
      },
      {
        id: 'expand',
        name: 'Expand',
        system_instruction: 'You are an author. Elaborate on the provided text, adding details, context, and depth while keeping the tone intact.',
        user_template: 'Expand on this text:\n\n{{text}}',
        icon: 'Maximize2',
        shortcut: '',
        is_custom: 0
      },
      {
        id: 'shorten',
        name: 'Shorten',
        system_instruction: 'You are an editor. Condense the text by removing redundant words and filler phrases, making it extremely punchy and direct.',
        user_template: 'Shorten this text:\n\n{{text}}',
        icon: 'Minimize2',
        shortcut: '',
        is_custom: 0
      },
      {
        id: 'professional',
        name: 'Professional Tone',
        system_instruction: 'Rewrite the text to sound highly professional, polite, and confident, ideal for corporate or client communication.',
        user_template: 'Rewrite this professionally:\n\n{{text}}',
        icon: 'Briefcase',
        shortcut: '',
        is_custom: 0
      },
      {
        id: 'friendly',
        name: 'Friendly Tone',
        system_instruction: 'Rewrite the text to sound warm, approachable, empathetic, and casual, ideal for close colleagues and friends.',
        user_template: 'Rewrite this in a friendly tone:\n\n{{text}}',
        icon: 'Smile',
        shortcut: '',
        is_custom: 0
      },
      {
        id: 'translate',
        name: 'Translate',
        system_instruction: 'Translate the provided text into the specified language, ensuring natural-sounding local phrasing and cultural idiom preservation.',
        user_template: 'Translate this text into Spanish (default):\n\n{{text}}',
        icon: 'Languages',
        shortcut: '',
        is_custom: 0
      },
      {
        id: 'reply',
        name: 'Email Reply',
        system_instruction: 'Draft a polite and clear reply email addressing the key points raised in the received email text.',
        user_template: 'Draft an email reply to this:\n\n{{text}}',
        icon: 'CornerUpLeft',
        shortcut: '',
        is_custom: 0
      },
      {
        id: 'linkedin',
        name: 'LinkedIn Post',
        system_instruction: 'Draft an engaging LinkedIn post based on the text. Include an attention-grabbing hook, spaced paragraphs, relevant hashtags, and a call-to-action.',
        user_template: 'Convert this into a LinkedIn post:\n\n{{text}}',
        icon: 'Linkedin',
        shortcut: '',
        is_custom: 0
      },
      {
        id: 'blog',
        name: 'Blog Generator',
        system_instruction: 'Create a fully formatted markdown blog post outline and content based on these notes.',
        user_template: 'Generate a blog post from this draft:\n\n{{text}}',
        icon: 'PenTool',
        shortcut: '',
        is_custom: 0
      }
    ]

    for (const item of defaults) {
      await this.run(
        `INSERT OR REPLACE INTO prompt_templates (id, name, system_instruction, user_template, icon, shortcut, is_custom)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [item.id, item.name, item.system_instruction, item.user_template, item.icon, item.shortcut, item.is_custom]
      )
    }

    // Default settings
    await this.run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', ['theme', 'dark'])
    await this.run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', ['default_model', 'qwen3:8b'])
    await this.run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', ['temperature', '0.7'])
    await this.run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', ['max_tokens', '2048'])
    await this.run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', ['shortcut', 'Ctrl+Shift+R'])

    logger.info('Database seeding finished.')
  }

  async run(sql: string, params: any[] = []): Promise<{ lastID?: any; changes?: number }> {
    if (!this.db) throw new Error('Database not initialized')
    return this.db.run(sql, params)
  }

  async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized')
    return this.db.all<T>(sql, params)
  }

  async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    if (!this.db) throw new Error('Database not initialized')
    return this.db.get<T>(sql, params)
  }

  async close() {
    if (this.db) {
      await this.db.close()
      this.db = null
      logger.info('Database connection closed')
    }
  }
}

export const dbService = new DatabaseService()
