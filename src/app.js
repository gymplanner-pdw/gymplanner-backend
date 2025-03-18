const express = require('express');
const app = express();
const { authenticateToken } = require('./middleware/authMiddleware');

const { swaggerUi, swaggerSpecs } = require('./config/swaggerConfig');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const machineRoutes = require('./routes/machineRoutes');
const exercicioRoutes = require('./routes/exercicioRoutes');
const treinoRoutes = require('./routes/treinoRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');

app.use('/users', userRoutes);

app.use('/machines', authenticateToken, machineRoutes);
app.use('/exercicios', authenticateToken, exercicioRoutes);
app.use('/treinos', authenticateToken, treinoRoutes);
app.use('/agendamentos', authenticateToken, agendamentoRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});
module.exports = server;