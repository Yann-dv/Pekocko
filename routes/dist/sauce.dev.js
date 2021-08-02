"use strict";

var express = require('express');

var router = express.Router(); // méthode Router, permet de remplacer app.get/post par router.get/post etc

var sauceCtrl = require('../controllers/sauce');

var auth = require('../middleware/auth'); // ajout du middleware d'auth pour protéger les routes


var multer = require('../middleware/multer-config');

var rate = require('../middleware/rate-limit');

router.post('/', auth, multer, rate.apiLimiter, sauceCtrl.createSauce);
router.post('/:id/like', auth, rate.apiLimiter, sauceCtrl.likeDislike);
router.put('/:id', auth, multer, rate.apiLimiter, sauceCtrl.modifySauce);
router["delete"]('/:id', auth, rate.apiLimiter, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
module.exports = router;