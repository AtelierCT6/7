const Post = require('../model/post');
const fs = require('fs');
const post = require('../model/post');

exports.createPost = (req, res) => {
  // const postObject = JSON.parse(req.body.post);
  const postObject = req.body.post;
  // delete postObject._id;
  const post = new Post({
      ...postObject
      // userId: req.auth.userId,
      // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  post.save()
  .then(() => { res.status(201).json({message: 'Votre message a été envoyé !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.modifyPost = (req, res) => {
  const postObject = req.file ? {
      ...JSON.parse(req.body.post),
      ...req.body.post,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Post.findOne({_id: req.params.id})
      .then((post) => {
          // if (post.userId != req.auth.userId) {
          //     res.status(401).json({ message : 'Autorisation requise'});
          // } else {
              Post.updateOne({ _id: req.params.id}, { ...postObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Votre message a bien été modifié!'}))
              .catch(error => res.status(401).json({ error }));
          // }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deletePost = (req, res) => {
  Post.findOne({ _id: req.params.id})
    .then(post => {
          // if (post.userId != req.auth.userId) {
          //     res.status(401).json({message: 'Not authorized'});
          // } else {
              const filename = post.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Post.deleteOne({_id: req.params.id})
                    .then(() => {
                      res.status(200).json({ message: 'Message supprimé !' })
                    })
                      .catch(error => res.status(401).json({ error }));
              });
          // }
      })  
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.likePost = (req, res) => {
  switch (req.body.likes) {
    case 0: // user cancel like
      Post.findOne({ _id: req.params.id })
        .then(post => {
          let likeArray = post.likedBy;
            likeArray.splice(likeArray.indexOf(req.body.userId), 1);
            Post.updateOne({ _id: req.params.id }, {
              like: likeArray.length,
              likedBy: likeArray
            })
              .then(() => res.status(201).json({ message: "Like supprimé !" }))
              .catch(error => res.status(401).json({ error }));
        });
      break;
   
    case 1: // user like the post
      Post.findOne({ _id: req.params.id })
        .then(post => {
          let likeArray = post.likedBy;
            likeArray.push(req.body.userId);
            Post.updateOne({ _id: req.params.id }, {
              like: likeArray.length,
              likedBy: likeArray
            })
              .then(() => res.status(201).json({ message: 'Like ajouté!' }))
              .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(401).json({ error }));  
      break;
   
  }
};

exports.getAllPost = (req, res) => {
  Post.find().then(
    (posts) => {
      res.status(200).json(posts);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};