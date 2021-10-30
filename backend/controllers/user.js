const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const cryptoJS = require("crypto-js");
const dotenv = require("dotenv");
dotenv.config();

const toHash = require('crypto').randomBytes(64).toString('hex');
console.log(toHash);    /* contenu à hasher */

exports.signup = (req, res, next) => {
  const emailtoCrypt = cryptoJS
    .SHA256(req.body.email, process.env.EMAIL_SECRET)
    .toString();

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new Users({
        email: emailtoCrypt,
        password: hash,
      });

      console.log("contenu user : " + user);

      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const emailtoCrypt = cryptoJS
    .SHA256(req.body.email, process.env.EMAIL_SECRET)
    .toString();
  console.log("contenu mail chiffré : " + emailtoCrypt);

  Users.findOne({ email: emailtoCrypt })
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      return bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            res.status(401).json({ message: "Mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRATION_TIME,
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));

  const token = req.headers.authorization.split(" ")[1];
  console.log("token : " + token);
};
