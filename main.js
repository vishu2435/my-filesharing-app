const { app, BrowserWindow,Menu,ipcMain} = require('electron')
const fs = require('fs')

require('electron-reload')(__dirname);

let win = null
ipcMain.on('ondragstart',(event,dragpath)=>{
  event.sender.startDrag({
    file: dragpath,
    icon:`${__dirname}\images\icon.jpg`
  })
})
const dockMenu = Menu.buildFromTemplate([
  {
    label: 'New Win',
    click () { console.log('New Window') }
  }, {
    label: 'New Window with Settings',
    submenu: [
      { label: 'Basic' ,
        click(){console.log("Basic Clicker")}
    
      },
      { label: 'devtools',
      click: toggleDevTools }
    ]
  },
  { label: 'New Command' }
])

function toggleDevTools(){
  if(win){
    win.webContents.toggleDevTools() 
    console.log("Clicked Dev TOols"
    )    
  }
 
}

function createWindow(){
   
    win = new BrowserWindow({
        width : 800,
        height : 600,
        webPreferences : {
            nodeIntegration : true
        }

    })
    win.loadFile('index.html')
    const root = fs.readdirSync(process.env.HOME)
    console.log(`root is }`,root)
    // win.setPosition(0.5)
    // win.webContents.openDevTools()  
    // console.log(app.dock );
      // win.setMenu(dockMenu)
    
  }

app.whenReady().then(()=>{
  createWindow()
  console.log(`${process.execPath} ${__dirname}` );
  
})
.catch(err=>{
  console.log(`Error is `,err);
})
app.setUserTasks([
  {
    program: process.execPath,
    arguments: `--new-window ${__dirname}`,
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
])

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
    console.log("Quit called")
  })
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
