const Joi = require('joi');


const userSchema = Joi.object({
  nome: Joi.string().min(3).max(50).required().messages({
    "string.min": "O nome deve ter no mínimo 3 caracteres.",
    "string.max": "O nome deve ter no máximo 50 caracteres.",
    "any.required": "O nome é obrigatório."
  }),
  senha: Joi.string().min(6).required().messages({
    "string.min": "A senha deve ter pelo menos 6 caracteres.",
    "any.required": "A senha é obrigatória."
  }),
  tipo_usuario: Joi.string().valid('usuario', 'admin').lowercase().default('usuario').messages({
    "any.only": "O tipo de usuário deve ser 'usuario' ou 'admin'."
  })
});


const machineSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required().messages({
    "string.min": "O nome da máquina deve ter no mínimo 3 caracteres.",
    "string.max": "O nome da máquina deve ter no máximo 100 caracteres.",
    "any.required": "O nome da máquina é obrigatório."
  }),
  grupo_muscular: Joi.string().min(3).max(50).required().messages({
    "string.min": "O grupo muscular deve ter no mínimo 3 caracteres.",
    "string.max": "O grupo muscular deve ter no máximo 50 caracteres.",
    "any.required": "O grupo muscular é obrigatório."
  }),
  status: Joi.string().valid('disponivel', 'indisponivel', 'em manutencao').required().messages({
    "any.only": "O status deve ser 'disponivel', 'indisponivel' ou 'em manutencao'."
  }),
  ultima_manutencao: Joi.date().optional()
});


const treinoSchema = Joi.object({
  id_usuario: Joi.number().integer().required().messages({
    "number.base": "O ID do usuário deve ser um número inteiro.",
    "any.required": "O ID do usuário é obrigatório."
  }),
  nome: Joi.string().min(3).max(50).required().messages({
    "string.min": "O nome do treino deve ter no mínimo 3 caracteres.",
    "string.max": "O nome do treino deve ter no máximo 50 caracteres.",
    "any.required": "O nome do treino é obrigatório."
  }),
  data_inicio: Joi.date().iso().required().messages({
    "date.base": "A data de início deve estar em formato ISO (YYYY-MM-DD).",
    "any.required": "A data de início é obrigatória."
  }),
  data_fim: Joi.date().greater(Joi.ref('data_inicio')).iso().required().messages({
    "date.greater": "A data de término deve ser posterior à data de início.",
    "any.required": "A data de término é obrigatória."
  }),
  duracao: Joi.number().positive().max(180).required().messages({
    "number.positive": "A duração deve ser um número positivo.",
    "number.max": "A duração máxima permitida é 180 minutos.",
    "any.required": "A duração do treino é obrigatória."
  })
});


const exercicioSchema = Joi.object({
  id_treino: Joi.number().integer().required().messages({
    "number.base": "O ID do treino deve ser um número inteiro.",
    "any.required": "O ID do treino é obrigatório."
  }),
  id_maquina: Joi.number().integer().allow(null).optional().messages({
    "number.base": "O ID da máquina deve ser um número inteiro ou nulo."
  }),
  nome: Joi.string().min(3).max(50).required().messages({
    "string.min": "O nome do exercício deve ter no mínimo 3 caracteres.",
    "string.max": "O nome do exercício deve ter no máximo 50 caracteres.",
    "any.required": "O nome do exercício é obrigatório."
  }),
  repeticoes: Joi.number().integer().positive().required().messages({
    "number.positive": "O número de repetições deve ser um número positivo.",
    "any.required": "O número de repetições é obrigatório."
  }),
  peso: Joi.number().precision(2).min(0).required().messages({
    "number.min": "O peso deve ser um número maior ou igual a 0.",
    "any.required": "O peso é obrigatório."
  })
});


const agendamentoSchema = Joi.object({
  id_usuario: Joi.number().integer().required().messages({
    "number.base": "O ID do usuário deve ser um número inteiro.",
    "any.required": "O ID do usuário é obrigatório."
  }),
  id_maquina: Joi.number().integer().required().messages({
    "number.base": "O ID da máquina deve ser um número inteiro.",
    "any.required": "O ID da máquina é obrigatório."
  }),
  data_inicio: Joi.date().iso().required().messages({
    "date.base": "A data de início deve estar em formato ISO (YYYY-MM-DD).",
    "any.required": "A data de início é obrigatória."
  }),
  data_fim: Joi.date().greater(Joi.ref('data_inicio')).iso().required().messages({
    "date.greater": "A data de término deve ser posterior à data de início.",
    "any.required": "A data de término é obrigatória."
  })
});

module.exports = { userSchema, machineSchema, treinoSchema, exercicioSchema, agendamentoSchema };
