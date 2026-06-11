import { app } from 'electron'
import fs from 'fs'
import path from 'path'

let logFilePath: string | null = null

function getLogFilePath(): string | null {
  if (logFilePath) return logFilePath
  try {
    // Falls back to local directory if app is not yet initialized or in unit testing
    const baseDir = app ? app.getPath('userData') : path.join(process.cwd(), '.lumina')
    const logDir = path.join(baseDir, 'logs')
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
    logFilePath = path.join(logDir, 'main.log')
    return logFilePath
  } catch (e) {
    console.error('Failed to resolve log directory:', e)
    return null
  }
}

function writeLog(level: 'info' | 'warn' | 'error', message: string, meta?: any) {
  const timestamp = new Date().toISOString()
  const metaString = meta ? ` | Meta: ${JSON.stringify(meta, Object.getOwnPropertyNames(meta))}` : ''
  const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}\n`

  // Direct standard console output
  if (level === 'error') {
    console.error(logLine.trim())
  } else if (level === 'warn') {
    console.warn(logLine.trim())
  } else {
    console.log(logLine.trim())
  }

  // File write
  const filePath = getLogFilePath()
  if (filePath) {
    try {
      fs.appendFileSync(filePath, logLine, 'utf8')
    } catch (err) {
      console.error('Failed to append to log file:', err)
    }
  }
}

export const logger = {
  info: (message: string, meta?: any) => writeLog('info', message, meta),
  warn: (message: string, meta?: any) => writeLog('warn', message, meta),
  error: (message: string, meta?: any) => writeLog('error', message, meta),
}
