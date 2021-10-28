const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwordCtrl = require('../middleware/checkPassword');

router.post('/signup', passwordCtrl, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;