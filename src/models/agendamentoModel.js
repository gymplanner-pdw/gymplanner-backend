const pool = require('../database');


exports.getAgendamentos = async () => {
  const result = await pool.query('SELECT * FROM agendamentos');
  return result.rows;
};


exports.getAgendamentoById = async (id) => {
  const result = await pool.query('SELECT * FROM agendamentos WHERE id = $1', [id]);
  return result.rows[0];
};


exports.getAgendamentosByUserId = async (id_usuario) => {
  const result = await pool.query('SELECT * FROM agendamentos WHERE id_usuario = $1', [id_usuario]);
  return result.rows;
};


exports.getAgendamentosByMachineId = async (id_maquina) => {
  const result = await pool.query('SELECT * FROM agendamentos WHERE id_maquina = $1', [id_maquina]);
  return result.rows;
};


exports.createAgendamento = async (id_usuario, id_maquina, data_inicio, data_fim) => {
  if (new Date(data_fim) <= new Date(data_inicio)) {
    throw new Error('A data de término deve ser posterior à data de início.');
  }

  const diffMs = new Date(data_fim) - new Date(data_inicio);
  const diffMin = diffMs / 60000; 
  if (diffMin > 10) {
    throw new Error('O agendamento não pode durar mais de 10 minutos.');
  }


  const { rows: usuario } = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id_usuario]);
  if (!usuario.length) {
    throw new Error('Usuário não encontrado.');
  }


  const { rows: maquina } = await pool.query('SELECT id FROM maquinas WHERE id = $1', [id_maquina]);
  if (!maquina.length) {
    throw new Error('Máquina não encontrada.');
  }


  const { rows: agendamentosExistentes } = await pool.query(
    `SELECT COUNT(*) FROM agendamentos 
     WHERE id_maquina = $1 AND data_inicio = $2`,
    [id_maquina, data_inicio]
  );

  if (parseInt(agendamentosExistentes[0].count) >= 2) {
    throw new Error('Já existem dois usuários revezando esta máquina neste horário.');
  }

  const { rows } = await pool.query(
    'INSERT INTO agendamentos (id_usuario, id_maquina, data_inicio, data_fim) VALUES ($1, $2, $3, $4) RETURNING *',
    [id_usuario, id_maquina, data_inicio, data_fim]
  );
  return rows[0];
};


exports.updateAgendamento = async (id, data_inicio, data_fim) => {
  const agendamento = await this.getAgendamentoById(id);
  if (!agendamento) {
    throw new Error('Agendamento não encontrado.');
  }

  if (new Date(data_fim) <= new Date(data_inicio)) {
    throw new Error('A data de término deve ser posterior à data de início.');
  }

  const diffMs = new Date(data_fim) - new Date(data_inicio);
  const diffMin = diffMs / 60000;
  if (diffMin > 10) {
    throw new Error('O agendamento não pode durar mais de 10 minutos.');
  }


  const { rows: agendamentosExistentes } = await pool.query(
    `SELECT COUNT(*) FROM agendamentos 
     WHERE id_maquina = $1 AND data_inicio = $2 AND id != $3`,
    [agendamento.id_maquina, data_inicio, id]
  );

  if (parseInt(agendamentosExistentes[0].count) >= 2) {
    throw new Error('Já existem dois usuários revezando esta máquina neste horário.');
  }

  const { rows } = await pool.query(
    'UPDATE agendamentos SET data_inicio = $1, data_fim = $2 WHERE id = $3 RETURNING *',
    [data_inicio, data_fim, id]
  );
  return rows[0];
};


exports.deleteAgendamento = async (id) => {
  const agendamento = await this.getAgendamentoById(id);
  if (!agendamento) {
    throw new Error('Agendamento não encontrado.');
  }

  const { rows } = await pool.query('DELETE FROM agendamentos WHERE id = $1 RETURNING *', [id]);
  return rows[0];
};

exports.getAgendamentosByUserAndMachine = async (id_usuario, id_maquina, data_inicio) => {
  const result = await pool.query(
    `SELECT * FROM agendamentos 
     WHERE id_usuario = $1 AND id_maquina = $2 AND data_inicio = $3`,
    [id_usuario, id_maquina, data_inicio]
  );
  return result.rows;
};

exports.countAgendamentos = async (id_maquina, data_inicio) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM agendamentos 
     WHERE id_maquina = $1 AND data_inicio = $2`,
    [id_maquina, data_inicio]
  );
  return parseInt(result.rows[0].count, 10);
};
