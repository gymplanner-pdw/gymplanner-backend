const machineService = require('../services/machineService');

exports.getMachines = async (req, res) => {
  try {
    const machines = await machineService.getMachines();
    res.json(machines);
  } catch (error) {
    console.error('Erro ao buscar máquinas:', error);
    res.status(500).json({ error: 'Erro ao buscar máquinas' });
  }
};

exports.getMachineById = async (req, res) => {
  const { id } = req.params;
  try {
    const machine = await machineService.getMachineById(id);
    if (!machine) return res.status(404).json({ message: 'Máquina não encontrada' });
    res.json(machine);
  } catch (error) {
    console.error('Erro ao buscar máquina:', error);
    res.status(500).json({ error: 'Erro ao buscar máquina' });
  }
};

exports.createMachine = async (req, res) => {
  const { nome, grupo_muscular, status, ultima_manutencao } = req.body;
  try {
    const newMachine = await machineService.createMachine(nome, grupo_muscular, status, ultima_manutencao);
    res.status(201).json(newMachine);
  } catch (error) {
    console.error('Erro ao criar máquina:', error);
    res.status(500).json({ error: 'Erro ao criar máquina' });
  }
};

exports.updateMachine = async (req, res) => {
  const { id } = req.params;
  const { nome, grupo_muscular, status, ultima_manutencao } = req.body;
  try {
    const updatedMachine = await machineService.updateMachine(id, nome, grupo_muscular, status, ultima_manutencao);
    if (!updatedMachine) return res.status(404).json({ message: 'Máquina não encontrada' });
    res.json(updatedMachine);
  } catch (error) {
    console.error('Erro ao atualizar máquina:', error);
    res.status(500).json({ error: 'Erro ao atualizar máquina' });
  }
};

exports.deleteMachine = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMachine = await machineService.deleteMachine(id);
    if (!deletedMachine) return res.status(404).json({ message: 'Máquina não encontrada' });
    res.json({ message: 'Máquina removida' });
  } catch (error) {
    console.error('Erro ao deletar máquina:', error);
    res.status(500).json({ error: 'Erro ao deletar máquina' });
  }
};
