const pool = require('../database');

exports.createMachine = async (nome, grupo_muscular, status, ultima_manutencao) => {
  try {
    const result = await pool.query(
      'INSERT INTO maquinas (nome, grupo_muscular, status, ultima_manutencao) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, grupo_muscular, status, ultima_manutencao]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar máquina:', error);
    throw new Error('Erro ao criar máquina');
  }
};

exports.getMachines = async () => {
  try {
    const result = await pool.query('SELECT * FROM maquinas');
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar máquinas:', error);
    throw new Error('Erro ao buscar máquinas');
  }
};

exports.getMachineById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM maquinas WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao buscar máquina:', error);
    throw new Error('Erro ao buscar máquina');
  }
};

exports.updateMachine = async (id, nome, grupo_muscular, status, ultima_manutencao) => {
  try {
    const result = await pool.query(
      'UPDATE maquinas SET nome = $1, grupo_muscular = $2, status = $3, ultima_manutencao = $4 WHERE id = $5 RETURNING *',
      [nome, grupo_muscular, status, ultima_manutencao, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar máquina:', error);
    throw new Error('Erro ao atualizar máquina');
  }
};

exports.deleteMachine = async (id) => {
  try {
    const result = await pool.query('DELETE FROM maquinas WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao deletar máquina:', error);
    throw new Error('Erro ao deletar máquina');
  }
};
