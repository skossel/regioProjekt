const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('templateApi', {
    addTemplate: (template) => ipcRenderer.invoke('addTemplate', template),
    updateTemplate: (template) => ipcRenderer.invoke('updateTemplate', template),
    closeWindow: () => ipcRenderer.send('closeTemplateWindow')
})
