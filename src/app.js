const express = require('express');
const cors = require('cors');
const app = express();
const { authenticateToken } = require('./middleware/authMiddleware');

const { swaggerUi, swaggerSpecs } = require('./config/swaggerConfig');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(cors());
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

module.exports = app;