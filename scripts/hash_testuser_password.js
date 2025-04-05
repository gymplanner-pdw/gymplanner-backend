const bcrypt = require("bcrypt");
const pool = require("../src/database");

const atualizarSenhaTestUser = async () => {
  try {
    const senha = "senha123";
    const hash = await bcrypt.hash(senha, 10);

    const query = `
      UPDATE usuarios
      SET senha = $1
      WHERE nome = 'testuser'
    `;

    await pool.query(query, [hash]);

    console.log("Senha do testuser atualizada com hash:", hash);
  } catch (err) {
    console.error("Erro ao atualizar senha do testuser:", err.message);
  } finally {
    pool.end();
  }
};

atualizarSenhaTestUser();
