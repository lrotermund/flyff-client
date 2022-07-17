const {ipcRenderer} = require('electron')

ipcRenderer.on('load-error', function (event, error) {
    document.getElementById("error").textContent = error
});