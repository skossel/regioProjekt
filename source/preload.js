const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('api', {
    getWorkouts: () => ipcRenderer.invoke('getWorkouts'),
    deleteWorkout: (id) => ipcRenderer.invoke('deleteWorkout', id)
})
