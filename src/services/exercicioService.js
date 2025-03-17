const exercicioModel = require('../models/exercicioModel');
const treinoModel = require('../models/treinoModel');
const machineModel = require('../models/machineModel');

exports.getExercicios = async () => {
  try {
    return await exercicioModel.getExercicios();
  } catch (error) {
    throw new Error('Erro ao buscar exercícios.');
  }
};

exports.getExercicioById = async (id) => {
  try {
    const exercicio = await exercicioModel.getExercicioById(id);
    if (!exercicio) {
      throw new Error('Exercício não encontrado.');
    }
    return exercicio;
  } catch (error) {
    throw new Error('Erro ao buscar exercício.');
  }
};

exports.getExerciciosByTreinoId = async (id_treino) => {
  try {
    return await exercicioModel.getExerciciosByTreinoId(id_treino);
  } catch (error) {
    throw new Error('Erro ao buscar exercícios do treino.');
  }
};


exports.createExercicio = async (id_treino, id_maquina, nome, repeticoes, peso) => {
  try {

    const treino = await treinoModel.getTreinoById(id_treino);
    if (!treino) {
      throw new Error('Treino não encontrado.');
    }

    if (id_maquina) {
      const maquina = await machineModel.getMachineById(id_maquina);
      if (!maquina) {
        throw new Error('Máquina especificada não existe.');
      }
    }

    const exerciciosTreino = await exercicioModel.getExerciciosByTreinoId(id_treino);
    const exercicioDuplicado = exerciciosTreino.some((ex) => ex.nome.toLowerCase() === nome.toLowerCase());
    if (exercicioDuplicado) {
      throw new Error('Este exercício já está cadastrado no treino.');
    }

    if (repeticoes <= 0) {
      throw new Error('O número de repetições deve ser maior que 0.');
    }
    if (peso < 0) {
      throw new Error('O peso não pode ser negativo.');
    }

    return await exercicioModel.createExercicio(id_treino, id_maquina, nome, repeticoes, peso);
  } catch (error) {
    throw new Error(error.message || 'Erro ao criar exercício.');
  }
};

exports.updateExercicio = async (id_exercicio, nome, id_maquina, repeticoes, peso) => {
  try {
    const exercicio = await exercicioModel.getExercicioById(id_exercicio);
    if (!exercicio) {
      throw new Error('Exercício não encontrado.');
    }

    if (repeticoes <= 0) {
      throw new Error('O número de repetições deve ser maior que 0.');
    }
    if (peso < 0) {
      throw new Error('O peso não pode ser negativo.');
    }

    if (id_maquina) {
      const maquina = await machineModel.getMachineById(id_maquina);
      if (!maquina) {
        throw new Error('Máquina especificada não existe.');
      }
    }

    if (
      exercicio.nome === nome &&
      exercicio.id_maquina === id_maquina &&
      exercicio.repeticoes === repeticoes &&
      exercicio.peso === peso
    ) {
      throw new Error('Nenhuma alteração foi feita.');
    }

    return await exercicioModel.updateExercicio(id_exercicio, nome, id_maquina, repeticoes, peso);
  } catch (error) {
    throw new Error(error.message || 'Erro ao atualizar exercício.');
  }
};

exports.deleteExercicio = async (id_exercicio) => {
  try {
    const exercicio = await exercicioModel.getExercicioById(id_exercicio);
    if (!exercicio) {
      throw new Error('Exercício não encontrado.');
    }

    return await exercicioModel.deleteExercicio(id_exercicio);
  } catch (error) {
    throw new Error(error.message || 'Erro ao excluir exercício.');
  }
};
