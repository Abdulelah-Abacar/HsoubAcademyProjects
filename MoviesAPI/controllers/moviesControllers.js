const Movie = require('../models/Movie')

exports.create = async (req, res) => {
  const { name, category, description } = req.body;

  const movie = new Movie({ name, category, description });
  try {
    await movie.save();
    res.status(201).json({success: true, data: movie})
  } catch (e) {
    res.status(409).json({message: e.message});
  }
}

exports.getMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id).select('-reviews');
    res.status(200).json({success: true, data: movie})
  } catch (e) {
    res.status(404).json({message: "Not Found"})
  }
}

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, category, description } = req.body;

  await Movie.updateOne({ _id: id }, { 
    $set: { name, category, description }
  });

  res.json({success: true});
}

exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  await Movie.deleteOne({ _id: id });
  res.json({ success: true });
}

exports.getAllMovies = async (req, res) => {
  const page = req.query?.page || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  const total = await Movie.countDocuments();
  const pages = Math.ceil(total/limit);

  try {
    const movies = await Movie.find().select('-reviews').skip(skip).limit(limit);
    res.status(200).json({success: true, pages, data: movies})
  } catch (e) {
    res.status(404).json({message: "No Movies"})
  }
}

exports.reviews = async (req, res) => {
    const { id } = req.params;
    try {
      const movie = await Movie.findById(id).select('-reviews._id').populate('reviews.user', 'name');
      res.json({message: true, data: movie.reviews});
    } catch (e) {
      res.status(404).json({message: "No Reviwes"});
    }
}

exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { comment, rate } = req.body;

  try {
    const movie = await Movie.findById(id);
    const isRated = movie.reviews.findIndex(review => review.user == req.userId)

    if (isRated > -1) 
      return res.status(403).send({ message: 'Review is already added.' })

    const totalRate = movie.reviews.reduce((sum, review) => sum + review.rate, 0)
    const finalRate = (totalRate + rate) / (movie.reviews.length + 1)

    await Movie.updateOne(
      { _id: id },
      {
        $push: {
          reviews: {
            user: req.userId, comment, rate
          }
        },
        $set: { rate: finalRate }
      }
    )
  } catch (e) {
    res.status(404).json({message: "No Review"})
  }
  res.json({message: true})
}