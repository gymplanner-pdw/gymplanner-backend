const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const initDbPath = path.join(__dirname, '..', 'init_db.sql');

const command = `psql -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f "${initDbPath}"`;

exec(command, { env: process.env }, (error, stdout, stderr) => {
  if (error) {
    console.error('Erro ao resetar o banco de dados:', stderr || error.message);
    process.exit(1);
  } else {
    console.log('Banco de dados resetado com sucesso.');
    console.log(stdout);
    process.exit(0);
  }
});