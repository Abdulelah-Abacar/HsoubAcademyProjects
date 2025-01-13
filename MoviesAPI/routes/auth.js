
const express = require('express');
const {validatToken} = require('../middlewares/auth');
const { login, register, me } = require('../controllers/authControllers');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', validatToken, me);

module.exports = router;
