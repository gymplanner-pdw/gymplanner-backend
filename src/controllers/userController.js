const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';
const TOKEN_EXPIRATION = process.env.JWT_EXPIRATION || '1h';


exports.createUser = async (req, res) => {
  try {
    const { nome, senha, tipo_usuario } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    if (nome.length < 3) {
      return res.status(400).json({ error: 'O nome deve ter pelo menos 3 caracteres.' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    if (tipo_usuario && !['usuario', 'admin'].includes(tipo_usuario)) {
      return res.status(400).json({ error: "O tipo de usuário deve ser 'usuario' ou 'admin'." });
    }


    if (tipo_usuario === 'admin' && (!req.user || req.user.tipo_usuario !== 'admin')) {
      return res.status(403).json({ error: 'Apenas administradores podem criar outros administradores.' });
    }

    const newUser = await userService.createUser(nome, senha, tipo_usuario || 'usuario');
    res.status(201).json({ message: 'Usuário criado com sucesso.', usuario: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao criar usuário.' });
  }
};


exports.authenticateUser = async (req, res) => {
  try {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    const user = await userService.authenticateUser(nome, senha);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }


    const token = jwt.sign(
      { id: user.id, nome: user.nome, tipo_usuario: user.tipo_usuario },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.json({ token, tipo_usuario: user.tipo_usuario });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao autenticar usuário.' });
  }
};


exports.getUsers = async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem acessar esta informação.' });
    }

    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }


    if (req.user.id !== parseInt(id) && req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, senha } = req.body;

    if (req.user.id !== parseInt(id) && req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado.' });
    }


    const currentUser = await userService.getUserById(id);
    if (!currentUser) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (!nome && !senha) {
      return res.status(400).json({ error: 'Nenhuma alteração foi feita.' });
    }

    const updatedUser = await userService.updateUser(id, nome, senha);
    res.status(200).json({ message: 'Usuário atualizado com sucesso.', usuario: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao atualizar usuário.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== parseInt(id) && req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado.' });
    }


    if (req.user.tipo_usuario === 'admin') {
      const users = await userService.getUsers();
      const totalAdmins = users.filter(user => user.tipo_usuario === 'admin').length;

      if (totalAdmins === 1 && parseInt(id) === req.user.id) {
        return res.status(400).json({ error: 'O último administrador não pode ser excluído.' });
      }
    }

    await userService.deleteUser(id);
    res.status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erro ao remover usuário.' });
  }
};
