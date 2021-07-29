const rateLimit = require("express-rate-limit");

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

exports.apiLimiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 100,
message: "Vous avez crée ou modifié trop de sauces en peu de temps, veuillez patienter 15 minutes avant de réessayer.",
});

exports.loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  message: "Vous vous êtes connectés trop de fois en peu de temps, veuillez réessayer dans 5 minutes."
  });


exports.createAccountLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30min
  max: 5, // start blocking after 5 requests
  message: "Vous avez crée trop de comptes différents avec la même adresse IP, merci d'attendre 30 minutes pour réessayer.",
});
