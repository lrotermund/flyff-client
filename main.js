const { spawn } = require('child_process')
const electron = require('electron')
const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize

  const err = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    show: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, 'assets/logo.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'errorPreload.js')
    }
  })

  err.loadFile('error.html')
  err.center()

  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, 'assets/logo.png')
  })

  splash.loadFile('splash.html')
  splash.center()

  const win = new BrowserWindow({
    width: width,
    height: height,
    transparent: true,
    frame: false,
    show: false,
    icon: path.join(__dirname, 'assets/logo.png')
  })

  win.loadURL('https://universe.flyff.com/play').catch((error) => {
    splash.close()
    win.close()

    err.webContents.send('load-error', error);
    err.show()
  })

  win.once('ready-to-show', () => {
    setTimeout(() => {
      splash.close()

      win.maximize()
      win.show()
    }, 3000)
  })
}

app.whenReady().then(
  () => {
    globalShortcut.register('CommandOrControl+Alt+Esc', () => {
      app.quit()
    })
  })
  .then(() => {
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
