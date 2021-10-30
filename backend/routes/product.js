const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const productCtrl = require("../controllers/product");
const multer = require("../middleware/multer-config");

router.get("/", auth, productCtrl.getAllProducts);
router.get("/:id", auth, productCtrl.getOneProduct);
router.post("/", auth, multer, productCtrl.createProduct);
router.put("/:id", auth, multer, productCtrl.modifyProduct);
router.delete("/:id", auth, productCtrl.deleteProduct);
router.post("/:id/like", auth, productCtrl.reviewProduct);

module.exports = router;
