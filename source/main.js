const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
let mainWindow
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    })
    mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'))
    const menuTemplate = [{
        label: 'Navigation',
        submenu: [{
            label: 'Exercises',
            click: () => {
                mainWindow.webContents.send('navigate', 'exercises')
            }
        }, {
            label: 'Templates',
            click: () => {
                mainWindow.webContents.send('navigate', 'templates')
            }
        }]
    }]
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
