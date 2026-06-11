import { clipboard } from 'electron'
import { exec } from 'child_process'
import { logger } from './logger'
import fs from 'fs'
import path from 'path'
import os from 'os'

let originalClipboardContent = ''

export function saveClipboard() {
  originalClipboardContent = clipboard.readText()
}

export function restoreClipboard() {
  try {
    clipboard.writeText(originalClipboardContent)
  } catch (err) {
    logger.error('Failed to restore original clipboard content', err)
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getVbsPath(action: 'copy' | 'paste'): string {
  const tempDir = os.tmpdir()
  const filePath = path.join(tempDir, `lumina_${action}.vbs`)
  try {
    if (!fs.existsSync(filePath)) {
      const script = action === 'copy'
        ? 'Set wshShell = CreateObject("WScript.Shell")\nwshShell.SendKeys "^c"'
        : 'Set wshShell = CreateObject("WScript.Shell")\nwshShell.SendKeys "^v"'
      fs.writeFileSync(filePath, script, 'utf8')
    }
  } catch (err) {
    logger.error(`Failed to create VBScript file for ${action}:`, err)
  }
  return filePath
}

export async function simulateCopy(): Promise<boolean> {
  return new Promise((resolve) => {
    let cmd = ''
    if (process.platform === 'win32') {
      const vbsPath = getVbsPath('copy')
      // wscript.exe runs VBScript silently with zero console windows
      cmd = `wscript.exe "${vbsPath}"`
    } else if (process.platform === 'darwin') {
      // macOS: use osascript to trigger system events Command+C keystroke
      cmd = `osascript -e 'tell application "System Events" to keystroke "c" using {command down}'`
    } else {
      // Linux: fallback to xdotool
      cmd = 'xdotool key ctrl+c'
    }

    exec(cmd, { windowsHide: true }, (err) => {
      if (err) {
        logger.error(`Keystroke simulation error on ${process.platform}:`, err)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

export async function captureSelectedText(): Promise<string> {
  saveClipboard()
  const previousText = clipboard.readText()
  clipboard.clear()
  
  // Wait 150ms for user to release shortcut keys (e.g. Ctrl+Shift+R) before simulating Ctrl+C
  await delay(150)
  
  await simulateCopy()
  
  // Polling for clipboard update up to 600ms
  for (let i = 0; i < 6; i++) {
    await delay(100)
    const text = clipboard.readText()
    if (text && text.trim().length > 0) {
      return text
    }
  }
  
  logger.warn('Failed to capture selected text, falling back to previous clipboard content')
  if (previousText && previousText.trim().length > 0) {
    return previousText
  }
  return ''
}

export async function simulatePaste(text: string): Promise<boolean> {
  clipboard.writeText(text)
  
  return new Promise((resolve) => {
    let cmd = ''
    if (process.platform === 'win32') {
      const vbsPath = getVbsPath('paste')
      cmd = `wscript.exe "${vbsPath}"`
    } else if (process.platform === 'darwin') {
      cmd = `osascript -e 'tell application "System Events" to keystroke "v" using {command down}'`
    } else {
      cmd = 'xdotool key ctrl+v'
    }

    exec(cmd, { windowsHide: true }, (err) => {
      if (err) {
        logger.error(`Paste simulation error on ${process.platform}:`, err)
        resolve(false)
      } else {
        // Wait a moment for OS paste buffer to register, then restore
        setTimeout(() => {
          restoreClipboard()
          resolve(true)
        }, 150)
      }
    })
  })
}
