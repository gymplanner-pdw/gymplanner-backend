const machineModel = require('../models/machineModel');
const agendamentoModel = require('../models/agendamentoModel');

exports.getMachines = async () => {
  try {
    return await machineModel.getMachines();
  } catch (error) {
    throw new Error('Erro ao buscar máquinas.');
  }
};

exports.getMachineById = async (id) => {
  try {
    const machine = await machineModel.getMachineById(id);
    if (!machine) {
      throw new Error('Máquina não encontrada.');
    }
    return machine;
  } catch (error) {
    throw new Error('Erro ao buscar máquina.');
  }
};

exports.createMachine = async (nome, grupo_muscular, status, ultima_manutencao, tipo_usuario) => {
  try {
    if (tipo_usuario !== 'admin') {
      throw new Error('Acesso negado. Apenas administradores podem criar máquinas.');
    }

    const existingMachine = await machineModel.getMachineByName(nome.toLowerCase());
    if (existingMachine) {
      throw new Error('Já existe uma máquina com este nome.');
    }

    const validStatuses = ['disponivel', 'indisponivel', 'em manutencao'];
    if (!validStatuses.includes(status)) {
      throw new Error('Status inválido. Escolha entre: disponivel, indisponivel ou em manutencao.');
    }

    return await machineModel.createMachine(nome, grupo_muscular, status, ultima_manutencao);
  } catch (error) {
    throw new Error(error.message || 'Erro ao criar máquina.');
  }
};

exports.updateMachineStatus = async (id, status, tipo_usuario) => {
  try {
    if (tipo_usuario !== 'admin') {
      throw new Error('Acesso negado. Apenas administradores podem atualizar o status da máquina.');
    }

    const machine = await machineModel.getMachineById(id);
    if (!machine) {
      throw new Error('Máquina não encontrada.');
    }

    if (machine.status === status) {
      throw new Error('O status informado já está definido para esta máquina.');
    }

    const validStatuses = ['disponivel', 'indisponivel', 'em manutencao'];
    if (!validStatuses.includes(status)) {
      throw new Error('Status inválido. Escolha entre: disponivel, indisponivel ou em manutencao.');
    }

    return await machineModel.updateMachineStatus(id, status);
  } catch (error) {
    throw new Error(error.message || 'Erro ao atualizar status da máquina.');
  }
};

exports.removeMachine = async (id_maquina, tipo_usuario) => {
  try {
    if (tipo_usuario !== 'admin') {
      throw new Error('Acesso negado. Apenas administradores podem remover máquinas.');
    }

    const machine = await machineModel.getMachineById(id_maquina);
    if (!machine) {
      throw new Error('Máquina não encontrada.');
    }


    const agendamentos = await agendamentoModel.getAgendamentosByMachine(id_maquina);
    const temAgendamentosFuturos = agendamentos.some((a) => new Date(a.data_inicio) > new Date());

    if (temAgendamentosFuturos) {

      await agendamentoModel.updateAgendamentosByMachine(id_maquina, 'Indisponível');
    }

    await machineModel.deleteMachine(id_maquina);
    return 'Máquina removida com sucesso.';
  } catch (error) {
    throw new Error(error.message || 'Erro ao remover máquina.');
  }
};
