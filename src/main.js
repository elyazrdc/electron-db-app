const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const { getConnection } = require('./database');
let bcrypt  = require('bcryptjs');
const plainpassword = "12345678";
const path = require('path');
const { get } = require('http');

//let bcrypt;

// Intentar cargar bcryptjs y manejar errores si no se encuentra
async function navigateTo(page) {
    await window.electronAPI.navigateTo(page);
}

async function editBolsa(id) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM bolsa WHERE id = ?', id);
    return result[0];
}

async function updateBolsa(bolsa, id) {
    const conn = await getConnection();
    const result = await conn.query('UPDATE bolsa SET name = ?, lastname = ?, cedula = ? WHERE id = ?', [bolsa.name, bolsa.lastname, bolsa.cedula, id]);
    console.log(result);
    return result;
}

async function getBolsas() {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM bolsa');
    return result;
}

async function deleteBolsa(id) {
    const conn = await getConnection();
    const result = await conn.query('DELETE FROM bolsa WHERE id = ?', [id]);
}


async function getAsuntos() {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM claim');
    return result;
}

async function newAsunto(asunto) {
    try {
        const conn = await getConnection();
        const result = await conn.query('INSERT INTO claim (author, claim, parroquia, casa, attended, cedula, type_cedula, date, tel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [asunto.author, asunto.claim, asunto.parroquia, asunto.casa, asunto.attended, asunto.cedula, asunto.type_cedula, asunto.date, asunto.tel]);
        
        new Notification({
            title: 'Nuevo Informe',
            body: 'Informe añadido exitosamente'
        }).show();
    

        asunto.id = result.insertId; // Asigna el ID generado a bolsaData
        return asunto;

        //console.log(result);

    } catch (error) {
        console.log(error);
        console.log("ERROR SUBIENDO ASUNTO");
    }
}

async function deleteAsunto(id) {
    const conn = await getConnection();
    const result = await conn.query('DELETE FROM claim WHERE id = ?', [id]);
}

async function editAsunto(id) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM claim WHERE id = ?', id);
    return result[0];
}

async function updateAsunto(asunto, id) {
    const conn = await getConnection();
    const result = await conn.query('UPDATE claim SET author = ?, claim = ?, parroquia = ?, casa = ?, attended = ?, cedula = ?, type_cedula = ?, date = ?, tel = ? WHERE id = ?', [asunto.author, asunto.claim, asunto.parroquia, asunto.casa, asunto.attended, asunto.cedula, asunto.type_cedula, asunto.date, asunto.tel, id]);
    console.log(result);
    return result;
}

async function newBolsa(bolsaData) {
    try {
        const conn = await getConnection();
        const result = await conn.query('INSERT INTO bolsa (name, lastname, cedula) VALUES (?, ?, ?)', [bolsaData.name, bolsaData.lastname, bolsaData.cedula]);
        
        new Notification({
            title: 'Nueva Bolsa',
            body: 'Bolsa añadida exitosamente'
        }).show();
        //showNotification('Nueva Bolsa', 'Bolsa añadida exitosamente');

        bolsaData.id = result.insertId; // Asigna el ID generado a bolsaData
        return bolsaData;

        //console.log(result);

    } catch (error) {
        console.log(error);
    }
}

async function checkUser(userLogin) {
    try {
        const conn = await getConnection();
        console.log("LOS DATOS DEL USUARIO ",userLogin);
        //const salt = await bcrypt.genSalt(10);
        //const hashedPassword = hashPasswordSync(userLogin.password);
        //console.log("LA CONTRASEÑA HASHEADA ",hashedPassword);
        const result = await conn.query('SELECT * FROM users WHERE name = ?', [userLogin.name]);
        if (result.length === 0) {
            console.log('Usuario no encontrado');
            new Notification({
                title: 'Inicio de sesión',
                body: 'Usuario no encontrado'
            }).show();
            return false;
        }

        const user = result[0];
        const hashDB = user.password;
        //console.log("EL HASH DE LA BASE DE DATOS ",hashDB);

        const isMatch = await bcrypt.compare(userLogin.password, hashDB);

        if (isMatch) {
            console.log('Login successful');
            new Notification({
                title: 'Inicio de sesión',
                body: 'Exitoso'
            }).show();
            const mainWindow = BrowserWindow.getAllWindows()[0];
            mainWindow.loadFile('src/views/main.html');            
        }
        else {
            console.log('Contraseña incorrecta');
            new Notification({
                title: 'Inicio de sesión',
                body: 'Contrasena incorrecta'
            }).show();
            return false;
        }
        
        //console.log("RESULTADO DE LA CONSULTA ",result.length);

        
    } catch (error) {
        console.log(error);
    }
    
}

function registerIpcHandlers() {
    // ipcMain.handle('hello', () => {
    //     return hello();
    // });
    ipcMain.handle('get-bolsas', () => {
        return getBolsas();
    });

    ipcMain.handle('new-bolsa', (event, bolsaData) => {
        return newBolsa(bolsaData);
    });

    ipcMain.handle('edit-bolsa', (event, id) => {
        return editBolsa(id);
    })

    ipcMain.handle('update-bolsa', (event, bolsa, id) => {
        return updateBolsa(bolsa, id);
    })

    ipcMain.handle('delete-bolsa', (event, id) => {
        return deleteBolsa(id);
    });

    ipcMain.handle('get-asuntos', () => {
        return getAsuntos();
    });

    ipcMain.handle('new-asunto', (event, asunto) => {
        return newAsunto(asunto);
    });

    ipcMain.handle('delete-asunto', (event, id) => {
        return deleteAsunto(id);
    });

    ipcMain.handle('edit-asunto', (event, id) => {
        return editAsunto(id)
    });

    ipcMain.handle('update-asunto', (event, asunto, id) => {
        return updateAsunto(asunto, id);
    })

    ipcMain.handle('login-user', (event, userData) => {
        return checkUser(userData);
    });
}

registerIpcHandlers();



function mainWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    window.loadFile('src/views/index.html');
}

module.exports = { mainWindow };
// No changes needed here; the hello function is already exported via module.exports