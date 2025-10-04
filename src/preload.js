const { contextBridge, ipcRenderer } = require('electron');
//const { getBolsas } = require('./main');

// Expone APIs seguras al renderer
contextBridge.exposeInMainWorld('electronAPI', {
    loginUser: (userData) => ipcRenderer.invoke('login-user', userData),
    getBolsas: () => ipcRenderer.invoke('get-bolsas'),
    newBolsa: (bolsaData) => ipcRenderer.invoke('new-bolsa', bolsaData),
    editBolsa: (id) => ipcRenderer.invoke('edit-bolsa', id),
    updateBolsa: (bolsa, id) => ipcRenderer.invoke('update-bolsa', bolsa, id),
    deleteBolsa: (id) => ipcRenderer.invoke('delete-bolsa', id),
    getAsuntos: () => ipcRenderer.invoke('get-asuntos'),
    newAsunto: (asunto) => ipcRenderer.invoke('new-asunto', asunto),
    editAsunto: (id) => ipcRenderer.invoke('edit-asunto', id),
    updateAsunto: (asunto, id) => ipcRenderer.invoke('update-asunto', asunto, id),
    deleteAsunto: (id) => ipcRenderer.invoke('delete-asunto', id),
    navigateTo: (page) => ipcRenderer.invoke('navigate-to', pageName)
});