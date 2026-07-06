const jwt = require("jsonwebtoken");

/**
 * Create a signed JWT for a user.
 * Payload includes user id; admin is checked from DB in middleware.
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = generateToken;


