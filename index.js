const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { validateEmail, validatePassword,
  validateToken, validateName, validateAge, validateTalk, validateWatchAt, validateRate,
} = require('./validates.js');

const app = express();
app.use(bodyParser.json());

const PORT = '3000';
const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND_STATUS = 404;
const HTTP_CREATED_STATUS = 201;
const HTTP_NO_CONTENT_STATUS = 204;

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const read = () => {
  const filePath = path.join(__dirname, 'talker.json');
  const file = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(file);

  return parsed;
};

const write = (talkers) => {
  const filePath = path.join(__dirname, 'talker.json');
  fs.writeFileSync(filePath, JSON.stringify(talkers), 'utf8');
};

const tokenGenerator = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i += 1) {
      result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
};

app.get('/talker/search',
  validateToken,
  (req, res) => {
  const talkers = read();
  const { q } = req.query;
  const filterTalker = talkers.filter((talker) => talker.name.includes(q));

  res.status(HTTP_OK_STATUS).json(filterTalker);
});

app.get('/talker', (req, res) => {
  const talkers = read();

  res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', (req, res) => {
  const talkers = read();
  const { id } = req.params;
  const item = talkers.find((talker) => talker.id === Number(id));

  if (!item) {
    return res.status(HTTP_NOT_FOUND_STATUS)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }

  res.status(HTTP_OK_STATUS).json(item);
});

app.post('/login',
  validateEmail,
  validatePassword,
  (req, res) => {
  const token = tokenGenerator();

  res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchAt,
  validateRate,
  (req, res) => {
  const talkers = read();
  const id = talkers.length + 1;
  const { name, age, talk } = req.body;
  const newTalker = [...talkers, { id, name, age, talk }];
  write(newTalker);

  res.status(HTTP_CREATED_STATUS).json({ id, name, age, talk });
});

app.put('/talker/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchAt,
  validateRate,
  (req, res) => {
  const talkers = read();
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const edit = talkers.findIndex((talker) => talker.id === Number(id));
  talkers[edit] = { ...talkers[edit], name, age, talk };
  write(talkers);

  res.status(HTTP_OK_STATUS).json(talkers[edit]);
});

app.delete('/talker/:id',
  validateToken,
  (req, res) => {
  const talkers = read();
  const { id } = req.params;
  const newFile = talkers.filter((p) => p.id !== Number(id));
  write(newFile);

  res.status(HTTP_NO_CONTENT_STATUS).json(newFile);
});