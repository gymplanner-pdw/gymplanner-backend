const Joi = require('joi');

/**
 * Middleware para validar requisições com base em um esquema Joi.
 * @param {Joi.ObjectSchema} schema - Esquema Joi para validação.
 * @param {string} [source='body'] - Local da requisição a ser validado ('body', 'params' ou 'query').
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];

    if (!dataToValidate) {
      return res.status(400).json({ error: `Local de validação inválido: ${source}` });
    }

    const { error } = schema.validate(dataToValidate, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: "Erro de validação",
        local: source,
        detalhes: error.details.map(err => ({
          mensagem: err.message,
          campo: err.context.key,
          tipo: err.type
        }))
      });
    }
    
    next();
  };
};

module.exports = validate;
