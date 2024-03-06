const checkLoggedIn = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    // User is logged in, redirect to home page
    return res.redirect('/home');
  }

  // User is not logged in, continue
  next();
};

module.exports = checkLoggedIn;

