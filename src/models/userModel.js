// src/models/userModel.js
const pool = require('../database'); // Conexão com o banco de dados (pool)

exports.getUsers = async () => {
  const result = await pool.query('SELECT * FROM usuarios');
  return result.rows; // Retorna todos os usuários
};

exports.getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return result.rows[0]; // Retorna o usuário com o id especificado
};

exports.createUser = async (nome, email, senha) => {
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
    [nome, email, senha]
  );
  return result.rows[0]; // Retorna o usuário criado
};
