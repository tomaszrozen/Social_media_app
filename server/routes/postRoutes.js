const express = require('express');
const verifyToken = require("../middleware/verifyToken");

const {addComment, likes, getPosts, addPost} = require("../controllers/postController");

const router = express.Router();

router.get('/getPosts', verifyToken, getPosts);
router.post('/addPost', verifyToken, addPost);
router.post('/addComment/:postId', verifyToken, addComment);
router.post('/like/:postId', verifyToken, likes);

module.exports = router;