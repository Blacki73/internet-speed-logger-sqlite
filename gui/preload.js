const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startDeamon: () => ipcRenderer.invoke('dialog:start-deamon'),
  stopDeamon: () => ipcRenderer.invoke('dialog:stop-deamon'),
});
