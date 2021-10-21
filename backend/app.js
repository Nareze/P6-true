const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const mongoose = require("mongoose");
const path = require('path');

const userRoutes = require("./routes/user")
const productRoutes = require("./routes/product")


app.use(express.urlencoded({ limit:'30mb', extended: true })); 
app.use(express.json({ limit:'30mb', extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', productRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;