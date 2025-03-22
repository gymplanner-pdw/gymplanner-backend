const pool = require('../src/database');

const resetDatabase = async () => {
  const sql = `
    DELETE FROM agendamentos;
    DELETE FROM exercicios;
    DELETE FROM treinos;
    DELETE FROM maquinas;
    DELETE FROM usuarios;
  `;
  await pool.query(sql);
};

module.exports = resetDatabase;
