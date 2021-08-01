const express = require('express');
const router = express.Router(); // méthode Router, permet de remplacer app.get/post par router.get/post etc
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth'); // ajout du middleware d'auth pour protéger les routes
const multer = require('../middleware/multer-config');
const rate = require('../middleware/rate-limit');


router.post('/', auth, multer, rate.apiLimiter, sauceCtrl.createSauce);
router.post('/:id/like', auth, rate.apiLimiter, sauceCtrl.likes);
router.put('/:id', auth, multer, rate.apiLimiter, sauceCtrl.modifySauce); 
router.delete('/:id', auth, rate.apiLimiter, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;