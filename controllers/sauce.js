const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces =  (req, res, next) => { // ajout de la route d'appel à l'api en premier argument
  Sauce.find()   // Envoi de toutes les sauces en DB
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error}));
};
