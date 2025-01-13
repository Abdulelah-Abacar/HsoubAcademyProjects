const express = require("express");
const { register, login, me, getProfile } = require("../controllers/userController");
const { index } = require("../controllers/doctorController");
const { SaveUser } = require("../middlewares/validators");
const validate = require("../handlers/validation");
const isLoggedIn = require("../middlewares/auth");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({message: "Hello World!!"});
})

router.post('/account/signup', validate(SaveUser), register);
router.post('/account/signin', login);
router.get('/account/me', isLoggedIn, me);
router.get('/account/profile', isLoggedIn, getProfile);

router.get('/doctors', index);

module.exports = router;