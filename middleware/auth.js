const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // on regarde dans le header de la requête, le split permet de tout récupérer après l'espace dans le header
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) { // le userId du token dans le header doit correspondre à celui entré
            throw 'User ID non valable !';
        } else {
            next (); // Ici, tout correspond, donc on passe à la requête suivante
        }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};