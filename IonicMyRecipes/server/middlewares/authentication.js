const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ message: "لم يتم توفير رمز الدخول" });
    }

    const deCoded = jwt.verify(token, process.env.JWT);
    req.currentUser = deCoded;
    next();
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = isLoggedIn;
