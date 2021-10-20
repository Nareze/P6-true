const Product = require('../models/product')


exports.getAllProduct = (req, res, next) => { 
    Product.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({error}));
    }

exports.getOneProduct = (req, res, next) => { 
    Product.findOne({ _id: req.params.id })         
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({error}))
};