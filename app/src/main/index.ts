import { app, BrowserWindow, ipcMain, clipboard } from 'electron'
import path from 'path'
import { logger } from './utils/logger'
import { dbService } from './services/database'
import { ollamaService } from './services/ollama'
import { shortcutService } from './services/shortcut'
import { trayService } from './services/tray'
import { simulatePaste } from './utils/clipboard'

let mainWindow: BrowserWindow | null = null

async function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js')
  logger.info(`Loading preload script from: ${preloadPath}`)

  mainWindow = new BrowserWindow({
    width: 680,
    height: 460,
    frame: false,
    transparent: false,
    backgroundColor: '#0B0B0C',
    alwaysOnTop: true,
    resizable: true,
    show: false, // Don't show initially
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  })

  // Prevent window from showing in the OS taskbar/dock
  mainWindow.setSkipTaskbar(true)

  // Load React Frontend
  if (process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  // Focus blur behavior (hide window when clicking outside)
  mainWindow.on('blur', () => {
    // Only hide if not debugging in dev mode
    if (!process.env.VITE_DEV_SERVER_URL) {
      mainWindow?.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Single instance lock
const doubleInstanceLock = app.requestSingleInstanceLock()
if (!doubleInstanceLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })
}

app.on('ready', async () => {
  logger.info('Lumina starting up...')

  // 1. Initialize SQLite
  await dbService.init()

  // 2. Create Browser Window
  await createWindow()

  if (mainWindow) {
    // 3. Initialize Services
    trayService.init(mainWindow)
    
    // Retrieve registered shortcut from DB, fallback to default
    const shortcutSetting = await dbService.get<{ value: string }>('SELECT value FROM settings WHERE key = ?', ['shortcut'])
    const shortcutStr = shortcutSetting?.value || 'Ctrl+Shift+E'
    shortcutService.init(mainWindow, shortcutStr)

    // Check if onboarding is completed
    const onboardingSetting = await dbService.get<{ value: string }>('SELECT value FROM settings WHERE key = ?', ['onboarding_complete'])
    const onboardingComplete = onboardingSetting?.value === 'true'

    if (!onboardingComplete) {
      // Show wizard on first boot
      mainWindow.show()
      mainWindow.focus()
      mainWindow.webContents.send('app:navigate', 'onboarding')
    } else {
      logger.info('Onboarding complete. Starting in background tray.')
    }
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  shortcutService.unregisterCurrent()
  trayService.destroy()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// ==========================================
// IPC HANDLERS BINDINGS
// ==========================================

// Database Handlers
ipcMain.handle('db:get-settings', async () => {
  return dbService.all('SELECT * FROM settings')
})

ipcMain.handle('db:save-setting', async (_, key: string, value: string) => {
  logger.info(`DB Setting saved: ${key} = ${value}`)
  return dbService.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value])
})

ipcMain.handle('db:get-history', async () => {
  return dbService.all('SELECT * FROM history ORDER BY created_at DESC')
})

ipcMain.handle('db:save-history', async (_, id: string, original: string, generated: string, action: string, model: string, temp: number) => {
  return dbService.run(
    'INSERT INTO history (id, original_text, generated_text, prompt_action, model_used, temperature) VALUES (?, ?, ?, ?, ?, ?)',
    [id, original, generated, action, model, temp]
  )
})

ipcMain.handle('db:clear-history', async () => {
  return dbService.run('DELETE FROM history')
})

ipcMain.handle('db:get-templates', async () => {
  return dbService.all('SELECT * FROM prompt_templates ORDER BY created_at DESC')
})

ipcMain.handle('db:save-template', async (_, id: string, name: string, sys: string, user: string, icon: string, shortcut: string, isCustom: number) => {
  return dbService.run(
    'INSERT OR REPLACE INTO prompt_templates (id, name, system_instruction, user_template, icon, shortcut, is_custom) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, name, sys, user, icon, shortcut, isCustom]
  )
})

ipcMain.handle('db:delete-template', async (_, id: string) => {
  return dbService.run('DELETE FROM prompt_templates WHERE id = ?', [id])
})

ipcMain.handle('db:get-documents', async () => {
  return dbService.all('SELECT * FROM context_documents ORDER BY created_at DESC')
})

ipcMain.handle('db:save-document', async (_, id: string, title: string, content: string) => {
  return dbService.run(
    'INSERT INTO context_documents (id, title, content) VALUES (?, ?, ?)',
    [id, title, content]
  )
})

ipcMain.handle('db:delete-document', async (_, id: string) => {
  return dbService.run('DELETE FROM context_documents WHERE id = ?', [id])
})

// Ollama AI Handlers
ipcMain.handle('ollama:status', async () => {
  return ollamaService.checkStatus()
})

ipcMain.handle('ollama:list-models', async () => {
  return ollamaService.listModels()
})

ipcMain.handle('ollama:embed', async (_, text: string) => {
  return ollamaService.getEmbedding(text)
})

ipcMain.handle('ollama:generate', async (_, payload: { model: string, messages: any[], temperature: number, maxTokens: number }) => {
  if (!mainWindow) return false
  return ollamaService.generateStream(payload, mainWindow)
})

ipcMain.on('ollama:pull-model-cancel', () => {
  ollamaService.cancelPull()
})

// Bind model pulling
ipcMain.handle('ollama:pull-model', async (_, modelName: string) => {
  if (!mainWindow) return false
  return ollamaService.pullModel(modelName, mainWindow)
})

// Shortcut Handlers
ipcMain.handle('shortcut:get', async () => {
  return shortcutService.getShortcut()
})

ipcMain.handle('shortcut:update', async (_, newShortcut: string) => {
  const success = shortcutService.register(newShortcut)
  if (success) {
    await dbService.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['shortcut', newShortcut])
  }
  return success
})

// Clipboard Handlers
ipcMain.handle('clipboard:read-captured', async () => {
  return clipboard.readText()
})

ipcMain.handle('clipboard:paste-back', async (_, text: string) => {
  // Minimize/hide first so the target window gains focus, then paste
  if (mainWindow) {
    mainWindow.hide()
    // Small timeout to allow OS window focus changes to settle
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  return simulatePaste(text)
})

// App control Handlers
ipcMain.on('app:quit', () => {
  app.quit()
})

ipcMain.on('app:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.on('app:hide', () => {
  mainWindow?.hide()
})

ipcMain.handle('app:get-boot-status', async () => {
  return app.getLoginItemSettings().openAtLogin
})

ipcMain.handle('app:set-boot-status', async (_, openAtLogin: boolean) => {
  app.setLoginItemSettings({
    openAtLogin,
    path: app.getPath('exe')
  })
  return true
})
