const products = require("../models/product");
const fs = require("fs");



exports.getAllProducts = (req, res, next) => {
  products.find()
    .then((products) => res.status(200).json(products))
    .catch((error) => res.status(400).json({ error }));
};



exports.getOneProduct = (req, res, next) => {
  products.findOne({ _id: req.params.id })
    .then((products) => res.status(200).json(products))
    .catch((error) => res.status(404).json({ error }));
};



exports.createProduct = (req, res, next) => {
  const productObject = JSON.parse(req.body.sauce);
  console.log("create product : " + req.body.sauce);
  delete productObject._id;
  const product = new products({
    ...productObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
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
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

    products.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.file == null) {
        //Quand la photo n'est pas changée (uploadée)
        products.updateOne(
          { _id: req.params.id },
          { ...productObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "objet updated" }))
          .catch((error) => console.log(error));
        console.log("no change");
      } else {
        //Si la photo est uploadée > changer la photo et supprimer celle dans le server
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          products.updateOne(
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
  products.findOne({ _id: req.params.id })
    .then((products) => {
      const filename = products.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        products.deleteOne({ _id: req.params.id })
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
      products.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { likes: 1 }, $push: { usersLiked: user } }
      )
        .then(() => res.status(200).json({ message: "Like ajouté" }))
        .catch((error) => res.status(400).json({ error }));
      break;

    case like = -1:
      products.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { dislikes: 1 }, $push: { usersDisliked: user } }
      )
        .then(() => res.status(200).json({ message: "Dislike ajouté" }))
        .catch((error) => res.status(400).json({ error }));
      break;

    case like = 0:
      products.findOne({ _id: req.params.id })
        .then((sauce) => {
          console.log('sauce : ' + sauce)
          if (sauce.usersLiked.includes(user)) {
            console.log("User : " + sauce.usersLiked);
            products.findOneAndUpdate(
              { _id: req.params.id },
              { $pull: { usersLiked: user }, $inc: { likes: -1 } }
            )
              .then(() => {
                res.status(200).json({ message: "Review supprimé" });
              })
              .catch((error) => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.includes(user)) {
            products.findOneAndUpdate(
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
