const fs = require('fs')
const { ipcRenderer } = require('electron')
const { dir, log } = require('console')
const pathConstant = require('path')
 
const root = fs.readdirSync(process.env.HOME)


class GlobalVariables{
    static filesDocument = document.getElementById('files')
    // static fileObjects = []
    static SENDER = false
    static RECEIVER = false
    static backIconContainer = document.getElementById('backIcon')
    static CURRENT_PATH = process.env.HOME
    static pathInfoContainer = document.getElementById('pathInfo')
    static PEER = new Peer()
    static CONNECT = null;
    static connectionBlock = document.getElementById('connection-block')
    static initialize() {
        
        document.getElementById('send-button')
        .addEventListener('click',()=>{
            connect(document.getElementById('id-input').value)
        })
       
        
        document.getElementById('receive-button').addEventListener('click',recieve,{once:true})
    }
}

function connect(id){
    if(!id){
        alert("Please enter id")
        return
    }
    if(!GlobalVariables.RECEIVER){
        GlobalVariables.SENDER = true
        console.log(id)
        GlobalVariables.PEER.connect(id)
        let h3 = document.createElement('h3')
        h3.innerHTML = 'Connecting ... '
        GlobalVariables.connectionBlock.appendChild(h3)
        GlobalVariables.PEER.on('error',err=>{
            GlobalVariables.SENDER=false
            console.log(`Error in connecting ${err}ds`)
            h3.innerHTML = `Error in connecting ${err}`
            setTimeout(()=>{
                   GlobalVariables.connectionBlock.removeChild(GlobalVariables.connectionBlock.lastElementChild)
            },2000)
         
        })      
        GlobalVariables.PEER.on('open',id=>{
            h3.innerHTML = `Connected to id ${id}`
        })
    }else{
        alert("You are a reciever")
    }
 
}
function recieve() {
    if(!GlobalVariables.SENDER){
        GlobalVariables.RECEIVER = true
    console.log(`id is ${GlobalVariables.PEER.id}`);
    let h2 = document.createElement('h2')
    h2.innerText=`ID: ${GlobalVariables.PEER.id}`
    GlobalVariables.connectionBlock.appendChild(h2)
   
    GlobalVariables.PEER.on('connection',function( dataconnection) {
        console.log("Connected ",dataconnection);
        h2.innerText=`STATUS: CONNECTED`
    })
    }else{
        alert('You are a sender')
    }
    
}

class Directory{
    constructor(name,currentPath,htmltag){
        this.name = name
        this.currentPath = `${currentPath}\\${name}`
        this.htmltag = htmltag
        this.contents = []
    }
    readDirectory=()=>{
        console.log(`Current path is ${this.currentPath}`)
        if(fs.lstatSync(`${this.currentPath}`).isDirectory()){
            if(this.contents.length===0){
                this.contents = fs.readdirSync(`${this.currentPath}`)
            }
            console.log(this.contents);
            loadDirectories(this.contents,this.currentPath)
            // return this.contents
    
        }
        
    }
}
function goback(event){
    let backPath = pathConstant.resolve(GlobalVariables.CURRENT_PATH,'../')
    let directoryArray = fs.readdirSync(backPath);
    loadDirectories(directoryArray,backPath)
}
function loadDirectories(directoryArray,path){
    GlobalVariables.filesDocument.innerHTML = ''
    GlobalVariables.CURRENT_PATH = path
    GlobalVariables.pathInfoContainer.innerHTML = `<p>${GlobalVariables.CURRENT_PATH}</p>`
    if(path!==process.env.HOME){
        GlobalVariables.backIconContainer.onclick = goback
        GlobalVariables.backIconContainer.innerHTML = '<img src="./images/backIcon.svg" alt=""></img>'
    }else{
        GlobalVariables.backIconContainer.innerHTML = ''
    }
    for(let i=0;i<directoryArray.length;i++){
       
        let p = document.createElement('p')
        p.innerHTML = `${directoryArray[i]}`
        p.classList.add('directory')
        console.log(`directoryarraypath ${directoryArray[i].currentPath}`);
        
        let directory = new Directory(directoryArray[i],path,p)
        p.onclick = directory.readDirectory
        // GlobalVariables.fileObjects.push(directory)
        GlobalVariables.filesDocument.appendChild(p)
    }
}
window.onload=()=>{
    console.log("onload called")
    GlobalVariables.initialize()
    loadDirectories(root,process.env.HOME)

}