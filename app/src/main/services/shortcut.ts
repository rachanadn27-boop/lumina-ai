import { globalShortcut, BrowserWindow, screen } from 'electron'
import { logger } from '../utils/logger'
import { captureSelectedText } from '../utils/clipboard'

class ShortcutService {
  private mainWindow: BrowserWindow | null = null
  private currentShortcut: string = 'Ctrl+Shift+R'

  init(window: BrowserWindow, defaultShortcut: string = 'Ctrl+Shift+R') {
    this.mainWindow = window
    this.currentShortcut = defaultShortcut
    this.register(this.currentShortcut)
  }

  register(shortcutStr: string): boolean {
    if (!this.mainWindow) return false

    try {
      // Unregister current first to avoid duplicate handler exceptions
      this.unregisterCurrent()

      this.currentShortcut = shortcutStr
      const registered = globalShortcut.register(shortcutStr, async () => {
        logger.info(`Global shortcut triggered: ${shortcutStr}`)
        
        // 1. Capture text
        const text = await captureSelectedText()
        
        // 2. Position the window near the cursor
        this.positionNearCursor()

        // 3. Show window
        if (this.mainWindow) {
          this.mainWindow.restore()
          this.mainWindow.show()
          this.mainWindow.focus()
          this.mainWindow.moveTop()
          logger.info('Window shown')
          logger.info(`Visible=${this.mainWindow.isVisible()}`)
          // Send event and content to React frontend
          this.mainWindow.webContents.send('shortcut:triggered', text)
        }
      })

      if (registered) {
        logger.info(`Shortcut registered successfully: ${shortcutStr}`)
        return true
      } else {
        logger.warn(`Failed to register shortcut: ${shortcutStr}`)
        return false
      }
    } catch (e) {
      logger.error(`Error registering shortcut ${shortcutStr}:`, e)
      return false
    }
  }

  private positionNearCursor() {
  if (!this.mainWindow) return

  try {
    const cursorPoint = screen.getCursorScreenPoint()
    const activeDisplay = screen.getDisplayNearestPoint(cursorPoint)

    const [winWidth, winHeight] = this.mainWindow.getSize()
    const bounds = activeDisplay.workArea

    logger.info(
      `Positioning window near cursor. Cursor: (${cursorPoint.x}, ${cursorPoint.y}), Screen Bounds: ${JSON.stringify(bounds)}`
    )

    let x = cursorPoint.x - Math.round(winWidth / 2)
    let y = cursorPoint.y + 15

    // Horizontal bounds
    if (x < bounds.x) {
      x = bounds.x
    }

    if (x + winWidth > bounds.x + bounds.width) {
      x = bounds.x + bounds.width - winWidth
    }

    // Vertical bounds
    if (y + winHeight > bounds.y + bounds.height) {
      y = cursorPoint.y - winHeight - 15
    }

    if (y < bounds.y) {
      y = bounds.y + 20
    }

    logger.info(`Final positioned coordinates: x=${x}, y=${y}`)

    this.mainWindow.setPosition(x, y)
  } catch (err) {
    logger.error('Error positioning window near cursor:', err)
  }
}

  unregisterCurrent() {
    try {
      if (globalShortcut.isRegistered(this.currentShortcut)) {
        globalShortcut.unregister(this.currentShortcut)
        logger.info(`Unregistered shortcut: ${this.currentShortcut}`)
      }
    } catch (err) {
      logger.error(`Error unregistering shortcut:`, err)
    }
  }

  getShortcut(): string {
    return this.currentShortcut
  }
}

export const shortcutService = new ShortcutService()
