const Products = require("../models/product");
const fs = require("fs");

exports.getAllProducts = (req, res, next) => {
  Products.find()
    .then((Products) => res.status(200).json(Products))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneProduct = (req, res, next) => {
  Products.findOne({ _id: req.params.id })
    .then((Products) => res.status(200).json(Products))
    .catch((error) => res.status(404).json({ error }));
};

exports.createProduct = (req, res, next) => {
  const productObject = JSON.parse(
    req.body.sauce
  ); /* on convertis la requete entrante en objet JSON */
  delete productObject._id;
  const product = new Products({
    ...productObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename /* création de l'url de la nouvelle image */
    }`,
  });
  console.log("product : " + product);
  product
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyProduct = (req, res, next) => {
  const productObject = req.file
    ? {
        /* dans le cas ou l'ont doit modifier l'objet, on convertit la requete entrante et on créee l'url de l'image */
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        ...req.body,
      }; /* dans le cas ou l'image n'est pas remplacée ,on laisse le corps de la requête (si la description de la sauce est modifié) */

  Products.findOne({ _id: req.params.id })
    /* on supprime la photo remplacée */
    .then((sauce) => {
      if (req.file == null) {
        /* si la photo n'est pas changée (description de la photo modifié) */
        Products.updateOne(
          { _id: req.params.id },
          { ...productObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "objet updated" }))
          .catch((error) => console.log(error));
        console.log("no change");
      } else {
        /* si une photo est ajouté on remplace la photo est on supprime la photo remplacé */
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Products.updateOne(
            { _id: req.params.id },
            { ...productObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "objet updated" }))
            .catch((error) => console.log(error));
        });
        console.log("change");
      }
    })
    .catch((error) => console.log(error));
};

exports.deleteProduct = (req, res, next) => {
  Products.findOne({ _id: req.params.id })
    .then((products) => {
      const filename = products.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        products
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "objet supprimé" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.reviewProduct = (req, res, next) => {
  let like = req.body.like;
  let user = req.body.userId;
  console.log("front response " + req.body.like);

  switch (like) {
    case (like = 1):
      Products.findOneAndUpdate(
        { _id: req.params.id },
        /* on ajoute incrémente un like puis on ajoute l'userId dans le array usersLiked */
        { $inc: { likes: 1 }, $push: { usersLiked: user } }
      )
        .then(() => res.status(200).json({ message: "Like ajouté" }))
        .catch((error) => res.status(400).json({ error }));
      break;

    case (like = -1):
      Products.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { dislikes: 1 }, $push: { usersDisliked: user } }
      )
        .then(() => res.status(200).json({ message: "Dislike ajouté" }))
        .catch((error) => res.status(400).json({ error }));
      break;

    case (like = 0):
      Products.findOne({ _id: req.params.id })
        .then((sauce) => {
          console.log("sauce : " + sauce);
          if (sauce.usersLiked.includes(user)) {
            /* si le array usersLiked possède un j'aime alors on décremente et on retire le j'aime du array */
            console.log("User : " + sauce.usersLiked);
            Products.findOneAndUpdate(
              { _id: req.params.id },
              { $pull: { usersLiked: user }, $inc: { likes: -1 } }
            )
              .then(() => {
                res.status(200).json({ message: "Review supprimé" });
              })
              .catch((error) => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.includes(user)) {
            Products.findOneAndUpdate(
              { _id: req.params.id },
              { $pull: { usersDisliked: user }, $inc: { dislikes: -1 } }
            )
              .then(() => {
                res.status(200).json({ message: "Review supprimé" });
              })
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(400).json({ error }));
      break;
  }
};
