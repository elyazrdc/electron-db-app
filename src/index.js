const { mainWindow } = require('./main');
const { app } = require('electron');
require('electron-reload')(__dirname)
require('./database');

app.allowsRendererProcessReuse = false;
app.whenReady().then(mainWindow);