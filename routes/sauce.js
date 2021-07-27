const express = require('express');
const router = express.Router(); // méthode Router, permet de remplacer app.get/post par router.get/post etc
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth'); // ajout du middleware d'auth pour protéger les routes
const multer = require('../middleware/multer-config');


/*router.post('/', auth, multer, sauceCtrl.createThing);
router.put('/:id', auth, multer, sauceCtrl.modifyThing); 
router.delete('/:id', auth, sauceCtrl.deleteThing);
router.get('/:id', auth, sauceCtrl.getOneThing);
router.get('/', auth, sauceCtrl.getAllThings);*/
router.get('/', sauceCtrl.createThing);

module.exports = router;