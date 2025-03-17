const agendamentoService = require('../services/agendamentoService');

exports.getAgendamentos = async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const agendamentos = await agendamentoService.getAgendamentos();
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
  }
};


exports.getAgendamentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const agendamento = await agendamentoService.getAgendamentoById(id);

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    
    if (req.user.id !== agendamento.id_usuario && req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    res.json(agendamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamento.' });
  }
};


exports.createAgendamento = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    const { id_maquina, data_inicio, data_fim } = req.body;

    if (!id_maquina || !data_inicio || !data_fim) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (new Date(data_fim) <= new Date(data_inicio)) {
      return res.status(400).json({ error: 'A data de término deve ser posterior à data de início.' });
    }

    const diffMs = new Date(data_fim) - new Date(data_inicio);
    const diffMin = diffMs / 60000;
    if (diffMin > 10) {
      return res.status(400).json({ error: 'O agendamento não pode durar mais de 10 minutos.' });
    }

    const newAgendamento = await agendamentoService.createAgendamento(id_usuario, id_maquina, data_inicio, data_fim);
    res.status(201).json({ message: 'Agendamento criado com sucesso.', agendamento: newAgendamento });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao criar agendamento.' });
  }
};


exports.updateAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { data_inicio, data_fim } = req.body;

    const agendamento = await agendamentoService.getAgendamentoById(id);
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    if (agendamento.id_usuario !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode modificar seus próprios agendamentos.' });
    }

    const agendamentoAtualizado = await agendamentoService.updateAgendamento(id, req.user.id, data_inicio, data_fim);
    res.json({ message: 'Agendamento atualizado com sucesso.', agendamento: agendamentoAtualizado });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao atualizar agendamento.' });
  }
};


exports.deleteAgendamento = async (req, res) => {
  try {
    const { id } = req.params;

    const agendamento = await agendamentoService.getAgendamentoById(id);
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    if (agendamento.id_usuario !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode cancelar seus próprios agendamentos.' });
    }

    await agendamentoService.cancelAgendamento(id, req.user.id);
    res.json({ message: 'Agendamento cancelado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao cancelar agendamento.' });
  }
};
