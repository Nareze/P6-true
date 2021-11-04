module.exports = (req, res, next) => {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  regex.test(req.body.email)
    ? /* Vérification de la conformité du mail */
      next()
    : res.status(401).json({ message: "Email non valide" });
};
