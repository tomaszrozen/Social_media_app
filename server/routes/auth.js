const express = require('express');
const { Login } = require('../controllers/auth');
const ApiRateLimiter = require('../middleware/attempts');

const router = express.Router();

router.post('/login', ApiRateLimiter, Login);
router.post('/logout', (req, res) => {
    // clear cookie
    res.clearCookie('token');
    // redirect to home page
    res.redirect('/');
});

module.exports = router;