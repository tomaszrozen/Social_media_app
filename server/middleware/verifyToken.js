const User = require('../models/userModel');

// Middleware to verify user authentication based on a token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // If no token is present, redirect to the homepage
    if (!token) {
      return res.redirect('/');
    }

    // Verify the user based on the token
    const user = await User.findByToken(token);

    // If the user is not found, clear the cookie and redirect to the homepage
    if (!user) {
      res.clearCookie('token');
      return res.redirect('/');
    }

    // Attach the user information to the request object
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // If an error occurs, clear the cookie and redirect to the homepage
    res.clearCookie('token');
    return res.redirect('/');
  }
};

module.exports = verifyToken;
