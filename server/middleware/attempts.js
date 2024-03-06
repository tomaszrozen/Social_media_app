const RateLimit = require('express-rate-limit');

const ApiRateLimiter = RateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // max 5 attempts
    message: { message: 'Too many attempts, please try again after some time' },
    headers: true,
});
  
module.exports = ApiRateLimiter;