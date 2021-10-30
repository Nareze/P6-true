const passwordValidator = require("password-validator");

// Create a schema
var schema = new passwordValidator();

// Ajouter les propriétés
schema
  .is()
  .min(8) // longueur minimale
  .has()
  .uppercase() // doit avoir des majuscules
  .has()
  .lowercase() // doit avoir des minuscules
  .has()
  .digits(2) // doit avoit au moins deux nombres
  .has()
  .not()
  .spaces(); // ne doit pas avoir d'espaces

module.exports = schema;
