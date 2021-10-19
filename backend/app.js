const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user")
const cors = require("cors");


mongoose.connect('mongodb+srv://Manks:7w7WtMQwpaNOZ2Dh@cluster0.2k7qq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
app.use("*", cors());

app.use('/api/auth', userRoutes); /* ??? */
app.use('/api/login', userRoutes);

module.exports = app;