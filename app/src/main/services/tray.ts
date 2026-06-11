import { app, Tray, Menu, BrowserWindow, nativeImage } from 'electron'
import { logger } from '../utils/logger'

class TrayService {
  private tray: Tray | null = null
  private mainWindow: BrowserWindow | null = null

  init(window: BrowserWindow) {
    this.mainWindow = window

    try {
      // 1. Create a 1x1 transparent PNG as native image fallback
      const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
      const imageBuffer = Buffer.from(base64Png, 'base64')
      const trayIcon = nativeImage.createFromBuffer(imageBuffer)
      
      // Resize to standard tray size
      trayIcon.resize({ width: 16, height: 16 })

      this.tray = new Tray(trayIcon)
      this.tray.setToolTip('Lumina Local AI Assistant')

      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'Show Lumina',
          click: () => {
            this.showWindow()
          }
        },
        {
          label: 'Hide Lumina',
          click: () => {
            this.hideWindow()
          }
        },
        { type: 'separator' },
        {
          label: 'Onboarding Setup Wizard',
          click: () => {
            this.showOnboarding()
          }
        },
        {
          label: 'Settings...',
          click: () => {
            this.showSettings()
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          click: () => {
            app.quit()
          }
        }
      ])

      this.tray.setContextMenu(contextMenu)

      // Double-click tray toggles show/hide
      this.tray.on('double-click', () => {
        this.toggleWindow()
      })

      logger.info('System tray initialized successfully')
    } catch (e) {
      logger.error('Failed to initialize system tray:', e)
    }
  }

  private showWindow() {
    if (this.mainWindow) {
      this.mainWindow.show()
      this.mainWindow.focus()
    }
  }

  private hideWindow() {
    if (this.mainWindow) {
      this.mainWindow.hide()
    }
  }

  private toggleWindow() {
    if (this.mainWindow) {
      if (this.mainWindow.isVisible()) {
        this.mainWindow.hide()
      } else {
        this.mainWindow.show()
        this.mainWindow.focus()
      }
    }
  }

  private showOnboarding() {
    if (this.mainWindow) {
      this.mainWindow.show()
      this.mainWindow.focus()
      this.mainWindow.webContents.send('app:navigate', 'onboarding')
    }
  }

  private showSettings() {
    if (this.mainWindow) {
      this.mainWindow.show()
      this.mainWindow.focus()
      this.mainWindow.webContents.send('app:navigate', 'settings')
    }
  }

  destroy() {
    if (this.tray) {
      this.tray.destroy()
      this.tray = null
    }
  }
}

export const trayService = new TrayService()
