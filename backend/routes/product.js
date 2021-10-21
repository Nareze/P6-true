const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const productCtrl = require('../controllers/product')
const multer = require('../middleware/multer-config')


router.get('/', auth, productCtrl.getAllProduct);
router.get('/:id', auth, productCtrl.getOneProduct);
router.post('/', auth, multer, productCtrl.createProduct);
router.delete('/:id', auth, productCtrl.deleteProduct);


module.exports = router;