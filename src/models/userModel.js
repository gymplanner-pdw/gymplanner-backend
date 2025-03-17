const pool = require('../database');
const bcrypt = require('bcrypt');

exports.createUser = async (nome, senha, tipo_usuario = 'usuario') => {
  const hashedPassword = await bcrypt.hash(senha, 10);
  
  try {
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nome, senha, tipo_usuario) VALUES ($1, $2, $3) RETURNING id, nome, tipo_usuario',
      [nome, hashedPassword, tipo_usuario]
    );
    return rows[0];
  } catch (error) {
    if (error.code === '23505') { // Código de erro de chave duplicada no PostgreSQL
      throw new Error('O nome de usuário já está em uso.');
    }
    throw error;
  }
};


exports.getUserById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return rows[0];
};


exports.getAllUsers = async () => {
  const { rows } = await pool.query('SELECT id, nome, tipo_usuario FROM usuarios');
  return rows;
};


exports.getUserByName = async (nome) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE nome = $1', [nome]);
  return rows[0];
};

exports.updateUser = async (id, nome, senha) => {
  let query = 'UPDATE usuarios SET nome = $1';
  const params = [nome];

  if (senha) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    query += ', senha = $2';
    params.push(hashedPassword);
  }

  query += ' WHERE id = $3 RETURNING id, nome, tipo_usuario';
  params.push(id);

  const { rows } = await pool.query(query, params);
  return rows[0];
};


exports.deleteUser = async (id, tipo_usuario_solicitante) => {
  const user = await this.getUserById(id);

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  if (user.tipo_usuario === 'admin' && tipo_usuario_solicitante !== 'admin') {
    throw new Error('Apenas administradores podem remover outro administrador.');
  }

  const { rows } = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id, nome, tipo_usuario', [id]);
  return rows[0];
};
