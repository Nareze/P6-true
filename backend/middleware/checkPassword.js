const passwordSchema = require("../models/validator");

module.exports = (req, res, next) => {
  passwordSchema.validate(req.body.password)
    ? next()
    : res.status(400).json({ message: "Mot de passe incorrect" });
};
