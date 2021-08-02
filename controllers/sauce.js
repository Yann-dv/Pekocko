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

exports.likeDislike = (req, res, next) => {
  let like = req.body.like // Like présent dans le body
  let userId = req.body.userId // Récupération du userID
  let sauceId = req.params.id // Récupération de la sauce

  if (like === 1) { // si like
    Sauce.updateOne({
        _id: sauceId
      }, {
        // On push l'utilisateur et on incrémente le compteur de +1
        $push: {
          usersLiked: userId
        },
        $inc: {
          likes: +1
        },
      })
      .then(() => res.status(200).json({
        message: 'J\'aime ajouté !'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === -1) {
    Sauce.updateOne( // si dislike
        {
          _id: sauceId
        }, {
          $push: { // On push l'utilisateur et on incrémente le compteur de +1
            usersDisliked: userId
          },
          $inc: {
            dislikes: +1
          },
        }
      )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté !'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === 0) { // Annulation
    Sauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { //on regarde si userId est dans le tableau
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersLiked: userId // on retire l'userId enregistré
              },
              $inc: {
                likes: -1
              }, // On incrémente de -1
            })
            .then(() => res.status(200).json({
              message: 'Like retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
        if (sauce.usersDisliked.includes(userId)) { //on regarde si userId est dans le tableau
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersDisliked: userId
              },
              $inc: {
                dislikes: -1
              }, // On incrémente de -1
            })
            .then(() => res.status(200).json({
              message: 'Dislike retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
      })
      .catch((error) => res.status(404).json({
        error
      }))
  }
}
