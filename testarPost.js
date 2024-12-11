const http = require('http');
const fs = require('fs');

// Lê os dados do arquivo JSON
fs.readFile('usuarios.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo JSON:', err);
    return;
  }

  // Parse do arquivo JSON
  const usuario = JSON.parse(data);

  // Configurações da requisição
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/usuarios',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(usuario))
    }
  };

  // Cria a requisição HTTP
  const req = http.request(options, (res) => {
    let responseData = '';

    // Quando receber dados da resposta
    res.on('data', chunk => {
      responseData += chunk;
    });

    // Quando a resposta for finalizada
    res.on('end', () => {
      console.log('Resposta do servidor:', responseData);
    });
  });

  // Envia o corpo da requisição com os dados do usuário
  req.write(JSON.stringify(usuario));
  req.end();

  req.on('error', (e) => {
    console.error(`Erro na requisição: ${e.message}`);
  });
});
