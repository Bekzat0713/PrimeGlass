const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { serviceBySlug } = require('./services');
const { renderHome, renderService, renderContacts, render404 } = require('./render');

const app = express();
const PORT = Number(process.env.PORT) || 3002;

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'https://mc.yandex.ru', 'https://connect.facebook.net'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://mc.yandex.ru', 'https://www.facebook.com'],
      connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://region1.google-analytics.com', 'https://mc.yandex.ru', 'https://www.facebook.com'],
      frameSrc: ["'self'", 'https://www.instagram.com'],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: 'same-origin' }
}));
app.use(express.json({ limit: '12kb' }));

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const staticOptions = { maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0, index: false };
app.use(express.static(path.join(__dirname), staticOptions));

app.get('/', (_req, res) => res.type('html').send(renderHome()));
app.get('/contacts', (_req, res) => res.type('html').send(renderContacts()));
app.get('/404', (_req, res) => res.status(404).type('html').send(render404()));
app.get('/:slug', (req, res, next) => {
  const service = serviceBySlug[req.params.slug];
  if (!service) return next();
  return res.type('html').send(renderService(service));
});
app.use((_req, res) => res.status(404).type('html').send(render404()));

const server = app.listen(PORT, () => {
  console.log(`Prime Glass: http://localhost:${PORT}`);
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exitCode = 1;
    return;
  }
  throw error;
});
