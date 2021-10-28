const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/user");

const jwtToCrypt = require('crypto').randomBytes(64).toString('hex');
console.log(jwtToCrypt);





exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new users({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  users.findOne({ email: req.body.email})
  .then ((user) =>{
      if(!user){
          res.status(401).json({message:"Utilisateur non trouvé"});
  }

  return bcrypt.compare(req.body.password, user.password)
  .then(valid => {
      if(!valid){
          res.status(401).json({message:"Mot de passe incorrect"})
      }
      res.status(200).json({
        userId : user._id,
        token : jwt.sign({userId : user._id}, process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRATION_TIME,})
      });
  })
  .catch((error) => res.status(500).json({error}));
  })
  .catch((error) => res.status(500).json({error}));
  
  const token = req.headers.authorization.split(' ')[1];
  console.log("token : " + token)
  };




