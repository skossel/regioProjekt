const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
let mainWindow
let workoutWindow = null
const dbPath = path.join(__dirname, 'data', 'workouts.db')
const db = new sqlite3.Database(dbPath, (err) => {
    if(err){console.error(err)}
})
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start TEXT, end TEXT)")
    db.get("SELECT COUNT(*) as count FROM workouts", (err, row) => {
        if(err){console.error(err)}
        if(row.count === 0){
            let stmt = db.prepare("INSERT INTO workouts (name, start, end) VALUES (?, ?, ?)")
            stmt.run("Workout A", "2023-03-15T09:00", "2023-03-15T10:00")
            stmt.run("Workout B", "2023-03-16T10:00", "2023-03-16T11:30")
            stmt.finalize()
        }
    })
})
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
app.on('ready',createWindow)
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
    let url = path.join(__dirname, 'public', 'workout.html')
    if(workout){
        url += '?id=' + workout.id + '&name=' + encodeURIComponent(workout.name) + '&start=' + encodeURIComponent(workout.start) + '&end=' + encodeURIComponent(workout.end)
    }
    workoutWindow.loadFile(url)
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
