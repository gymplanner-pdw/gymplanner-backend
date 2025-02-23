const express = require('express');
const app = express();
const pool = require('./database');

const { swaggerUi, swaggerSpecs } = require('./config/swaggerConfig');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const machineRoutes = require('./routes/machineRoutes');

app.use('/machines', machineRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
  console.log('Documentação disponível em http://localhost:3000/api-docs');
});