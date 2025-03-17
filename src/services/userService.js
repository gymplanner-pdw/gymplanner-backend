const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.getUsers = async () => {
  try {
    return await userModel.getAllUsers();
  } catch (error) {
    throw new Error('Erro ao buscar usuários.');
  }
};

exports.getUserById = async (id) => {
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    return user;
  } catch (error) {
    throw new Error('Erro ao buscar usuário.');
  }
};


exports.createUser = async (nome, senha, tipo_usuario = 'usuario') => {
  try {
    const existingUser = await userModel.getUserByName(nome);
    if (existingUser) {
      throw new Error('Nome de usuário já está em uso.');
    }


    const hashedPassword = await bcrypt.hash(senha, 10);

    return await userModel.createUser(nome, hashedPassword, tipo_usuario);
  } catch (error) {
    throw new Error(error.message || 'Erro ao criar usuário.');
  }
};

exports.authenticateUser = async (nome, senha) => {
  try {
    const user = await userModel.getUserByName(nome);
    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      throw new Error('Credenciais inválidas.');
    }

    return user;
  } catch (error) {
    throw new Error(error.message || 'Erro na autenticação do usuário.');
  }
};

exports.updateUser = async (id, nome, senha) => {
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    let hashedPassword = null;
    if (senha) {
      hashedPassword = await bcrypt.hash(senha, 10);
    }

    return await userModel.updateUser(id, nome, hashedPassword);
  } catch (error) {
    throw new Error(error.message || 'Erro ao atualizar usuário.');
  }
};

exports.deleteUser = async (id, tipo_usuario_solicitante) => {
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return await userModel.deleteUser(id, tipo_usuario_solicitante);
  } catch (error) {
    throw new Error(error.message || 'Erro ao excluir usuário.');
  }
};
