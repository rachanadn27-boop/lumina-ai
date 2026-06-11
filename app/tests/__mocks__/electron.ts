/**
 * tests/__mocks__/electron.ts
 *
 * Lightweight stub of the `electron` module for use in Vitest unit tests.
 * Main-process source files (logger.ts, database.ts, etc.) import from
 * 'electron', but Electron is not available in a plain Node.js environment.
 * This mock replaces those imports so the tests run without Electron installed
 * as a runtime dependency.
 */

import os from 'os'
import path from 'path'

// ------------------------------------------------------------------
// app stub
// ------------------------------------------------------------------
export const app = {
  getPath: (name: string): string => {
    // Redirect userData to a temp dir so tests don't pollute user dirs
    if (name === 'userData') {
      return path.join(os.tmpdir(), 'lumina-vitest')
    }
    return os.tmpdir()
  },
  getLoginItemSettings: () => ({ openAtLogin: false }),
  setLoginItemSettings: () => {},
  quit: () => {},
  requestSingleInstanceLock: () => true,
  on: () => {},
}

// ------------------------------------------------------------------
// BrowserWindow stub
// ------------------------------------------------------------------
export class BrowserWindow {
  webContents = {
    send: () => {},
    openDevTools: () => {},
  }
  setSkipTaskbar() {}
  loadURL() { return Promise.resolve() }
  loadFile() { return Promise.resolve() }
  show() {}
  hide() {}
  focus() {}
  minimize() {}
  restore() {}
  isMinimized() { return false }
  on() {}
  once() {}
}

// ------------------------------------------------------------------
// ipcMain stub
// ------------------------------------------------------------------
export const ipcMain = {
  handle: () => {},
  on: () => {},
  removeHandler: () => {},
}

// ------------------------------------------------------------------
// clipboard stub
// ------------------------------------------------------------------
let _clipboardText = ''
export const clipboard = {
  readText: () => _clipboardText,
  writeText: (t: string) => { _clipboardText = t },
  clear: () => { _clipboardText = '' },
}

// ------------------------------------------------------------------
// shell stub
// ------------------------------------------------------------------
export const shell = {
  openExternal: () => Promise.resolve(),
}

// ------------------------------------------------------------------
// screen stub
// ------------------------------------------------------------------
export const screen = {
  getCursorScreenPoint: () => ({ x: 0, y: 0 }),
  getDisplayNearestPoint: () => ({ bounds: { x: 0, y: 0, width: 1920, height: 1080 } }),
}

// ------------------------------------------------------------------
// globalShortcut stub
// ------------------------------------------------------------------
export const globalShortcut = {
  register: () => true,
  unregister: () => {},
  unregisterAll: () => {},
  isRegistered: () => false,
}

// ------------------------------------------------------------------
// Tray stub
// ------------------------------------------------------------------
export class Tray {
  setToolTip() {}
  setContextMenu() {}
  on() {}
}

// ------------------------------------------------------------------
// Menu / MenuItem stubs
// ------------------------------------------------------------------
export const Menu = {
  buildFromTemplate: () => ({}),
  setApplicationMenu: () => {},
}
export class MenuItem {}

// ------------------------------------------------------------------
// nativeImage stub
// ------------------------------------------------------------------
export const nativeImage = {
  createFromPath: () => ({}),
  createEmpty: () => ({}),
}

export default {
  app,
  BrowserWindow,
  ipcMain,
  clipboard,
  shell,
  screen,
  globalShortcut,
  Tray,
  Menu,
  MenuItem,
  nativeImage,
}
