/* Imports. Do not give them different names! */
const {PythonShell} = require("python-shell");
const path = require("path");
const {app, BrowserWindow} = require("electron");
const { windowsStore } = require("process");

var ex = new PythonShell('logic/launch.py', null);
ex.on("message", function(message) {console.log(message);})
ex.end();

/* This is an application window. */
var main_window;

function create_window () {
    main_window = new BrowserWindow({
        webPreferences: {
            /* Give the renderer access to node, so Python can be used. */
            nodeIntegration: true, // electron 5+ requires it
            contextIsolation: false,
            /* However, this is a security risk. If we are not careful, 
            we give someone access to node through our app through the node. 
            The solution is to not give the renderer direct access to node {PythonShell}, 
            but to give only Electron main process access to the node. */
            enableRemoteModule: false,
            images: true,
        }
    });
    main_window.loadFile('interface/template.html');
    /* Let a window display various information for debugging purposes. */
    main_window.webContents.openDevTools();
    main_window.on("closed", function () { main_window = null; })
}

/* Entry point. Here the application starts and finishes. */
app.whenReady().then(() => { create_window() }); // start
app.on("activate", function () {
    if (main_window === null) {create_window();}
}) // create a window if the dock or taskbar icon is clicked
app.on("window-all-closed", function () { app.quit(); }); // end
