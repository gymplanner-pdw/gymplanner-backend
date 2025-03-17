const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Agendamentos
 *   description: Gerenciamento de agendamentos
 */

/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Retorna a lista de agendamentos
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 */
router.get('/', authenticateToken, agendamentoController.getAgendamentos);

/**
 * @swagger
 * /agendamentos/{id}:
 *   get:
 *     summary: Retorna um agendamento específico pelo ID
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do agendamento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *       404:
 *         description: Agendamento não encontrado
 */
router.get('/:id', authenticateToken, agendamentoController.getAgendamentoById);

/**
 * @swagger
 * /agendamentos:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_maquina:
 *                 type: integer
 *               data_inicio:
 *                 type: string
 *                 format: date-time
 *               data_fim:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authenticateToken, agendamentoController.createAgendamento);

/**
 * @swagger
 * /agendamentos/{id}:
 *   put:
 *     summary: Atualiza um agendamento existente
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do agendamento a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data_inicio:
 *                 type: string
 *                 format: date-time
 *               data_fim:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Agendamento não encontrado
 */
router.put('/:id', authenticateToken, agendamentoController.updateAgendamento);

/**
 * @swagger
 * /agendamentos/{id}:
 *   delete:
 *     summary: Cancela um agendamento
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do agendamento a ser cancelado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 *       404:
 *         description: Agendamento não encontrado
 */
router.delete('/:id', authenticateToken, agendamentoController.deleteAgendamento);

module.exports = router;
