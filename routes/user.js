const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rate = require('../middleware/rate-limit');

router.post('/signup', rate.createAccountLimiter, userCtrl.signup);
router.post('/login', rate.loginLimiter, userCtrl.login);

module.exports = router;