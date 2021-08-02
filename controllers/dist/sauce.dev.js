"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Sauce = require('../models/Sauce');

var fs = require('fs');

exports.createSauce = function (req, res, next) {
  var sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  var sauce = new Sauce(_objectSpread({}, sauceObject, {
    imageUrl: "".concat(req.protocol, "://").concat(req.get('host'), "/images/").concat(req.file.filename),
    likes: 0,
    dislikes: 0 // Avec les données passées en formulaire

  }));
  sauce.save().then(function () {
    return res.status(201).json({
      message: "".concat(sauceObject.name, " enregistr\xE9e dans la base de donn\xE9es")
    });
  })["catch"](function (error) {
    return res.status(400).json({
      error: error
    });
  });
};

exports.modifySauce = function (req, res, next) {
  // route pour la modification de l'objet, en fonction de son _id
  var sauceObject = req.file ? // on vérifie qu'il existe un req.file et donc un fichier envoyé
  _objectSpread({}, JSON.parse(req.body.sauce), {
    imageUrl: "".concat(req.protocol, "://").concat(req.get('host'), "/images/").concat(req.file.filename)
  }) : _objectSpread({}, req.body); // si pas de file, on récupère le corps de requête

  Sauce.updateOne({
    _id: req.params.id
  }, _objectSpread({}, sauceObject, {
    _id: req.params.id
  })) // objet en 1er argument, modif en 2ème avec un _id correspondant
  .then(function () {
    return res.status('200').json({
      message: 'Sauce modifiée'
    });
  })["catch"](function (error) {
    return res.status('400').json({
      error: error
    });
  });
};

exports.deleteSauce = function (req, res, next) {
  Sauce.findOne({
    _id: req.params.id
  }).then(function (sauce) {
    var filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink("images/".concat(filename), function () {
      Sauce.deleteOne({
        _id: req.params.id
      }).then(function () {
        return res.status('200').json({
          message: 'Sauce supprimée'
        });
      })["catch"](function (error) {
        return res.status('400').json({
          error: error
        });
      });
    });
  })["catch"](function (error) {
    return res.status(500).json({
      error: error
    });
  });
};

exports.getOneSauce = function (req, res, next) {
  // route d'accès aux objets selon leur id
  Sauce.findOne({
    _id: req.params.id
  }).then(function (sauce) {
    return res.status(200).json(sauce);
  })["catch"](function (error) {
    return res.status(404).json({
      error: error
    });
  });
};

exports.getAllSauces = function (req, res, next) {
  Sauce.find() // Envoi de toutes les sauces en DB
  .then(function (sauces) {
    return res.status(200).json(sauces);
  })["catch"](function (error) {
    return res.status(400).json({
      error: error
    });
  });
};

exports.likes = function (req, res, next) {
  var user = req.body.userId;
  var likeValue = req.body.like;
  var alreadyLiked = Sauce.findOne({
    _id: req.params.id
  }, {
    usersLiked: user
  });
  var alreadyDisliked = Sauce.findOne({
    _id: req.params.id
  }, {
    usersDisliked: user
  });
  /*sauces.find(
    { results: { $elemMatch: {_id: req.params.id, score: { $gte: 8 } } } }
  )*/

  Sauce.findOne({
    _id: req.params.id
  }).then(function () {
    if (likeValue == -1 && !alreadyDisliked) // je n'aime pas
      {
        Sauce.updateOne({
          _id: req.params.id
        }, {
          $inc: {
            dislikes: +1
          },
          $addToSet: {
            usersDisliked: user
          },
          $pull: {
            usersLiked: user
          },
          _id: req.params.id
        }).then(function () {
          return res.status('200').json({
            message: 'Dislike ajouté'
          });
        })["catch"](function (error) {
          return res.status(400).json({
            message: 'Dislike non ajouté'
          });
        });
      } else if (likeValue == 1 && !alreadyLiked) // j'aime
      {
        Sauce.updateOne({
          _id: req.params.id
        }, {
          $inc: {
            likes: +1
          },
          $addToSet: {
            usersLiked: user
          },
          $pull: {
            usersDisliked: user
          },
          _id: req.params.id
        }).then(function () {
          return res.status('200').json({
            message: 'Like ajouté'
          });
        })["catch"](function (error) {
          return res.status(400).json({
            message: 'Like non ajouté'
          });
        });
      } else if (likeValue == 0) {
      /*if({_id: req.params.id} && usersDisliked) {
        Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: user}, _id: req.params.id})
        }
      else if({_id: req.params.id} && usersLiked) {
        Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: user}, _id: req.params.id})
      }*/
    }
  }).then(function () {
    return res.status('200').json({
      message: 'Mise à jours des likes et dislikes'
    });
  })["catch"](function (error) {
    return res.status(400).json({
      error: error
    });
  });
};