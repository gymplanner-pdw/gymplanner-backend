const agendamentoModel = require('../models/agendamentoModel');
const userModel = require('../models/userModel');
const machineModel = require('../models/machineModel');


exports.getAgendamentos = async () => {
  try {
    return await agendamentoModel.getAgendamentos();
  } catch (error) {
    throw new Error('Erro ao buscar agendamentos.');
  }
};


exports.getAgendamentoById = async (id) => {
  try {
    const agendamento = await agendamentoModel.getAgendamentoById(id);
    if (!agendamento) {
      throw new Error('Agendamento não encontrado.');
    }
    return agendamento;
  } catch (error) {
    throw new Error('Erro ao buscar agendamento.');
  }
};

exports.createAgendamento = async (id_usuario, id_maquina, data_inicio, data_fim) => {
  try {

    const [usuario, maquina] = await Promise.all([
      userModel.getUserById(id_usuario),
      machineModel.getMachineById(id_maquina),
    ]);

    if (!usuario) throw new Error('Usuário não encontrado.');
    if (!maquina) throw new Error('Máquina não encontrada.');


    const inicioTimestamp = new Date(data_inicio).getTime();
    const fimTimestamp = new Date(data_fim).getTime();

    if (fimTimestamp <= inicioTimestamp) {
      throw new Error('A data de término deve ser posterior à data de início.');
    }


    const agendamentosUsuario = await agendamentoModel.getAgendamentosByUserAndMachine(id_usuario, id_maquina, data_inicio);
    if (agendamentosUsuario.length > 0) {
      throw new Error('Você já possui um agendamento para esta máquina nesse período.');
    }


    const count = await agendamentoModel.countAgendamentos(id_maquina, data_inicio, data_fim);


    const status = count >= 2 ? 'Pendente' : 'Disponível';

    return await agendamentoModel.createAgendamento(id_usuario, id_maquina, data_inicio, data_fim, status);
  } catch (error) {
    throw new Error(error.message || 'Erro ao criar agendamento.');
  }
};

exports.updateAgendamento = async (id_agendamento, id_usuario, data_inicio, data_fim) => {
  try {
    const agendamento = await agendamentoModel.getAgendamentoById(id_agendamento);
    if (!agendamento) throw new Error('Agendamento não encontrado.');
    if (agendamento.id_usuario !== id_usuario) throw new Error('Você só pode modificar seus próprios agendamentos.');

    const inicioTimestamp = new Date(data_inicio).getTime();
    const fimTimestamp = new Date(data_fim).getTime();

    if (inicioTimestamp <= Date.now()) throw new Error('Não é possível reagendar para um horário que já passou.');

    if (agendamento.data_inicio.getTime() === inicioTimestamp &&
        agendamento.data_fim.getTime() === fimTimestamp) {
      throw new Error('Nenhuma alteração foi feita.');
    }

    return await agendamentoModel.updateAgendamento(id_agendamento, data_inicio, data_fim);
  } catch (error) {
    throw new Error(error.message || 'Erro ao atualizar agendamento.');
  }
};

exports.cancelAgendamento = async (id_agendamento, id_usuario) => {
  try {
    const agendamento = await agendamentoModel.getAgendamentoById(id_agendamento);
    if (!agendamento) throw new Error('Agendamento não encontrado.');
    if (agendamento.id_usuario !== id_usuario) throw new Error('Você só pode cancelar seus próprios agendamentos.');
    if (new Date(agendamento.data_inicio).getTime() <= Date.now()) throw new Error('Não é possível cancelar um agendamento que já passou.');

    await agendamentoModel.deleteAgendamento(id_agendamento);

    const nextInQueue = await agendamentoModel.getNextInQueue(agendamento.id_maquina, agendamento.data_inicio, agendamento.data_fim);
    if (nextInQueue) {
      await agendamentoModel.updateAgendamentoStatus(nextInQueue.id, 'Disponível');
    }

    return 'Agendamento cancelado com sucesso.';
  } catch (error) {
    throw new Error(error.message || 'Erro ao cancelar agendamento.');
  }
};
