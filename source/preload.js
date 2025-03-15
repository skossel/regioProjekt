const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('api', {
    getWorkouts: () => ipcRenderer.invoke('getWorkouts'),
    deleteWorkout: (id) => ipcRenderer.invoke('deleteWorkout', id),
    addWorkout: (workout) => ipcRenderer.invoke('addWorkout', workout),
    updateWorkout: (workout) => ipcRenderer.invoke('updateWorkout', workout),
    openWorkoutWindow: (workout) => ipcRenderer.send('openWorkoutWindow', workout),
    onRefreshWorkouts: (callback) => ipcRenderer.on('refreshWorkouts', callback)
})
