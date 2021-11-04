// Source: https://www.youtube.com/watch?v=m3OjWNFREJo&list=TLPQMDQxMTIwMjE3awJ5ZTIq8Q
// Source: https://www.youtube.com/watch?v=3yqDxhR2XxE&list=TLPQMDQxMTIwMjE3awJ5ZTIq8Q

const {app, BrowserWindow, Tray} = require('electron')

app.whenReady().then(()=>{
    //create window
    const myWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    // load a webpage
    myWindow.loadFile("index.html")
})

const tray = new Tray("/my-icon")

const contextMenu = Menu.buildFromTemplate([
    {label: 'Cool', type: 'radio'},
])

tray.setToolTip('Electron rocks!')