const express = require('express');
const router = express.Router();

const { create, update, deleteMovie, getAllMovies, getMovie, addReview, reviews } = require('../controllers/moviesControllers');
const {validatToken} = require('../middlewares/auth');
const {isAdmin} = require('../middlewares/isAdmin')

router.post('/', [validatToken, isAdmin], create)
router.put('/:id', [validatToken, isAdmin], update)
router.delete('/:id', [validatToken, isAdmin], deleteMovie)

router.get('/', validatToken, getAllMovies)
router.get('/:id', validatToken, getMovie)

router.post('/:id/reviews', validatToken, addReview)
router.get('/:id/reviews', reviews)

module.exports = router;
