const express = require('express');
const router = express.Router();
const treinoController = require('../controllers/treinoController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Treinos
 *   description: Gerenciamento de treinos
 */

/**
 * @swagger
 * /treinos:
 *   get:
 *     summary: Retorna todos os treinos do usuário autenticado
 *     tags: [Treinos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de treinos
 */
router.get('/', authenticateToken, treinoController.getTreinos);

/**
 * @swagger
 * /treinos/{id}:
 *   get:
 *     summary: Retorna um treino específico do usuário autenticado
 *     tags: [Treinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     responses:
 *       200:
 *         description: Treino encontrado
 *       404:
 *         description: Treino não encontrado
 */
router.get('/:id', authenticateToken, treinoController.getTreinoById);

/**
 * @swagger
 * /treinos:
 *   post:
 *     summary: Cria um novo treino para o usuário autenticado
 *     tags: [Treinos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               data_inicio:
 *                 type: string
 *                 format: date
 *               data_fim:
 *                 type: string
 *                 format: date
 *               duracao:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Treino criado com sucesso
 */
router.post('/', authenticateToken, treinoController.createTreino);

/**
 * @swagger
 * /treinos/{id}:
 *   put:
 *     summary: Atualiza um treino existente do usuário autenticado
 *     tags: [Treinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               data_inicio:
 *                 type: string
 *                 format: date
 *               data_fim:
 *                 type: string
 *                 format: date
 *               duracao:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Treino atualizado com sucesso
 *       404:
 *         description: Treino não encontrado
 */
router.put('/:id', authenticateToken, treinoController.updateTreino);

/**
 * @swagger
 * /treinos/{id}:
 *   delete:
 *     summary: Deleta um treino do usuário autenticado
 *     tags: [Treinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     responses:
 *       200:
 *         description: Treino removido com sucesso
 *       404:
 *         description: Treino não encontrado
 */
router.delete('/:id', authenticateToken, treinoController.deleteTreino);

/**
 * @swagger
 * /treinos/{id}/exercicios:
 *   get:
 *     summary: Retorna todos os exercícios de um treino específico
 *     tags: [Treinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     responses:
 *       200:
 *         description: Lista de exercícios do treino
 */
router.get('/:id/exercicios', authenticateToken, treinoController.getExerciciosByTreinoId);

/**
 * @swagger
 * /treinos/{id}/exercicios:
 *   post:
 *     summary: Adiciona um exercício a um treino do usuário autenticado
 *     tags: [Treinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do treino
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_maquina:
 *                 type: integer
 *               nome:
 *                 type: string
 *               repeticoes:
 *                 type: integer
 *               peso:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Exercício adicionado ao treino com sucesso
 */
router.post('/:id/exercicios', authenticateToken, treinoController.createExercicioNoTreino);

module.exports = router;
