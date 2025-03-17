const pool = require('../database');


exports.getExercicios = async () => {
  const result = await pool.query('SELECT * FROM exercicios');
  return result.rows;
};


exports.getExercicioById = async (id) => {
  const result = await pool.query('SELECT * FROM exercicios WHERE id = $1', [id]);
  return result.rows[0];
};


exports.getExerciciosByTreinoId = async (id_treino) => {
  const result = await pool.query('SELECT * FROM exercicios WHERE id_treino = $1', [id_treino]);
  return result.rows;
};


exports.createExercicio = async (id_treino, id_maquina, nome, repeticoes, peso) => {
  if (repeticoes <= 0) {
    throw new Error('O número de repetições deve ser maior que 0.');
  }
  if (peso < 0) {
    throw new Error('O peso não pode ser negativo.');
  }


  const { rows: exercicioExistente } = await pool.query(
    'SELECT COUNT(*) FROM exercicios WHERE id_treino = $1 AND nome = $2',
    [id_treino, nome]
  );

  if (parseInt(exercicioExistente[0].count) > 0) {
    throw new Error('Já existe um exercício com este nome neste treino.');
  }


  if (id_maquina) {
    const { rows: maquina } = await pool.query('SELECT id FROM maquinas WHERE id = $1', [id_maquina]);
    if (!maquina.length) {
      throw new Error('A máquina selecionada não existe.');
    }
  }

  const { rows } = await pool.query(
    'INSERT INTO exercicios (id_treino, id_maquina, nome, repeticoes, peso) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id_treino, id_maquina, nome, repeticoes, peso]
  );
  return rows[0];
};


exports.updateExercicio = async (id, nome, id_maquina, repeticoes, peso) => {
  const exercicio = await this.getExercicioById(id);
  if (!exercicio) {
    throw new Error('Exercício não encontrado.');
  }

  let query = 'UPDATE exercicios SET';
  const params = [];
  
  if (nome) {
    params.push(nome);
    query += ` nome = $${params.length},`;
  }

  if (id_maquina !== undefined) {

    if (id_maquina) {
      const { rows: maquina } = await pool.query('SELECT id FROM maquinas WHERE id = $1', [id_maquina]);
      if (!maquina.length) {
        throw new Error('A máquina selecionada não existe.');
      }
    }
    params.push(id_maquina);
    query += ` id_maquina = $${params.length},`;
  }

  if (repeticoes !== undefined) {
    if (repeticoes <= 0) {
      throw new Error('O número de repetições deve ser maior que 0.');
    }
    params.push(repeticoes);
    query += ` repeticoes = $${params.length},`;
  }

  if (peso !== undefined) {
    if (peso < 0) {
      throw new Error('O peso não pode ser negativo.');
    }
    params.push(peso);
    query += ` peso = $${params.length},`;
  }

  if (params.length === 0) {
    throw new Error('Nenhum campo foi fornecido para atualização.');
  }

  query = query.slice(0, -1);
  params.push(id);
  query += ` WHERE id = $${params.length} RETURNING *`;

  const { rows } = await pool.query(query, params);
  return rows[0];
};


exports.deleteExercicio = async (id) => {
  const exercicio = await this.getExercicioById(id);
  if (!exercicio) {
    throw new Error('Exercício não encontrado.');
  }

  const { rows } = await pool.query('DELETE FROM exercicios WHERE id = $1 RETURNING *', [id]);
  return rows[0];
};
