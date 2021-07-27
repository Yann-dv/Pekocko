const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User ({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur crée!'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}) // recherce de l'email utilisateur dans DB
    .then(user => {
        if (!user) { // si email introuvable dans DB
            return res.status(401).json({error : 'Utilisateur introuvable !'});
        }
        bcrypt.compare(req.body.password, user.password) // compare password entrée dans la requête avec celui de l'user dans la DB
        .then(valid => {
            if (!valid) { // si mauvais mdp
                return res.status(401).json({error : 'Mot de passe incorrect !'});
            }
            res.status(200).json({ // si bon mdp, on retourne un userId et un token
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: '12h'}
                )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};