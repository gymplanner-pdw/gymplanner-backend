const express = require('express');
const router = express.Router();
const exercicioController = require('../controllers/exercicioController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Exercícios
 *   description: Gerenciamento de exercícios
 */

/**
 * @swagger
 * /exercicios:
 *   get:
 *     summary: Retorna a lista de exercícios cadastrados
 *     tags: [Exercícios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de exercícios retornada com sucesso
 */
router.get('/', authenticateToken, exercicioController.getExercicios);

/**
 * @swagger
 * /exercicios/{id}:
 *   get:
 *     summary: Retorna um exercício pelo ID
 *     tags: [Exercícios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do exercício
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exercício encontrado
 *       404:
 *         description: Exercício não encontrado
 */
router.get('/:id', authenticateToken, exercicioController.getExercicioById);

/**
 * @swagger
 * /exercicios:
 *   post:
 *     summary: Cria um novo exercício
 *     tags: [Exercícios]
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
 *               id_maquina:
 *                 type: integer
 *                 nullable: true
 *               repeticoes:
 *                 type: integer
 *               peso:
 *                 type: number
 *                 format: float
 *               id_treino:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Exercício criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authenticateToken, exercicioController.createExercicio);

/**
 * @swagger
 * /exercicios/{id}:
 *   put:
 *     summary: Atualiza um exercício existente
 *     tags: [Exercícios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do exercício
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
 *               id_maquina:
 *                 type: integer
 *                 nullable: true
 *               repeticoes:
 *                 type: integer
 *               peso:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Exercício atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Exercício não encontrado
 */
router.put('/:id', authenticateToken, exercicioController.updateExercicio);

/**
 * @swagger
 * /exercicios/{id}:
 *   delete:
 *     summary: Deleta um exercício
 *     tags: [Exercícios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do exercício
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exercício removido com sucesso
 *       404:
 *         description: Exercício não encontrado
 */
router.delete('/:id', authenticateToken, exercicioController.deleteExercicio);

module.exports = router;
