const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({ // récupération du modèle sauce
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` ,
      likes : 0,
      dislikes: 0// Avec les données passées en formulaire
    });
    sauce.save()
    .then(() => res.status(201).json({message : `${sauceObject.name} enregistrée dans la base de données`}))
    .catch(error => res.status(400).json({ error }));
  };

exports.getAllSauces =  (req, res, next) => {
  Sauce.find()   // Envoi de toutes les sauces en DB
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error}));
};
