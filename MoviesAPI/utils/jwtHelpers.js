const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

// Create new jsonWebToken
exports.sign = (payload) => jwt.sign(payload, secret, { expiresIn });

// Verify is the given token is have acess or is it valide
exports.verify = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return false;
  }
};
