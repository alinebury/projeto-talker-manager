const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'talker.json');
const file = fs.readFileSync(filePath, 'utf8');
const parsed = JSON.parse(file);

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

app.get('/talker', (req, res) => {
  res.status(200).json(parsed);
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const item = parsed.find((r) => r.id === Number(id));

  if (!item) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(item);
});