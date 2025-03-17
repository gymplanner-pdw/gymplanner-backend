const machineService = require('../services/machineService');

exports.getMachines = async (req, res) => {
  try {
    const machines = await machineService.getMachines();
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar máquinas.' });
  }
};

exports.getMachineById = async (req, res) => {
  try {
    const { id } = req.params;
    const machine = await machineService.getMachineById(id);

    if (!machine) {
      return res.status(404).json({ error: 'Máquina não encontrada.' });
    }

    res.json(machine);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar máquina.' });
  }
};

exports.createMachine = async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem criar máquinas.' });
    }

    const { nome, grupo_muscular, status, ultima_manutencao } = req.body;

    if (!nome || !grupo_muscular || !status) {
      return res.status(400).json({ error: 'Nome, grupo muscular e status são obrigatórios.' });
    }

    const validStatuses = ['disponivel', 'indisponivel', 'em manutencao'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido. Escolha entre: disponivel, indisponivel, em manutencao.' });
    }


    const existingMachine = await machineService.getMachineByName(nome);
    if (existingMachine) {
      return res.status(400).json({ error: 'Já existe uma máquina com esse nome.' });
    }

    const newMachine = await machineService.createMachine(nome, grupo_muscular, status, ultima_manutencao);
    res.status(201).json({ message: 'Máquina criada com sucesso.', machine: newMachine });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao criar máquina.' });
  }
};

exports.updateMachine = async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem atualizar máquinas.' });
    }

    const { id } = req.params;
    const { nome, grupo_muscular, status, ultima_manutencao } = req.body;


    const existingMachine = await machineService.getMachineById(id);
    if (!existingMachine) {
      return res.status(404).json({ error: 'Máquina não encontrada.' });
    }

    const updatedMachine = await machineService.updateMachine(id, nome, grupo_muscular, status, ultima_manutencao);
    res.json({ message: 'Máquina atualizada com sucesso.', machine: updatedMachine });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar máquina.' });
  }
};

exports.deleteMachine = async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem remover máquinas.' });
    }

    const { id } = req.params;


    const existingMachine = await machineService.getMachineById(id);
    if (!existingMachine) {
      return res.status(404).json({ error: 'Máquina não encontrada.' });
    }

    await machineService.deleteMachine(id);
    res.json({ message: 'Máquina removida com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar máquina.' });
  }
};
