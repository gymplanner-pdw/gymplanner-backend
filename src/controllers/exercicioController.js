const exercicioService = require('../services/exercicioService');
const treinoService = require('../services/treinoService');


exports.getExercicios = async (req, res) => {
  try {
    const exercicios = await exercicioService.getExercicios();
    res.json(exercicios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar exercícios.' });
  }
};


exports.getExercicioById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercicio = await exercicioService.getExercicioById(id);

    if (!exercicio) {
      return res.status(404).json({ error: 'Exercício não encontrado.' });
    }

    res.json(exercicio);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar exercício.' });
  }
};


exports.createExercicio = async (req, res) => {
  try {
    const { nome, id_maquina, duracao, repeticoes, peso, id_treino } = req.body;

    if (!nome || !duracao || repeticoes == null || peso == null || !id_treino) {
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
      return res.status(404).json({ error: 'Treino não encontrado ou não pertence a você.' });
    }

    const novoExercicio = await exercicioService.createExercicio(id_treino, id_maquina, nome, repeticoes, peso);
    res.status(201).json({ message: 'Exercício criado com sucesso.', exercicio: novoExercicio });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao criar exercício.' });
  }
};


exports.updateExercicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, id_maquina, duracao, repeticoes, peso } = req.body;

    
    const exercicio = await exercicioService.getExercicioById(id);
    if (!exercicio) {
      return res.status(404).json({ error: 'Exercício não encontrado.' });
    }

    
    const treino = await treinoService.getTreinoById(req.user.id, exercicio.id_treino);
    if (!treino && req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const exercicioAtualizado = await exercicioService.updateExercicio(id, nome, id_maquina, duracao, repeticoes, peso);
    res.json({ message: 'Exercício atualizado com sucesso.', exercicio: exercicioAtualizado });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar exercício.' });
  }
};


exports.deleteExercicio = async (req, res) => {
  try {
    const { id } = req.params;

    
    const exercicio = await exercicioService.getExercicioById(id);
    if (!exercicio) {
      return res.status(404).json({ error: 'Exercício não encontrado.' });
    }

    
    const treino = await treinoService.getTreinoById(req.user.id, exercicio.id_treino);
    if (!treino && req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    await exercicioService.deleteExercicio(id);
    res.json({ message: 'Exercício removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover exercício.' });
  }
};
