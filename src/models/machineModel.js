const pool = require('../database');

exports.getMachines = async () => {
  const result = await pool.query('SELECT * FROM maquinas');
  return result.rows;
};


exports.getMachinesByStatus = async (status) => {
  const validStatuses = ['disponivel', 'indisponivel', 'em manutencao'];
  if (!validStatuses.includes(status)) {
    throw new Error('Status inválido. Escolha entre: disponivel, indisponivel, em manutencao.');
  }

  const result = await pool.query('SELECT * FROM maquinas WHERE status = $1', [status]);
  return result.rows;
};


exports.getMachineById = async (id) => {
  const result = await pool.query('SELECT * FROM maquinas WHERE id = $1', [id]);
  return result.rows[0];
};


exports.createMachine = async (nome, grupo_muscular, status, ultima_manutencao) => {
  const validStatuses = ['disponivel', 'indisponivel', 'em manutencao'];
  if (!validStatuses.includes(status)) {
    throw new Error('Status inválido. Escolha entre: disponivel, indisponivel, em manutencao.');
  }

  const { rows } = await pool.query(
    'INSERT INTO maquinas (nome, grupo_muscular, status, ultima_manutencao) VALUES ($1, $2, $3, $4) RETURNING *',
    [nome, grupo_muscular, status, ultima_manutencao]
  );
  return rows[0];
};


exports.updateMachine = async (id, nome, grupo_muscular, status, ultima_manutencao) => {
  const validStatuses = ['disponivel', 'indisponivel', 'em manutencao'];
  if (!validStatuses.includes(status)) {
    throw new Error('Status inválido. Escolha entre: disponivel, indisponivel, em manutencao.');
  }


  const machine = await this.getMachineById(id);
  if (!machine) {
    throw new Error('Máquina não encontrada.');
  }

  const { rows } = await pool.query(
    'UPDATE maquinas SET nome = $1, grupo_muscular = $2, status = $3, ultima_manutencao = $4 WHERE id = $5 RETURNING *',
    [nome, grupo_muscular, status, ultima_manutencao, id]
  );
  return rows[0];
};


exports.updateMachineStatus = async (id, status) => {
  const validStatuses = ['disponivel', 'indisponivel', 'em manutencao'];
  if (!validStatuses.includes(status)) {
    throw new Error('Status inválido. Escolha entre: disponivel, indisponivel, em manutencao.');
  }


  const machine = await this.getMachineById(id);
  if (!machine) {
    throw new Error('Máquina não encontrada.');
  }

  const { rows } = await pool.query(
    'UPDATE maquinas SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return rows[0];
};


exports.deleteMachine = async (id) => {

  const machine = await this.getMachineById(id);
  if (!machine) {
    throw new Error('Máquina não encontrada.');
  }


  const { rows: agendamentos } = await pool.query(
    'SELECT COUNT(*) FROM agendamentos WHERE id_maquina = $1 AND data_inicio > NOW()',
    [id]
  );

  if (parseInt(agendamentos[0].count) > 0) {
    throw new Error('Não é possível remover a máquina, pois há agendamentos futuros.');
  }

  const { rows } = await pool.query('DELETE FROM maquinas WHERE id = $1 RETURNING *', [id]);
  return rows[0];
};
