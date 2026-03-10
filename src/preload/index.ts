import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('api', {
  // Future: audio playback, MIDI export, file I/O
})
