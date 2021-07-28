const express = require('express');
const router = express.Router(); // méthode Router, permet de remplacer app.get/post par router.get/post etc
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth'); // ajout du middleware d'auth pour protéger les routes
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, sauceCtrl.createSauce);
//router.post('/:id/like', auth, )
router.put('/:id', auth, multer, sauceCtrl.modifySauce); 
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces); //

module.exports = router;