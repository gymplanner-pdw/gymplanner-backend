const pool = require('../database'); 

exports.getUsers = async () => {
  const result = await pool.query('SELECT * FROM usuarios');
  return result.rows; 
};

exports.getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return result.rows[0]; 
};

exports.createUser = async (nome, email, senha) => {
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
    [nome, email, senha]
  );
  return result.rows[0];
};
