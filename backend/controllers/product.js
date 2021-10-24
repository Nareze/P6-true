const Product = require("../models/product");
const fs = require("fs");
const { json } = require("express");

exports.getAllProduct = (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json(products))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneProduct = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => res.status(200).json(product))
    .catch((error) => res.status(404).json({ error }));
};

exports.createProduct = (req, res, next) => {
  const productObject = JSON.parse(req.body.sauce);
  console.log("//////// create product : " + req.body.sauce);
  delete productObject._id;
  const product = new Product({
    ...productObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  console.log("//////// product : " + product);
  console.log("//////// product : " + product.userId);
  product
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyProduct = (req, res, next) => {
  const productObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Product.updateOne(
    { _id: req.params.id },
    { ...productObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet Modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteProduct = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      const filename = product.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Product.deleteOne({ _id: req.params.id })
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
    case like = 1:
      Product.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { likes: 1 }, $push: { usersLiked: user } }
      )
        .then(() => res.status(200).json({ message: "Review ajouté" }))
        .catch((error) => res.status(400).json({ error }));
      break;

    case like = -1:
      Product.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { dislikes: 1 }, $push: { usersDisliked: user } }
      )
        .then(() => res.status(200).json({ message: "Review ajouté" }))
        .catch((error) => res.status(400).json({ error }));
      break;

    case like = 0:
      Product.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.includes(user)) {
            console.log("User : " + sauce.usersLiked);
            Product.findOneAndUpdate(
              { _id: req.params.id },
              { $pull: { usersLiked: user }, $inc: { likes: -1 } }
            )
              .then(() => {
                res.status(200).json({ message: "Review supprimé" });
              })
              .catch((error) => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.includes(user)) {
            Product.findOneAndUpdate(
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
