const pool = require('../database');

exports.createUser = async (nome, senha) => {
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, senha) VALUES ($1, $2) RETURNING *',
      [nome, senha]
    );
    return result.rows[0]; // Retorna o usuário inserido
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error('Erro ao criar usuário');
  }
};


exports.getUsers = async () => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows; // Retorna todos os usuários
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Erro ao buscar usuários');
  }
};

exports.getUserById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0]; // Retorna um usuário pelo id
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Erro ao buscar usuário');
  }
};

exports.updateUser = async (id, nome, senha) => {
  try {
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, senha = $2 WHERE id = $3 RETURNING *',
      [nome, senha, id]
    );
    return result.rows[0]; // Retorna o usuário atualizado
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error('Erro ao atualizar usuário');
  }
};

exports.deleteUser = async (id) => {
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    return result.rows[0]; // Retorna o usuário deletado
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw new Error('Erro ao deletar usuário');
  }
};
