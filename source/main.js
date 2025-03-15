const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
let mainWindow
let workoutWindow = null
let db
function getDatabaseSourcePath() {
    if (app.isPackaged) {
        return path.join(process.resourcesPath, 'data', 'workouts.db')
    } else {
        return path.join(__dirname, 'data', 'workouts.db')
    }
}
function initDatabase() {
    const targetPath = path.join(app.getPath('userData'), 'workouts.db')
    const sourcePath = getDatabaseSourcePath()
    if (!fs.existsSync(targetPath)) {
        try {
            fs.copyFileSync(sourcePath, targetPath)
        } catch (err) {
            console.error(err)
        }
    }
    db = new sqlite3.Database(targetPath, (err)=>{
        if(err){console.error(err)}
    })
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start TEXT, end TEXT)")
        db.get("SELECT COUNT(*) as count FROM workouts", (err, row) => {
            if(err){console.error(err)}
            if(row && row.count === 0){
                let stmt = db.prepare("INSERT INTO workouts (name, start, end) VALUES (?, ?, ?)")
                stmt.run("Workout A", "2023-03-15T09:00", "2023-03-15T10:00")
                stmt.run("Workout B", "2023-03-16T10:00", "2023-03-16T11:30")
                stmt.finalize()
            }
        })
        db.run("CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, type TEXT)")
        db.run("CREATE TABLE IF NOT EXISTS templates (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)")
    })
}
function createWindow(){
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration:false,
            contextIsolation:true
        }
    })
    mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'))
    const menuTemplate=[{
        label:'Navigation',
        submenu:[{
            label:'Exercises',
            click:()=>{mainWindow.webContents.send('navigate','exercises')}
        },{
            label:'Templates',
            click:()=>{mainWindow.webContents.send('navigate','templates')}
        }]
    }]
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
    mainWindow.on('closed',()=>{mainWindow=null})
}
app.on('ready', ()=>{
    initDatabase()
    createWindow()
})
app.on('window-all-closed',()=>{
    if(process.platform!=='darwin'){
        app.quit()
    }
})
app.on('activate',()=>{
    if(mainWindow===null){createWindow()}
})
function runQuery(query, params=[]){
    return new Promise((resolve,reject)=>{
        db.all(query, params, (err, rows)=>{
            if(err){reject(err)}else{resolve(rows)}
        })
    })
}
function runCommand(query, params=[]){
    return new Promise((resolve,reject)=>{
        db.run(query, params, function(err){
            if(err){reject(err)}else{resolve(this.lastID)}
        })
    })
}
ipcMain.handle('getWorkouts', async ()=>{
    try{
        const rows = await runQuery("SELECT * FROM workouts")
        return rows
    }catch(e){console.error(e);return []}
})
ipcMain.handle('deleteWorkout', async (event, id)=>{
    try{
        await runCommand("DELETE FROM workouts WHERE id = ?", [id])
        return id
    }catch(e){console.error(e);return null}
})
ipcMain.handle('addWorkout', async (event, workout)=>{
    try{
        const id = await runCommand("INSERT INTO workouts (name, start, end) VALUES (?, ?, ?)", [workout.name, workout.start, workout.end])
        return {id, ...workout}
    }catch(e){console.error(e);return null}
})
ipcMain.handle('updateWorkout', async (event, workout)=>{
    try{
        await runCommand("UPDATE workouts SET name = ?, start = ?, end = ? WHERE id = ?", [workout.name, workout.start, workout.end, workout.id])
        return workout
    }catch(e){console.error(e);return null}
})
ipcMain.handle('getExercises', async ()=>{
    try{
        const rows = await runQuery("SELECT * FROM exercises")
        return rows
    }catch(e){console.error(e);return []}
})
ipcMain.handle('deleteExercise', async (event, id)=>{
    try{
        await runCommand("DELETE FROM exercises WHERE id = ?", [id])
        return id
    }catch(e){console.error(e);return null}
})
ipcMain.handle('addExercise', async (event, exercise)=>{
    try{
        const id = await runCommand("INSERT INTO exercises (name, description, type) VALUES (?, ?, ?)", [exercise.name, exercise.description, exercise.type])
        return {id, ...exercise}
    }catch(e){console.error(e);return null}
})
ipcMain.handle('updateExercise', async (event, exercise)=>{
    try{
        await runCommand("UPDATE exercises SET name = ?, description = ?, type = ? WHERE id = ?", [exercise.name, exercise.description, exercise.type, exercise.id])
        return exercise
    }catch(e){console.error(e);return null}
})
ipcMain.handle('getTemplates', async ()=>{
    try{
        const rows = await runQuery("SELECT * FROM templates")
        return rows
    }catch(e){console.error(e);return []}
})
ipcMain.handle('deleteTemplate', async (event, id)=>{
    try{
        await runCommand("DELETE FROM templates WHERE id = ?", [id])
        return id
    }catch(e){console.error(e);return null}
})
ipcMain.handle('addTemplate', async (event, template)=>{
    try{
        const id = await runCommand("INSERT INTO templates (name) VALUES (?)", [template.name])
        return {id, ...template}
    }catch(e){console.error(e);return null}
})
ipcMain.handle('updateTemplate', async (event, template)=>{
    try{
        await runCommand("UPDATE templates SET name = ? WHERE id = ?", [template.name, template.id])
        return template
    }catch(e){console.error(e);return null}
})
function createWorkoutWindow(workout=null){
    workoutWindow = new BrowserWindow({
        width:400,
        height:300,
        parent: mainWindow,
        modal:true,
        webPreferences:{
            preload: path.join(__dirname, 'workoutPreload.js'),
            nodeIntegration:false,
            contextIsolation:true
        }
    })
    let query = ''
    if(workout){
        query = `?id=${workout.id}&name=${encodeURIComponent(workout.name)}&start=${encodeURIComponent(workout.start)}&end=${encodeURIComponent(workout.end)}`
    }
    workoutWindow.loadURL(`file://${__dirname}/public/workout.html${query}`)
    workoutWindow.on('closed', ()=>{
        workoutWindow = null
        if(mainWindow) mainWindow.webContents.send('refreshWorkouts')
    })
}
ipcMain.on('openWorkoutWindow', (event, workout)=>{
    createWorkoutWindow(workout)
})
ipcMain.on('closeWorkoutWindow', ()=>{
    if(workoutWindow){
        workoutWindow.close()
    }
})
function createExerciseWindow(exercise=null){
    let exerciseWindow = new BrowserWindow({
        width:400,
        height:300,
        parent: mainWindow,
        modal:true,
        webPreferences:{
            preload: path.join(__dirname, 'exercisePreload.js'),
            nodeIntegration:false,
            contextIsolation:true
        }
    })
    let query = ''
    if(exercise){
        query = `?id=${exercise.id}&name=${encodeURIComponent(exercise.name)}&description=${encodeURIComponent(exercise.description)}&type=${encodeURIComponent(exercise.type)}`
    }
    exerciseWindow.loadURL(`file://${__dirname}/public/exercise.html${query}`)
    exerciseWindow.on('closed', ()=>{
        if(mainWindow) mainWindow.webContents.send('refreshExercises')
    })
}
ipcMain.on('openExerciseWindow', (event, exercise)=>{
    createExerciseWindow(exercise)
})
ipcMain.on('closeExerciseWindow', ()=>{
    BrowserWindow.getAllWindows().forEach(win=>{
        if(win.webContents.getURL().includes('exercise.html')){
            win.close()
        }
    })
})
function createTemplateWindow(template=null){
    let templateWindow = new BrowserWindow({
        width:400,
        height:200,
        parent: mainWindow,
        modal:true,
        webPreferences:{
            preload: path.join(__dirname, 'templatePreload.js'),
            nodeIntegration:false,
            contextIsolation:true
        }
    })
    let query = ''
    if(template){
        query = `?id=${template.id}&name=${encodeURIComponent(template.name)}`
    }
    templateWindow.loadURL(`file://${__dirname}/public/template.html${query}`)
    templateWindow.on('closed', ()=>{
        if(mainWindow) mainWindow.webContents.send('refreshTemplates')
    })
}
ipcMain.on('openTemplateWindow', (event, template)=>{
    createTemplateWindow(template)
})
ipcMain.on('closeTemplateWindow', ()=>{
    BrowserWindow.getAllWindows().forEach(win=>{
        if(win.webContents.getURL().includes('template.html')){
            win.close()
        }
    })
})
