const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');


router.get('/post/:id', auth, postCtrl.getAllPost);
router.post('/post', auth, multer, postCtrl.createPost);
router.put('/post/:id', multer,postCtrl.modifyPost);
router.delete('/post/:id', auth, postCtrl.deletePost);
router.post("/post/:id/likes", auth, postCtrl.likePost);
router.put("/post/:id/moderated", auth, postCtrl.hidePost);

module.exports = router;