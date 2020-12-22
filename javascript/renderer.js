const fs = require('fs')
const { ipcRenderer } = require('electron')
const { dir, log } = require('console')
const pathConstant = require('path')

const root = fs.readdirSync(process.env.HOME)


class GlobalVariables{
    static filesDocument = document.getElementById('files')
    // static fileObjects = []
    static backIconContainer = document.getElementById('backIcon')
    static CURRENT_PATH = process.env.HOME
    static pathInfoContainer = document.getElementById('pathInfo')

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
    loadDirectories(root,process.env.HOME)
}