const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('contenu du token décodé' + JSON.stringify(decodedToken))
    const userId = decodedToken.userId;
    /* on récupère le userId dans le token décodé transformé en objet javascript */
    if (req.body.userId && req.body.userId !== userId) {
      /* si un userId est présent et que ce userId est différent du userId appartenant au token décodé alors : */
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(403).json({
      error: new Error("Unauthorized request"),
    });
  }
};
