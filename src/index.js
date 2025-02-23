require('dotenv').config();
console.log('Credenciais carregadas:', process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);

const pool = require('./database');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro na conexão:', err);
    } else {
        console.log('Conexão bem-sucedida:', res.rows);
    }
    pool.end();
});
