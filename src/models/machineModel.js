const pool = require('../database');

exports.getMachines = async () => {
  const result = await pool.query('SELECT * FROM maquinas');
  return result.rows;
};

exports.getMachineById = async (id) => {
  const result = await pool.query('SELECT * FROM maquinas WHERE id = $1', [id]);
  return result.rows[0];
};

exports.createMachine = async (nome, grupo_muscular, status, ultima_manutencao = null) => {
    const result = await pool.query(
      'INSERT INTO maquinas (nome, grupo_muscular, status, ultima_manutencao) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, grupo_muscular, status, ultima_manutencao]
    );
    return result.rows[0];
  };