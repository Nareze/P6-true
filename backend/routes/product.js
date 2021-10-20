const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')

const productCtrl = require('../controllers/product')

router.get('/', auth, productCtrl.getAllProduct);
router.get('/:id', auth, productCtrl.getOneProduct);


module.exports = router;