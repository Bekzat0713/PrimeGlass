const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors({ origin: true, credentials: true }));
app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Слишком много запросов. Попробуйте позже.'
});

app.use('/api/', apiLimiter);

app.use(express.static(path.join(__dirname)));

app.post(
  '/api/contact',
  [
    body('name').trim().notEmpty().withMessage('Имя обязательно').escape(),
    body('phone').trim().notEmpty().withMessage('Телефон обязателен').escape(),
    body('email').trim().isEmail().withMessage('Неверный Email').normalizeEmail(),
    body('company').optional({ checkFalsy: true }).trim().escape(),
    body('message').optional({ checkFalsy: true }).trim().escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Некорректные данные формы',
        errors: errors.array()
      });
    }

    const { name, company, phone, email, message } = req.body;

    console.log('New contact request:', {
      name,
      company,
      phone,
      email,
      message
    });

    return res.json({ message: 'Заявка успешно принята. Мы скоро свяжемся с вами.' });
  }
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use, trying ${nextPort}...`);
      startServer(nextPort);
      return;
    }
    throw error;
  });
};

startServer(PORT);
