const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Machines
 *   description: Gerenciamento de máquinas
 */

/**
 * @swagger
 * /machines:
 *   get:
 *     summary: Retorna uma lista de todas as máquinas
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     description: Permite que qualquer usuário autenticado visualize a lista de máquinas disponíveis.
 *     responses:
 *       200:
 *         description: Lista de máquinas retornada com sucesso
 */
router.get('/', authenticateToken, machineController.getMachines);

/**
 * @swagger
 * /machines/{id}:
 *   get:
 *     summary: Retorna uma máquina específica
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     description: Permite que qualquer usuário autenticado visualize os detalhes de uma máquina específica.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da máquina
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Máquina encontrada
 *       404:
 *         description: Máquina não encontrada
 */
router.get('/:id', authenticateToken, machineController.getMachineById);

/**
 * @swagger
 * /machines:
 *   post:
 *     summary: Cria uma nova máquina
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas administradores podem criar novas máquinas no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               grupo_muscular:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ["disponivel", "indisponivel", "em manutencao"]
 *               ultima_manutencao:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Máquina criada com sucesso
 *       403:
 *         description: Acesso negado. Apenas administradores podem criar máquinas.
 */
router.post('/', authenticateToken, authorizeAdmin, machineController.createMachine);

/**
 * @swagger
 * /machines/{id}:
 *   put:
 *     summary: Atualiza uma máquina existente
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas administradores podem modificar os dados de uma máquina existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da máquina
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               grupo_muscular:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ["disponivel", "indisponivel", "em manutencao"]
 *               ultima_manutencao:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Máquina atualizada com sucesso
 *       403:
 *         description: Acesso negado. Apenas administradores podem modificar máquinas.
 *       404:
 *         description: Máquina não encontrada
 */
router.put('/:id', authenticateToken, authorizeAdmin, machineController.updateMachine);

/**
 * @swagger
 * /machines/{id}:
 *   delete:
 *     summary: Deleta uma máquina
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas administradores podem remover uma máquina do sistema. Máquinas com agendamentos futuros não podem ser excluídas.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da máquina
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Máquina deletada com sucesso
 *       403:
 *         description: Acesso negado. Apenas administradores podem deletar máquinas.
 *       404:
 *         description: Máquina não encontrada
 *       409:
 *         description: Não é possível excluir uma máquina com agendamentos futuros.
 */
router.delete('/:id', authenticateToken, authorizeAdmin, machineController.deleteMachine);

module.exports = router;
