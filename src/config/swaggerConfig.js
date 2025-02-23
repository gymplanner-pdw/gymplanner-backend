const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GymPlanner API',
      version: '1.0.0',
      description: 'API para agendamento de máquinas e usuários em academias',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Certifique-se de que as rotas possuem documentação Swagger
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpecs };
