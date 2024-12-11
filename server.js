const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));



let usuarios = [];

app.use(express.json());

app.get('/usuarios', (req, res) => {
  res.json(usuarios); 
});

app.post('/usuarios', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const novoUsuario = {
    id: usuarios.length + 1, 
    nome,
    email,
    senha,
  };

  usuarios.push(novoUsuario);

  res.status(201).json(novoUsuario); 
});