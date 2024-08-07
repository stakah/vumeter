const { app, BrowserWindow, Menu, MenuItem } = require('electron')

app.disableHardwareAcceleration()

// include the Node.js 'path' module at the top of your file
const path = require('path')

function createWindow () {
    const win = new BrowserWindow({
      width: 410,
      height: 280,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    const menu = Menu.getApplicationMenu() || new Menu()

    const vuMenu = new Menu({label:'vumeter'})
    vuMenu.append(new MenuItem({label:'example1', 
        type:'checkbox',
        checked:true,
        click:(event, focusedWindow, webContents)=>{
            console.log('example1 clicked')
            win.webContents.send('from-example-ch', 'example1')
            this.checked = !this.checked
        }
    }))
    vuMenu.append(new MenuItem({label:'example2', 
        type:'checkbox',
        click:(event, focusedWindow, webContents)=>{
            console.log('example2 clicked')
            win.webContents.send('from-example-ch', 'example2')
            this.checked = !this.checked
        }
    }))
    vuMenu.append(new MenuItem({label:'example3', 
        type:'checkbox',
        click:(event, focusedWindow, webContents)=>{
            console.log('example3 clicked')
            win.webContents.send('from-example-ch', 'example3')
            this.checked = !this.checked
        }
    }))
    vuMenu.append(new MenuItem({label:'example4', 
        type:'checkbox',
        click:(event, focusedWindow, webContents)=>{
            console.log('example4 clicked')
            win.webContents.send('from-example-ch', 'example4')
            this.checked = !this.checked
        }
    }))
    menu.append(new MenuItem({label:'vumeter', submenu:vuMenu}))
    
    win.setMenu(menu)

    win.loadFile('vumeter.html')

    // Open the DevTools.
    // win.webContents.openDevTools()
}
  
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

