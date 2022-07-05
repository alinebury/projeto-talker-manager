const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;

const validateEmail = (req, res, next) => {
  const regexEmail = /\S+@\S+\.\S+/;
  const { email } = req.body;

  if (!email) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'O campo "email" é obrigatório',
    });
  }
  if (!regexEmail.test(email)) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'O campo "password" é obrigatório',
    });
  }
  if (password.length < 6) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }

  next();
};

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(HTTP_UNAUTHORIZED).json({
      message: 'Token não encontrado',
    });
  }
  if (authorization.length !== 16) {
    return res.status(HTTP_UNAUTHORIZED).json({
      message: 'Token inválido',
    });
  }

  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'O campo "name" é obrigatório',
    });
  }

  if (name.length < 3) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }

  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;

  if (!age) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'O campo "age" é obrigatório',
    });
  }
  if (age < 18) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'A pessoa palestrante deve ser maior de idade',
    });
  }

  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;

  if (!talk) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'O campo "talk" é obrigatório',
    });
  }

  next();
};

const validateWatchAt = (req, res, next) => {
  const regexDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  const { watchedAt } = req.body.talk;
  
  if (!watchedAt) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'O campo "watchedAt" é obrigatório',
    });
  }

  if (!regexDate.test(watchedAt)) {
    return res.status(HTTP_BAD_REQUEST).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }

  next();
};

const validateRate = (req, res, next) => {
  const { rate } = req.body.talk;

  if (!rate && rate !== 0) {
    return res.status(400).json({
      message: 'O campo "rate" é obrigatório',
    });
  }

  if (rate <= 0 || rate > 5) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchAt,
  validateRate,
};