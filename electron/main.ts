import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 616,  // 600px + 16px tiny padding (8px each side)
    height: 616, // 600px + 16px tiny padding (8px each side)
    resizable: false,  // Prevent resizing to keep the aspect ratio
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,
    transparent: true,
    frame: false,  // Frameless for rounded corners
    backgroundColor: '#00000000',  // Fully transparent
    roundedCorners: true,
    hasShadow: true,
    vibrancy: 'under-window',  // macOS feature for better transparency
    titleBarStyle: 'hidden'  // Hide title bar but keep traffic lights
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5175')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
