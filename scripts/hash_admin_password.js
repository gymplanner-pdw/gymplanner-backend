const bcrypt = require('bcrypt');
const pool = require('../src/database');

async function updateAdminPassword() {
  const senha = 'admin123';
  const hash = await bcrypt.hash(senha, 10);

  const result = await pool.query(
    'UPDATE usuarios SET senha = $1 WHERE nome = $2',
    [hash, 'admin']
  );

  console.log("Senha do admin atualizada com hash:", hash);
  process.exit();
}

updateAdminPassword().catch(err => {
  console.error("Erro ao atualizar senha do admin:", err);
  process.exit(1);
});
