const { rateLimit } = require('express-rate-limit');

const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `user-${req.user.id}`,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    message: 'Alcanzaste el máximo de 10 análisis de IA por hora. Intenta de nuevo más tarde.'
  })
});

module.exports = { aiRateLimit };
