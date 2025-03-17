const pool = require('../database');


exports.getTreinos = async () => {
    const result = await pool.query('SELECT * FROM treinos');
    return result.rows;
};


exports.getTreinosByUserId = async (id_usuario) => {
    const result = await pool.query('SELECT * FROM treinos WHERE id_usuario = $1', [id_usuario]);
    return result.rows;
};


exports.getTreinoById = async (id) => {
    const result = await pool.query('SELECT * FROM treinos WHERE id = $1', [id]);
    return result.rows[0];
};


exports.createTreino = async (id_usuario, nome, data_inicio, data_fim, duracao) => {
    if (new Date(data_fim) <= new Date(data_inicio)) {
        throw new Error('A data de término deve ser posterior à data de início.');
    }

    if (duracao < 1 || duracao > 180) {
        throw new Error('A duração do treino deve estar entre 1 e 180 minutos.');
    }

    const { rows } = await pool.query(
        'INSERT INTO treinos (id_usuario, nome, data_inicio, data_fim, duracao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id_usuario, nome, data_inicio, data_fim, duracao]
    );
    return rows[0];
};


exports.updateTreino = async (id, nome, data_inicio, data_fim, duracao) => {
    const treino = await this.getTreinoById(id);
    if (!treino) {
        throw new Error('Treino não encontrado.');
    }

    if (new Date(data_fim) <= new Date(data_inicio)) {
        throw new Error('A data de término deve ser posterior à data de início.');
    }

    if (duracao < 1 || duracao > 180) {
        throw new Error('A duração do treino deve estar entre 1 e 180 minutos.');
    }

    const { rows } = await pool.query(
        'UPDATE treinos SET nome = $1, data_inicio = $2, data_fim = $3, duracao = $4 WHERE id = $5 RETURNING *',
        [nome, data_inicio, data_fim, duracao, id]
    );
    return rows[0];
};

exports.deleteTreino = async (id) => {
    const treino = await this.getTreinoById(id);
    if (!treino) {
        throw new Error('Treino não encontrado.');
    }

    const { rows } = await pool.query('DELETE FROM treinos WHERE id = $1 RETURNING *', [id]);
    return rows[0];
};
