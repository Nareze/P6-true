const passwordSchema = require("../models/validator");

module.exports = (req, res, next) => {
  passwordSchema.validate(req.body.password)
  /* Vérification de la conformitée du mot de passe à partir du schema déclaré */
    ? next()
    : res.status(401).json({ message: "Mot de passe incorrect" });
};
