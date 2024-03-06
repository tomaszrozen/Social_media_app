const express = require('express');
const aiMain = require('../services/ai');
const verifyToken = require('../middleware/verifyToken');
const Post = require('../models/post');

const router = express.Router();

async function fetchPosts(req) {
    try {
      const posts = await Post.find({ author: req.user._id });
      return posts;
    } catch (error) {
      console.error("Failed to catch posts:", error);
      return null;
    }
}

router.get('/cv', verifyToken, async (req, res) => {
    const posts = await fetchPosts(req);
    let postsString = "";
    if (posts) {
        postsString = posts.map(post => post.content).join("; ");
    }
    
    const aiResult = await aiMain(req.user.firstName, req.user.lastName, postsString, req.user.userDescription);
    let parsedAiResult;
    try {
        parsedAiResult = JSON.parse(aiResult);
    } catch (error) {
        console.error("Failed to parse AI result:", error);
        return res.status(500).send("Error parsing AI result. Try refreshing the page or contact support.");
    }
    const experiences = parsedAiResult.experiences;
    const interests = parsedAiResult.interests;
    const skills = parsedAiResult.skills;
    const licenses = parsedAiResult.licenses;
    const educations = parsedAiResult.educations;
    res.render('cv', { aiResult: aiResult, user: req.user, interests: interests, experiences: experiences, skills: skills, licenses: licenses, educations: educations });
});

module.exports = router;