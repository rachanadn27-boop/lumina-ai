import { contextBridge, ipcRenderer } from 'electron'

const ALLOWED_SEND_CHANNELS = [
  'app:quit',
  'app:minimize',
  'app:hide',
  'clipboard:write',
  'ollama:pull-model-cancel'
]

const ALLOWED_INVOKE_CHANNELS = [
  'db:get-settings',
  'db:save-setting',
  'db:get-history',
  'db:save-history',
  'db:clear-history',
  'db:get-templates',
  'db:save-template',
  'db:delete-template',
  'db:get-documents',
  'db:save-document',
  'db:delete-document',
  'ollama:status',
  'ollama:list-models',
  'ollama:embed',
  'ollama:generate', // Direct streaming invocation
  'shortcut:get',
  'shortcut:update',
  'clipboard:read-captured',
  'clipboard:paste-back',
  'app:get-boot-status',
  'app:set-boot-status'
]

contextBridge.exposeInMainWorld('luminaAPI', {
  send: (channel: string, data?: any) => {
    if (ALLOWED_SEND_CHANNELS.includes(channel)) {
      ipcRenderer.send(channel, data)
    } else {
      console.warn(`Unauthorized send channel blocked: ${channel}`)
    }
  },
  invoke: (channel: string, ...args: any[]) => {
    if (ALLOWED_INVOKE_CHANNELS.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args)
    }
    return Promise.reject(new Error(`Unauthorized IPC invoke channel: ${channel}`))
  },
  on: (channel: string, callback: (...args: any[]) => void) => {
    const allowedListenChannels = [
  'ollama:pull-progress',
  'ollama:stream-chunk',
  'ollama:stream-end',
  'ollama:stream-error',
  'shortcut:triggered',
  'app:navigate'
]
    
    if (allowedListenChannels.includes(channel)) {
      const subscription = (_event: any, ...args: any[]) => callback(...args)
      ipcRenderer.on(channel, subscription)
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
    return () => {}
  }
})
export type LuminaAPI = {
  send: (channel: string, data?: any) => void
  invoke: (channel: string, ...args: any[]) => Promise<any>
  on: (channel: string, callback: (...args: any[]) => void) => () => void
}
declare global {
  interface Window {
    luminaAPI: LuminaAPI
  }
}
