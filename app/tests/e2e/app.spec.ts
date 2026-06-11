import { _electron as electron } from 'playwright'
import { test, expect } from '@playwright/test'
import path from 'path'

test('Lumina Desktop App Boot E2E Tests', async () => {
  // 1. Launch electron app
  const electronApp = await electron.launch({
    args: [path.join(__dirname, '../../dist-electron/main/index.js')]
  })

  // Get the first window
  const window = await electronApp.firstWindow()
  
  // Verify window title / metadata
  const title = await window.title()
  expect(title).toBe('Lumina AI')

  // Check if frameless overlay mounts correctly
  const bodyText = await window.textContent('body')
  expect(bodyText).toContain('Lumina')

  // Shutdown app
  await electronApp.close()
})
