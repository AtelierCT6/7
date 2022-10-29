const Post = require('../model/post');
const User = require('../model/user');
const fs = require('fs');

exports.createPost = async (req, res) => {
  const user = await User.findOne({ _id: req.auth.userId })
  const post = new Post({
    ...req.body,
    userId: req.auth.userId,
  });
  if (req['file'] !== undefined) {
    post['imageUrl'] = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }
  post.save()
  .then(() => { res.status(201).json(post)})
  .catch(error => { res.status(400).json( { error })})
};

exports.modifyPost = (req, res) => {
  if (req.file) {
    Post.findOne({ _id: req.params.id })
      .then(post => {
        if (post.imageUrl !== undefined) {
          fs.unlink(`images/${post.imageUrl.split('/images/')[1]}`, (err) => {
            if (err) throw err;
            console.log('path/file.txt was deleted');
          })
        }
      })
  }
  const postObject = req.file ? {
    ...req.body,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
    Post.updateOne({ _id: req.params.id}, { ...postObject})
     .then(() => res.status(200).json({message : 'Votre message a bien été modifié!'}))
     .catch(error => res.status(401).json({ error }));
};

exports.deletePost = (req, res) => {
  Post.findById(req.params.id)
    .then(async post => {
      if (post.imageUrl != undefined) {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Post supprimé !' })
            })
            .catch(error => res.status(400).json({ error }));
        });
      } else {
        Post.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: 'Post supprimé !' })
          })
          .catch(error => res.status(400).json({ error }));
      }
    })  
    .catch(error => {
      res.status(400).json({ error });
    });
};

exports.likePost = (req, res) => {
  switch (req.body.likes) {
    case 0:
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
   
    case 1:
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
  User.find({ _id: req.params.id })
    .then(user => {
      if (user[0].isAdmin === true) {
        Post.find().populate('userId')
          .then((posts) => {res.status(200).json(posts);})
          .catch((error) => {res.status(400).json(error);});
      } else {
        Post.find({ moderated: false }).populate('userId')
          .then((posts) => {res.status(200).json(posts);})
          .catch((error) => {res.status(400).json(error);});
      }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.hidePost = (req, res) => {
  if (req.body.hide === 1) {
    Post.updateOne({ _id: req.params.id }, { moderated: true })
      .then(() => res.status(201).json({ message: 'Post hide' }))
      .catch(error => res.status(400).json({ error }));
  };
  if (req.body.hide === 0) {
    Post.updateOne({ _id: req.params.id }, { moderated: false })
      .then(() => res.status(201).json({ message: 'Post unhide' }))
      .catch(error => res.status(400).json({ error }));
  };
};