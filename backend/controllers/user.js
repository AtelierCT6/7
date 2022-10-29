const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sha256 = require('sha256');
const User = require('../model/user');

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({      
        email: sha256(req.body.email),
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
  })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  User.findOne({ email: sha256(req.body.email) })
      .then(user => {
          if (!user) {
              return res.status(401).json({ error: 'Utilisateur non trouvé !' });
          }
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                if (!valid) {
                  return res.status(401).json({error: 'Mot de passe incorrect !'});
                } 
                  res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                  })
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

exports.logout = (req, res) => {
  User.findOne({ _id: req.body.userId })
    .then(() => {
      res.status(200).json({
        data: {
          userId: '',
          token : ''
        },
        detail: {
          status: 200,
          msg: 'Vous êtes bien déconnecté'
        }
    })
    })
  .catch(error => res.status(500).json({ error }))
}

exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => res.status(500).json({ error }))
}