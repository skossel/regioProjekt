const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('api', {
    getWorkouts: () => ipcRenderer.invoke('getWorkouts'),
    deleteWorkout: (id) => ipcRenderer.invoke('deleteWorkout', id),
    addWorkout: (workout) => ipcRenderer.invoke('addWorkout', workout),
    updateWorkout: (workout) => ipcRenderer.invoke('updateWorkout', workout),
    openWorkoutWindow: (workout) => ipcRenderer.send('openWorkoutWindow', workout),
    onRefreshWorkouts: (callback) => ipcRenderer.on('refreshWorkouts', callback),
    getExercises: () => ipcRenderer.invoke('getExercises'),
    deleteExercise: (id) => ipcRenderer.invoke('deleteExercise', id),
    addExercise: (exercise) => ipcRenderer.invoke('addExercise', exercise),
    updateExercise: (exercise) => ipcRenderer.invoke('updateExercise', exercise),
    openExerciseWindow: (exercise) => ipcRenderer.send('openExerciseWindow', exercise),
    onRefreshExercises: (callback) => ipcRenderer.on('refreshExercises', callback),
    getTemplates: () => ipcRenderer.invoke('getTemplates'),
    deleteTemplate: (id) => ipcRenderer.invoke('deleteTemplate', id),
    addTemplate: (template) => ipcRenderer.invoke('addTemplate', template),
    updateTemplate: (template) => ipcRenderer.invoke('updateTemplate', template),
    openTemplateWindow: (template) => ipcRenderer.send('openTemplateWindow', template),
    onRefreshTemplates: (callback) => ipcRenderer.on('refreshTemplates', callback)
})
