const { verify } = require("../utils/jwtHelpers");

// check if the cleint send a token in the req header
exports.validatToken = (req, res, next) => {
  let token = req.headers["authorization"];
  token = token?.replace("Bearer", "")?.trim();
  const payload = verify(token);
  if (payload) {
    req.userId = payload.sub;
    return next();
  }
  res.status(401).json({ message: "Invalid Token: (Unauthorized!)" });
};
