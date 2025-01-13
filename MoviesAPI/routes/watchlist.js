
const express = require('express');
const router = express.Router();

const { addToWatchList, deleteFromList, getWatchList } = require('../controllers/watchlistControllers')
const { validatToken } = require('../middlewares/auth')

router.post('/', validatToken, addToWatchList)
router.delete('/:movie', validatToken, deleteFromList)
router.get('/', validatToken, getWatchList)

module.exports = router;
