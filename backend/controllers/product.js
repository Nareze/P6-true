const Product = require('../models/product')
const fs = require("fs");


exports.getOneProduct = (req, res, next) => { 
    Product.findOne({ _id: req.params.id })         
    .then(product => res.status(200).json(product))
    .catch(error => res.status(404).json({error}))
    };

exports.getAllProduct = (req, res, next) => { 
    Product.find()
    .then(products => res.status(200).json(products))
    .catch(error => res.status(400).json({error}));
    }

exports.createProduct = (req, res, next) => {
    const productObject = JSON.parse(req.body.sauce);
    console.log(req.body.sauce);
    delete productObject._id;
    const product = new Product({
        ...productObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(product)
    product.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        /*.catch(error => res.status(400).json({ error }));*/
        .catch(error => console.log(error));
    };

exports.deleteProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.id })
    .then (product => {
        const filename = product.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Product.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({message : 'objet supprimé'}))
            .catch(error => res.status(400).json({error}));
        })
    })
    .catch(error => res.status(500).json({error}));
    }

exports.modifyProduct = (req, res, next) => {
    const productObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Product.updateOne({ _id : req.params.id }, { ...productObject, _id : req.params.id })
    .then(() => res.status(200).json({message : 'Objet Modifié'}) )
    .catch (error => res.status(400).json({ error }));

    console.log("empl1 : " + req.body.product);
    console.log("empl2 : " + productObject);
    }


