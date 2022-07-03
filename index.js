const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'talker.json');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const tokenGenerator = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i += 1) {
      result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
};

const validateEmail = (req, res, next) => {
  const regexEmail = /\S+@\S+\.\S+/;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  }
  if (!regexEmail.test(email)) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: 'O campo "password" é obrigatório',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }

  next();
};

app.get('/talker', (req, res) => {
  const file = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(file);
  res.status(200).json(parsed);
});

app.get('/talker/:id', (req, res) => {
  const file = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(file);
  const { id } = req.params;
  const item = parsed.find((r) => r.id === Number(id));

  if (!item) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(item);
});

app.post('/login',
  validateEmail,
  validatePassword,
  (req, res) => {
  const token = tokenGenerator();
  res.status(200).json({ token });
});
