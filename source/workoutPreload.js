const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('workoutApi', {
    addWorkout: (workout) => ipcRenderer.invoke('addWorkout', workout),
    updateWorkout: (workout) => ipcRenderer.invoke('updateWorkout', workout),
    closeWindow: () => ipcRenderer.send('closeWorkoutWindow')
})
