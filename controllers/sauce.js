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

exports.modifySauce = (req, res, next) => { // route pour la modification de l'objet, en fonction de son _id
    const sauceObject = req.file ? // on vérifie qu'il existe un req.file et donc un fichier envoyé
    {// Si on trouve un file, on parse le body, et on l'utilise pour créer une nouvelle image et son url
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : {...req.body}; // si pas de file, on récupère le corps de requête
      Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id}) // objet en 1er argument, modif en 2ème avec un _id correspondant
      .then(() => res.status('200').json({message : 'Sauce modifiée'}))
      .catch(error => res.status('400').json({ error }))
    };
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id})
      .then(() => res.status('200').json({message : 'Sauce supprimée'}))
      .catch(error => res.status('400').json({ error }))
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => { // route d'accès aux objets selon leur id
      Sauce.findOne({ _id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces =  (req, res, next) => {
  Sauce.find()   // Envoi de toutes les sauces en DB
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error}));
};


exports.likes = (req, res, next) => {
  const user = JSON.stringify(req.body.userId);
  const likeValue = req.body.like;
  Sauce.findOne({ _id: req.params.id})
  .then(() => {
    if (likeValue == -1) // je n'aime pas
    {
      Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: +1},$push: {usersDisliked: user}, _id: req.params.id})
      .then(() => res.status('200').json({message : 'Dislike ajouté'}))
      .catch(error => res.status(400).json({message : 'Dislike non ajouté'}));
    }
    else if(likeValue == 1) // j'aime
    {
      Sauce.updateOne({_id: req.params.id}, {$inc: {likes: +1} , _id: req.params.id})
      .then(() => res.status('200').json({message : 'Like ajouté'}))
      .catch(error => res.status(400).json({message : 'Like non ajouté'}));
    }
    else { // neutre
    }
  })
    .then(() => res.status('200').json({message : 'Mise à jours des likes et dislikes'}))
    .catch(error => res.status(400).json({error}));
};
