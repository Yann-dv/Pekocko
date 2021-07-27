const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    console.log("Hello server");
  /*const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    const thing = new Thing({ // récupération du modèle Thing
      ...thingObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`     // Avec les données passées en formulaire
    });
    thing.save()
    .then(() => res.status(201).json({message : 'Objet enregistré dans database'}))
    .catch(error => res.status(400).json({ error }));*/
  };
