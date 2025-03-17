const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { userSchema, updateUserSchema } = require('../validations/schemas');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: API para gerenciamento de usuários
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     description: Permite a criação de um novo usuário. Apenas administradores podem criar novos administradores.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo_usuario:
 *                 type: string
 *                 enum: ["usuario", "admin"]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro nos dados enviados
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', validate(userSchema), userController.createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Usuários]
 *     description: Permite que um usuário faça login no sistema e obtenha um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', userController.authenticateUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna a lista de usuários
 *     tags: [Usuários]
 *     description: Retorna a lista de usuários cadastrados no sistema. Apenas administradores podem acessar esta rota.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', authenticateToken, authorizeAdmin, userController.getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Usuários]
 *     description: Permite que um usuário consulte seus próprios dados ou, se for admin, qualquer usuário.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', authenticateToken, userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [Usuários]
 *     description: Permite que um usuário atualize suas informações. Apenas administradores podem modificar outros usuários.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário a ser atualizado
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
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Nenhuma alteração feita
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', authenticateToken, validate(updateUserSchema), userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Usuários]
 *     description: Permite que um usuário exclua sua própria conta. Apenas administradores podem remover outros usuários.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário a ser removido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       400:
 *         description: O último administrador não pode ser excluído
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
