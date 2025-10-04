const mysql = require('promise-mysql');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'claism_db',
    port: 3306,
    // Configuraciones importantes para AwardSpace:
    connectTimeout: 30000,
    acquireTimeout: 30000,
    timeout: 30000,
    charset: 'utf8mb4',
    timezone: 'Z',
    ssl: false,  // AwardSpace generalmente no usa SSL en planes free
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