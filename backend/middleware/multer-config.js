const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
    /* ajout de la destination vers le dossier images */
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name.slice(0, -4) + "_" + Date.now() + "." + extension);
    /* création du fichier image */
  },
});

module.exports = multer({ storage: storage }).single("image");
