const treinoModel = require('../models/treinoModel');
const agendamentoModel = require('../models/agendamentoModel');


exports.getTreinos = async (id_usuario) => {
  try {
    return await treinoModel.getTreinosByUserId(id_usuario);
  } catch (error) {
    throw new Error('Erro ao buscar treinos.');
  }
};


exports.getTreinoById = async (id_usuario, id_treino) => {
  try {
    const treino = await treinoModel.getTreinoById(id_treino);
    if (!treino) {
      throw new Error('Treino não encontrado.');
    }
    if (treino.id_usuario !== id_usuario) {
      throw new Error('Acesso negado. Você não pode acessar este treino.');
    }
    return treino;
  } catch (error) {
    throw new Error(error.message || 'Erro ao buscar treino.');
  }
};


exports.createTreino = async (id_usuario, nome, data_inicio, data_fim, duracao) => {
  try {
    return await treinoModel.createTreino(id_usuario, nome, data_inicio, data_fim, duracao);
  } catch (error) {
    throw new Error(error.message || 'Erro ao criar treino.');
  }
};


exports.updateTreino = async (id_usuario, id_treino, nome, data_inicio, data_fim, duracao, novos_exercicios) => {
  try {
    const treino = await treinoModel.getTreinoById(id_treino);
    if (!treino) {
      throw new Error('Treino não encontrado.');
    }
    if (treino.id_usuario !== id_usuario) {
      throw new Error('Acesso negado. Você não pode modificar este treino.');
    }

    if (new Date(data_fim) <= new Date(data_inicio)) {
      throw new Error('A data de término deve ser posterior à data de início.');
    }

    
    if (
      treino.nome === nome &&
      treino.data_inicio.toISOString() === new Date(data_inicio).toISOString() &&
      treino.data_fim.toISOString() === new Date(data_fim).toISOString() &&
      treino.duracao === duracao
    ) {
      throw new Error('Nenhuma alteração foi feita.');
    }

    
    const maquinasComConflito = await Promise.all(
      novos_exercicios.map(async (exercicio) => {
        if (exercicio.id_maquina) {
          const disponivel = await agendamentoModel.verifyDisponibilidade(exercicio.id_maquina, data_inicio);
          return disponivel ? null : exercicio.id_maquina;
        }
        return null;
      })
    );

    const maquinasIndisponiveis = maquinasComConflito.filter(Boolean);
    if (maquinasIndisponiveis.length > 0) {
      throw new Error(`As máquinas ${maquinasIndisponiveis.join(', ')} estão indisponíveis para o novo horário.`);
    }

    return await treinoModel.updateTreino(id_treino, nome, data_inicio, data_fim, duracao);
  } catch (error) {
    throw new Error(error.message || 'Erro ao atualizar treino.');
  }
};

exports.deleteTreino = async (id_usuario, id_treino) => {
  try {
    const treino = await treinoModel.getTreinoById(id_treino);
    if (!treino) {
      throw new Error('Treino não encontrado.');
    }
    if (treino.id_usuario !== id_usuario) {
      throw new Error('Acesso negado. Você não pode excluir este treino.');
    }

    return await treinoModel.deleteTreino(id_treino);
  } catch (error) {
    throw new Error(error.message || 'Erro ao excluir treino.');
  }
};
