const treinoService = require('../services/treinoService');
const exercicioService = require('../services/exercicioService');


exports.getTreinos = async (req, res) => {
  try {
    const id_usuario = req.user.tipo_usuario === 'admin' ? null : req.user.id;
    const treinos = await treinoService.getTreinos(id_usuario);
    res.json(treinos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar treinos.' });
  }
};


exports.getTreinoById = async (req, res) => {
  try {
    const { id } = req.params;
    const treino = await treinoService.getTreinoById(req.user.id, id);
    if (!treino) {
      return res.status(404).json({ error: 'Treino não encontrado.' });
    }
    res.json(treino);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar treino.' });
  }
};


exports.getExerciciosByTreinoId = async (req, res) => {
  try {
    const { id } = req.params;
    const exercicios = await exercicioService.getExerciciosByTreinoId(id);
    res.json(exercicios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar exercícios do treino.' });
  }
};


exports.createTreino = async (req, res) => {
  try {
    const id_usuario = req.user.id; 
    const { nome, data_inicio, data_fim, duracao } = req.body;

    if (!nome || !data_inicio || !data_fim || !duracao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const newTreino = await treinoService.createTreino(id_usuario, nome, data_inicio, data_fim, duracao);
    res.status(201).json(newTreino);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao criar treino.' });
  }
};


exports.updateTreino = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, data_inicio, data_fim, duracao } = req.body;

    const treino = await treinoService.getTreinoById(req.user.id, id);
    if (!treino) {
      return res.status(404).json({ error: 'Treino não encontrado.' });
    }

    const updatedTreino = await treinoService.updateTreino(req.user.id, id, nome, data_inicio, data_fim, duracao);
    res.json({ message: 'Treino atualizado com sucesso.', treino: updatedTreino });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar treino.' });
  }
};


exports.deleteTreino = async (req, res) => {
  try {
    const { id } = req.params;

    const treino = await treinoService.getTreinoById(req.user.id, id);
    if (!treino) {
      return res.status(404).json({ error: 'Treino não encontrado.' });
    }

    await treinoService.deleteTreino(req.user.id, id);
    res.json({ message: 'Treino removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover treino.' });
  }
};


exports.createExercicioNoTreino = async (req, res) => {
  try {
    const { id_treino, id_maquina, nome, repeticoes, peso } = req.body;

    if (!id_treino || !nome || repeticoes == null || peso == null) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (repeticoes <= 0) {
      return res.status(400).json({ error: 'O número de repetições deve ser maior que 0.' });
    }

    if (peso < 0) {
      return res.status(400).json({ error: 'O peso não pode ser negativo.' });
    }

    const treino = await treinoService.getTreinoById(req.user.id, id_treino);
    if (!treino) {
      return res.status(404).json({ error: 'Treino não encontrado.' });
    }


    if (req.user.id !== treino.id_usuario && req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const exercicios = await exercicioService.getExerciciosByTreinoId(id_treino);
    if (exercicios.some(ex => ex.nome === nome)) {
      return res.status(400).json({ error: 'Esse exercício já existe no treino.' });
    }

    const newExercicio = await exercicioService.createExercicio(id_treino, id_maquina, nome, repeticoes, peso);
    res.status(201).json(newExercicio);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao criar exercício no treino.' });
  }
};
