const mysql = require('promise-mysql');
//Cofiguracion de la Base de Datos, ingresar los datos en las variables

const dbConfig = {
    host: '',
    user: '',
    password: '',
    database: '',
    port: 3306,
    // Algunas configuraciones importantes:
    connectTimeout: 30000,
    acquireTimeout: 30000,
    timeout: 30000,
    charset: 'utf8mb4',
    timezone: 'Z',
    ssl: true, 
    // Opciones para evitar desconexiones:
    reconnect: true,
    multipleStatements: false
};

let connection;



async function getConnection() {
    try {
        console.log('Conectando a AwardSpace...');
        console.log('Host:', dbConfig.host);
        console.log('Usuario:', dbConfig.user);
        console.log('Base de datos:', dbConfig.database);

        connection = await mysql.createConnection(dbConfig);

        console.log('Conexión obtenida');
        return connection;
    } catch (error) {
        console.error('Error obteniendo conexión:', error.message);
        throw error;
    }
}

module.exports = { getConnection }
