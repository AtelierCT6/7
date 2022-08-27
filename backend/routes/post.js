const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');


// router.get('/home', auth, postCtrl.getAllPost);
router.get('/home', postCtrl.getAllPost);
// router.post('/post', auth, multer, postCtrl.createPost);
router.post('/post', multer, postCtrl.createPost);
// router.put('/:id', auth, multer, postCtrl.modifyPost);
router.put('/post/:id', postCtrl.modifyPost);
// router.delete('/post/:id', auth, postCtrl.deletePost);
// router.post("/:id/like", auth, postCtrl.likePost);
router.post("/post/:id/likes", postCtrl.likePost);
router.delete('/post/:id', postCtrl.deletePost);

module.exports = router;