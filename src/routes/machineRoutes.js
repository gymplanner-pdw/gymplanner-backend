const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');

/**
 * @swagger
 * tags:
 *   name: Machines
 *   description: API para gerenciamento de máquinas
 */

/**
 * @swagger
 * /machines:
 *   get:
 *     summary: Retorna uma lista de todas as máquinas
 *     tags: [Machines]
 *     responses:
 *       200:
 *         description: Lista de máquinas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   grupo_muscular:
 *                     type: string
 *                   status:
 *                     type: string
 *                   ultima_manutencao:
 *                     type: string
 *                     format: date
 */
router.get('/', machineController.getMachines);

/**
 * @swagger
 * /machines/{id}:
 *   get:
 *     summary: Retorna uma máquina específica
 *     tags: [Machines]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 grupo_muscular:
 *                   type: string
 *                 status:
 *                   type: string
 *                 ultima_manutencao:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Máquina não encontrada
 */
router.get('/:id', machineController.getMachineById);

/**
 * @swagger
 * /machines:
 *   post:
 *     summary: Cria uma nova máquina
 *     tags: [Machines]
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
 *               ultima_manutencao:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Máquina criada
 */
router.post('/', machineController.createMachine);

/**
 * @swagger
 * /machines/{id}:
 *   put:
 *     summary: Atualiza uma máquina existente
 *     tags: [Machines]
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
 *               ultima_manutencao:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Máquina atualizada
 *       404:
 *         description: Máquina não encontrada
 */
router.put('/:id', machineController.updateMachine);

/**
 * @swagger
 * /machines/{id}:
 *   delete:
 *     summary: Deleta uma máquina
 *     tags: [Machines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da máquina
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Máquina deletada
 *       404:
 *         description: Máquina não encontrada
 */
router.delete('/:id', machineController.deleteMachine);

module.exports = router;
